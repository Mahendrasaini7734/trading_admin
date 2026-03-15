# StackEarn Admin Panel

React + Vite admin panel for StackEarn Excel Trading API.

## Setup

```bash
npm install
```

## Configure API URL

Copy `.env.example` to `.env` and set backend URL:

```bash
copy .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL= https://trading.stackearn.com
```

## Run

```bash
npm run dev
```

Open: https://trading.stackearn.com

## Pages

- Dashboard: auto status (`/excel/auto-status`)
- Upload Excel: upload + start/stop auto
- Trades: trades history (`/excel/trades`)
