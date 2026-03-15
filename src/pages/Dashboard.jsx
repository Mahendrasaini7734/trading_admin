import React, { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await api.get("/excel/auto-status");
      setStatus(res.data);
      setErr("");
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Live auto-trading status refreshes every 10 seconds.
      </p>

      {err && (
        <div style={{ padding: 12, background: "#ffecec", border: "1px solid #ffbcbc", borderRadius: 8 }}>
          <b>Error:</b> {err}
        </div>
      )}

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <button onClick={fetchStatus}>Refresh</button>
        <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
{JSON.stringify(status, null, 2)}
        </pre>
      </div>
    </div>
  );
}
