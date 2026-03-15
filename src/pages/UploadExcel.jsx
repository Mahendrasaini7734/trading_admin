import React, { useState, useEffect } from "react";
import { api } from "../api/client";
import { Pencil, Trash2 } from "lucide-react";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [marketName, setMarketName] = useState("");
  const [openPrice, setOpenPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [slBuffer, setSlBuffer] = useState("");

  // ================= FETCH MARKETS =================
  const fetchMarkets = async () => {
    try {
      const res = await api.get("/markets/market-data");
      setMarkets(res.data || []);
    } catch {
      setMsg("Failed to load markets");
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // ================= UPLOAD EXCEL =================
  const uploadFile = async () => {
    if (!file) return alert("Choose Excel file");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/excel-market/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("✅ Excel Uploaded & Data Saved");
      fetchMarkets();
    } catch {
      setMsg("❌ Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= START AUTO =================
  const startAuto = async () => {
    try {
      setLoading(true);
      await api.post("/excel/start-auto"); 
      // await api.post("/markets/update-open-price-now");

      setMsg("✅ Auto Started From Database");
    } catch {
      setMsg("❌ Auto Start Failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= STOP AUTO =================
  const stopAuto = async () => {
    try {
      setLoading(true);
      await api.post("/excel/stop-auto");
      setMsg("🛑 Auto Stopped");
    } catch {
      setMsg("❌ Stop Failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD / UPDATE =================
  const saveMarket = async () => {
    if (!marketName || !openPrice)
      return alert("Market Name and Open Price required");

    try {
      setLoading(true);

      const payload = {
        stock: marketName,
        open_price: parseFloat(openPrice),
        quantity: parseInt(quantity) || 0,
        sl_buffer: parseFloat(slBuffer) || 0,
      };

      if (editId) {
        await api.put(`/markets/${editId}`, payload);
      } else {
        await api.post("/markets/", payload);
      }

      resetForm();
      fetchMarkets();
      setMsg("✅ Saved Successfully");
    } catch {
      setMsg("❌ Save Failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditId(null);
    setMarketName("");
    setOpenPrice("");
    setQuantity("");
    setSlBuffer("");
  };

  // ================= DELETE =================
  const deleteMarket = async (id) => {
    if (!window.confirm("Delete this market?")) return;

    try {
      await api.delete(`/markets/${id}`);
      fetchMarkets();
      setMsg("Deleted successfully");
    } catch {
      setMsg("Delete failed");
    }
  };

  // ================= EDIT =================
  const openEdit = (market) => {
    setEditId(market.id);
    setMarketName(market.stock);
    setOpenPrice(market.open_price);
    setQuantity(market.quantity);
    setSlBuffer(market.sl_buffer);
    setShowModal(true);
  };



  return (
    <div className="page-wrapper">
      {/* Upload Card */}
      <div className="card">
        <h2>Excel Auto Trading</h2>

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button
            className="btn btn-primary"
            onClick={uploadFile}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          <button className="btn btn-success" onClick={startAuto}>
            Start Auto
          </button>

          <button className="btn btn-danger" onClick={stopAuto}>
            Stop Auto
          </button>
        </div>

        {msg && <p style={{ marginTop: "15px", color: "green" }}>{msg}</p>}
      </div>

      {/* Market List */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h3>Market List</h3>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditId(null);
              setMarketName("");
              setOpenPrice("");
              setShowModal(true);
            }}
          >
            + Add Market
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Stock</th>
                <th>Open</th>
                <th>Square</th>
                <th>Base</th>
                <th>DIG1</th>
                <th>DIG2</th>
                <th>DIG3</th>
                <th>R1_D</th>
                <th>R2_D</th>
                <th>R3_D</th>
                <th>R1_F</th>
                <th>R2_F</th>
                <th>Buy</th>
                <th>S1_F</th>
                <th>S2</th>
                <th>Sell</th>
                <th>Qty</th>
                <th>SL Buffer</th>
                {/* <th>Status</th> */}
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {markets.map((m, index) => (
                <tr key={m.id}>
                  <td>{index + 1}</td>
                  <td>{m.stock}</td>
                  <td>{Number(m.open_price).toFixed(2)}</td>
                  <td>{Number(m.square).toFixed(13)}</td>
                  <td>{m.base}</td>
                  <td>{m.dig1}</td>
                  <td>{m.dig2}</td>
                  <td>{m.dig3}</td>

                  <td>{Number(m.r1_d).toFixed(13)}</td>
                  <td>{Number(m.r2_d).toFixed(13)}</td>
                  <td>{Number(m.r3_d).toFixed(13)}</td>
                  <td>{Number(m.r1_f).toFixed(13)}</td>
                  <td>{Number(m.r2_f).toFixed(13)}</td>
                  <td>{Number(m.buy).toFixed(13)}</td>
                  <td>{Number(m.s1_f).toFixed(13)}</td>
                  <td>{Number(m.s2).toFixed(13)}</td>
                  <td>{Number(m.sell).toFixed(13)}</td>

                  <td>{m.quantity}</td>
                  <td>{m.sl_buffer}</td>

                  {/* Toggle */}
                  {/* <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={m.is_active}
                        onChange={() => toggleMarket(m.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td> */}

                  {/* Actions */}
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="icon-btn icon-edit"
                      onClick={() => openEdit(m)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="icon-btn icon-delete"
                      onClick={() => deleteMarket(m.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? "Edit Market" : "Add Market"}</h3>

            <input
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
              placeholder="Market Name"
            />

            <input
              type="number"
              value={openPrice}
              onChange={(e) => setOpenPrice(e.target.value)}
              placeholder="Open Price"
            />

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
            />

            <input
              type="number"
              value={slBuffer}
              onChange={(e) => setSlBuffer(e.target.value)}
              placeholder="SL Buffer"
            />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn" onClick={resetForm}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={saveMarket}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
