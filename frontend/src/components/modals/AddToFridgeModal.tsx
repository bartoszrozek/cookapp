import React from "react";
import Modal from "./Modal";
import type { AddToFridgeModalProps } from "../../types/Fridge.types";

const AddToFridgeModal: React.FC<AddToFridgeModalProps> = ({
  open,
  onClose,
  onSubmit,
  fridgeAdding,
  fridgeError,
  fridgeForm,
  onInputChange,
  ingredientName
}) => {
  const shiftDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };
  
  return (
  <Modal open={open} onClose={onClose} title={ingredientName ? `Add to Fridge: ${ingredientName}` : 'Add to Fridge'}>
    <form className="modal-form" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          name="quantity"
          placeholder="Quantity"
          type="number"
          step="any"
          value={fridgeForm.quantity}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="unit">Unit</label>
        <input
          name="unit"
          placeholder="Unit"
          value={fridgeForm.unit}
          onChange={onInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="expiration_date">Expiration date</label>
        <input
          name="expiration_date"
          placeholder="Date (YYYY-MM-DD)"
          type="date"
          value={fridgeForm.expiration_date}
          onChange={onInputChange}
          required
        />
      </div>
      <div className="ingredient-row">
        <div>
            <button type="button" onClick={() => onInputChange({ target: { name: "expiration_date", value: shiftDate(7)} })}>
            One week
            </button>
            <button type="button" onClick={() => onInputChange({ target: { name: "expiration_date", value: shiftDate(14)} })}>
            Two weeks
            </button>
            <button type="button" onClick={() => onInputChange({ target: { name: "expiration_date", value: shiftDate(30)} })}>
            One month
            </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="submit" disabled={fridgeAdding} style={{ padding: '0.5em 1.5em' }}>Add</button>
        {fridgeError && <span style={{ color: 'red' }}>{fridgeError}</span>}
      </div>
    </form>
  </Modal>
);
}

export default AddToFridgeModal;
