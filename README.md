# Credit Profile for E-Commerce Customers

## Folder Structure
```
project/
  client/
    index.html         → Home Page
    auth.html          → Login/Register
    dashboard.html     → Dashboard
    add-transaction.html → Add Transaction
    credit-analysis.html → Credit Analysis
    about.html         → About
    style.css          → Global Styles
    app.js             → API calls + logic
  server/
    server.js          → Express server
    models/
      User.js
      Transaction.js
    routes/
      auth.js
      transaction.js
      credit.js
  .env                 → Environment variables
  package.json
```

## Setup
1. `npm install`
2. Add MongoDB URI to `.env`
3. `node server/server.js`
4. Open `client/index.html`
