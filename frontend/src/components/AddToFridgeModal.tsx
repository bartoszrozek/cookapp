import React from "react";

interface AddToFridgeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  fridgeAdding: boolean;
  fridgeError: string | null;
  fridgeForm: {
    quantity: string;
    unit: string;
    expiration_date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ingredientName?: string;
}

const AddToFridgeModal: React.FC<AddToFridgeModalProps> = ({
  open,
  onClose,
  onSubmit,
  fridgeAdding,
  fridgeError,
  fridgeForm,
  onInputChange,
  ingredientName
}) => (
  <div>
    {open && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h3>{ingredientName ? `Add to Fridge: ${ingredientName}` : 'Add to Fridge'}</h3>
          <form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <input
              name="quantity"
              placeholder="Quantity"
              type="number"
              step="any"
              value={fridgeForm.quantity}
              onChange={onInputChange}
              required
            />
            <input
              name="unit"
              placeholder="Unit"
              value={fridgeForm.unit}
              onChange={onInputChange}
              required
            />
            <input
              name="expiration_date"
              placeholder="Expiration Date (YYYY-MM-DD)"
              type="date"
              value={fridgeForm.expiration_date}
              onChange={onInputChange}
              required
            />
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <button type="submit" disabled={fridgeAdding} style={{padding: '0.5em 1.5em'}}>Add</button>
              <button type="button" onClick={onClose}>Cancel</button>
              {fridgeError && <span style={{color: 'red'}}>{fridgeError}</span>}
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

export default AddToFridgeModal;
