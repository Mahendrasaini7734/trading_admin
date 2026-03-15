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
VITE_API_BASE_URL= http://127.0.0.1:8000
```

## Run

```bash
npm run dev
```

Open: http://127.0.0.1:8000

## Pages

- Dashboard: auto status (`/excel/auto-status`)
- Upload Excel: upload + start/stop auto
- Trades: trades history (`/excel/trades`)
