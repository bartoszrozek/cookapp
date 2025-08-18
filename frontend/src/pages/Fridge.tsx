import React, { useEffect, useState } from "react";
import "../App.css";
import { fetchFridgeItems } from "../api";
import FridgeTable from "../components/FridgeTable";

const Fridge: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFridgeItems()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading fridge...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <>
      <h2>Fridge</h2>
      <div className="tab-modal-container">
        <div className="tab-content">
          {items.length === 0 ? (
            <div>No items in fridge.</div>
          ) : (
            <FridgeTable
              items={items}
              onSubmit={() => {
                fetchFridgeItems()
                  .then(setItems)
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Fridge;
