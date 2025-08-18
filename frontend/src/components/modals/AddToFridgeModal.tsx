import React, {useState} from "react";
import Modal from "./Modal";
import type { AddToFridgeModalProps} from "../../types/Fridge.types";
import { addFridgeItem } from "../../api";

const AddToFridgeModal: React.FC<AddToFridgeModalProps> = ({
  open,
  onClose,
  ingredient,
  defaultQuantity = 0,
  defaultUnit = ""
}) => {
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [unit, setUnit] = useState(defaultUnit);
  const [expirationDate, setExpirationDate] = useState("");
  const ingredientName = ingredient ? ingredient.name : '';

  React.useEffect(() => {
    setQuantity(defaultQuantity);
    setUnit(defaultUnit);
  }, [defaultQuantity, defaultUnit]);

  const shiftDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };

  const handleAddToFridge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ingredient_id = ingredient.id;
      // Optionally, set user_id if your backend requires it (e.g., user_id: 1)
      await addFridgeItem({
        ingredient_id,
        user_id: 1, // Replace with actual user ID if needed
        quantity: parseFloat(quantity),
        unit,
        expiration_date: expirationDate
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to add to fridge');
    }
  };
  
  return (
  <Modal open={open} onClose={onClose} title={ingredientName ? `Add to Fridge: ${ingredientName}` : 'Add to Fridge'}>
    <form className="modal-form" onSubmit={handleAddToFridge} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          step="any"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="unit">Unit</label>
        <input
          name="unit"
          placeholder="Unit"
          value={unit}
          onChange={e => setUnit(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="expiration_date">Expiration date</label>
        <input
          name="expiration_date"
          placeholder="Date (YYYY-MM-DD)"
          type="date"
          value={expirationDate}
          onChange={e => setExpirationDate(e.target.value)}
          required
        />
      </div>
      <div className="ingredient-row">
        <div>
            <button type="button" onClick={() => setExpirationDate(shiftDate(7))}>
            One week
            </button>
            <button type="button" onClick={() => setExpirationDate(shiftDate(14))}>
            Two weeks
            </button>
            <button type="button" onClick={() => setExpirationDate(shiftDate(30))}>
            One month
            </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="submit" style={{ padding: '0.5em 1.5em' }}>Add</button>
      </div>
    </form>
  </Modal>
);
}

export default AddToFridgeModal;
