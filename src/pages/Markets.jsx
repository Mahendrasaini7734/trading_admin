import { useEffect, useState } from "react";
import API from "../api/client";

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [newMarket, setNewMarket] = useState("");
  const [openPrice, setOpenPrice] = useState("");

  const fetchMarkets = async () => {
    const res = await API.get("/markets/");
    setMarkets(res.data);
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const addMarket = async () => {
    await API.post("/markets/", null, {
      params: { market_name: newMarket, open_price: openPrice },
    });
    fetchMarkets();
  };

  const deleteMarket = async (id) => {
    await API.delete(`/markets/${id}`);
    fetchMarkets();
  };

  return (
    <div>
      <h2>Markets List</h2>

      <input
        placeholder="Market Name"
        value={newMarket}
        onChange={(e) => setNewMarket(e.target.value)}
      />

      <input
        placeholder="Open Price"
        value={openPrice}
        onChange={(e) => setOpenPrice(e.target.value)}
      />

      <button onClick={addMarket}>Add</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Open Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m) => (
            <tr key={m.id}>
              <td>{m.market_name}</td>
              <td>{m.open_price}</td>
              <td>
                <button onClick={() => deleteMarket(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
