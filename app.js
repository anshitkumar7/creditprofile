// app.js — Credit Profile System
// All API calls and shared utility functions

// ─── BASE URL ─────────────────────────────────────────────
// Change this to your deployed backend URL
const BASE_URL = 'http://localhost:5000/api';

// ─── Auth Helpers ─────────────────────────────────────────
const getToken = () => localStorage.getItem('cp_token');
const getUser = () => JSON.parse(localStorage.getItem('cp_user') || 'null');

const setAuth = (token, user) => {
  localStorage.setItem('cp_token', token);
  localStorage.setItem('cp_user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('cp_token');
  localStorage.removeItem('cp_user');
};

// Redirect to login if not authenticated
const requireAuth = () => {
  if (!getToken()) {
    window.location.href = 'auth.html';
    return false;
  }
  return true;
};

// ─── API Call Helper ──────────────────────────────────────
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ─── Show Alert ───────────────────────────────────────────
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ─── Format Currency ──────────────────────────────────────
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ─── Format Date ──────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

// ─── Set Loading State on Button ─────────────────────────
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Loading...';
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.original;
    btn.disabled = false;
  }
}

// ─── Update Nav (show/hide auth links) ───────────────────
function updateNav() {
  const user = getUser();
  const authNavBtn = document.getElementById('authNavBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplay = document.getElementById('navUser');

  if (authNavBtn) {
    authNavBtn.style.display = user ? 'none' : 'inline-flex';
  }

  if (logoutBtn) {
    logoutBtn.style.display = user ? 'inline-flex' : 'none';
  }
  if (userDisplay) {
    userDisplay.textContent = user ? user.name : '';
  }
}

// ─── Logout ───────────────────────────────────────────────
function logout() {
  clearAuth();
  window.location.href = 'index.html';
}

// ─── Animate Number ──────────────────────────────────────
function animateNumber(el, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// ─── Draw Score Ring ──────────────────────────────────────
function drawScoreRing(score) {
  const ring = document.getElementById('scoreRing');
  if (!ring) return;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score - 300) / 600; // 300–900 range
  const offset = circumference - (progress * circumference);

  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;

  // Color based on risk
  if (score >= 750) ring.style.stroke = '#4ade80';
  else if (score >= 600) ring.style.stroke = '#fbbf24';
  else ring.style.stroke = '#FB3640';
}

// Initialize nav on every page
document.addEventListener('DOMContentLoaded', updateNav);
