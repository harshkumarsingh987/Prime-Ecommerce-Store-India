# Prime Ecommerce Store India – Sales Console

React + Vite dashboard: KPI cards, revenue trend, category chart, filterable transaction table.

## Run
    npm install
    npm run dev      # development
    npm run build    # production build in dist/

## Connect your backend
In `src/App.jsx`, replace `loadOrders()` (mock data) with a fetch to your endpoint.
Each order needs: id, ago (days since order), customer, city, cat, pay, status, amount.
Filter option lists (CATS, CITIES, STATUS, PAY) are at the top of the same file.
