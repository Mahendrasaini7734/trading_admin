import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import "../App.css";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [symbol, setSymbol] = useState("");
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/excel/trades", {
        params: { status, symbol, limit, offset },
      });

      setTrades(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [status, symbol, limit, offset]);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="card">
        <h2>Trades History</h2>

        <div className="filter-row">
          <select value={status} onChange={(e) => { setOffset(0); setStatus(e.target.value); }}>
            <option value="">All Status</option>
            <option value="EXECUTED">EXECUTED</option>
            <option value="FAILED">FAILED</option>
            <option value="SKIPPED">SKIPPED</option>
          </select>

          <input
            placeholder="Symbol e.g. RELIANCE-EQ"
            value={symbol}
            onChange={(e) => { setOffset(0); setSymbol(e.target.value); }}
          />

          <select value={limit} onChange={(e) => { setOffset(0); setLimit(Number(e.target.value)); }}>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>

          <button className="btn btn-primary" onClick={fetchTrades}>
            Refresh
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.7 }}>
          Total Trades: <b>{total}</b> | Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* ERROR */}
      {err && (
        <div className="error-box">
          <b>Error:</b> {err}
        </div>
      )}

      {/* TABLE */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Symbol</th>
                <th>Action</th>
                <th>Qty</th>
                <th>Trigger</th>
                <th>SL</th>
                <th>Status</th>
                <th>Order ID</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {trades.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.symbol}</td>
                  <td>
                    <span className={t.action === "BUY" ? "badge-buy" : "badge-sell"}>
                      {t.action}
                    </span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.trigger_price || "-"}</td>
                  <td>{t.sl_price || "-"}</td>
                  <td>
                    <span className="badge-status">{t.status}</span>
                  </td>
                  <td>{t.order_id || "-"}</td>
                  <td>
  {t.created_at
    ? (() => {
        const d = new Date(t.created_at);

        // Convert UTC → IST properly
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(d.getTime() + istOffset);

        const day = istTime.getDate().toString().padStart(2, "0");
        const month = (istTime.getMonth() + 1).toString().padStart(2, "0");
        const year = istTime.getFullYear();

        const hours = istTime.getHours().toString().padStart(2, "0");
        const minutes = istTime.getMinutes().toString().padStart(2, "0");
        const seconds = istTime.getSeconds().toString().padStart(2, "0");
        const millis = d.getMilliseconds().toString().padStart(3, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${millis}`;
      })()
    : "-"}
</td>
                </tr>
              ))}

              {trades.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} style={{ padding: 20, opacity: 0.6 }}>
                    No trades found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            className="btn"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0 || loading}
          >
            Prev
          </button>

          <button
            className="btn"
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
