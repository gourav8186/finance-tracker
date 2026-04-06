# Finance Tracker

A modern, responsive finance tracking application built with React and Vite. This app helps users manage their personal finances by tracking transactions, visualizing spending patterns, and providing insights into their financial habits.

## Features

- **Dashboard Overview**: View balance charts, spending trends, and summary cards at a glance.
- **Transaction Management**: Add, view, and manage income and expense transactions with a user-friendly form and list.
- **Visual Insights**: Interactive charts powered by Recharts to analyze spending patterns.
- **Responsive Design**: Built with Tailwind CSS for a clean, mobile-friendly interface.
- **Dark/Light Mode**: Theme switching support with next-themes.
- **State Management**: Redux Toolkit for efficient state handling.
- **Animations**: Smooth animations using Framer Motion.

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Tailwind CSS Animate
- **State Management**: Redux Toolkit, React Redux
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Themes**: Next Themes
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Linting**: ESLint

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gourav8186/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

## Usage

- **Adding Transactions**: Use the transaction form to add new income or expense entries.
- **Viewing Transactions**: Browse your transaction history in the transaction list.
- **Dashboard**: Monitor your financial overview with charts and summary cards.
- **Insights**: Analyze your spending patterns in the insights panel.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── BalanceChart.jsx
│   │   ├── SpendingChart.jsx
│   │   └── SummaryCards.jsx
│   ├── insights/
│   │   └── InsightsPanel.jsx
│   ├── layout/
│   │   └── Header.jsx
│   └── transactions/
│       ├── TransactionForm.jsx
│       └── TransactionList.jsx
├── data/
│   └── mockData.js
├── pages/
│   ├── Index.jsx
│   └── NotFound.jsx
├── store/
│   ├── index.js
│   ├── roleSlice.js
│   └── transactionsSlice.js
├── App.jsx
├── index.css
└── main.jsx
```
