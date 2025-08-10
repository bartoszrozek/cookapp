import React from "react";
import { IoMdClose } from "react-icons/io";
import DivButton from "../components/DivButton";

interface AddIngredientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  adding: boolean;
  addError: string | null;
  newIngredient: {
    name: string;
    category: string;
    default_unit: string;
    calories_per_unit: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  open,
  onClose,
  onSubmit,
  adding,
  addError,
  newIngredient,
  onInputChange
}) => (
  <>
    {open && (
      <div className="modal-overlay">
        <div className="modal-header">
          <h3 className="modal-title">Add Ingredient</h3>
          <DivButton
            onClick={() => onClose()}
          >
            <IoMdClose size={24} />
          </DivButton>
        </div>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              name="name"
              placeholder="Name"
              value={newIngredient.name}
              onChange={onInputChange}
              required
            />
            <input
              name="category"
              placeholder="Category"
              value={newIngredient.category}
              onChange={onInputChange}
            />
            <input
              name="default_unit"
              placeholder="Default Unit"
              value={newIngredient.default_unit}
              onChange={onInputChange}
            />
            <input
              name="calories_per_unit"
              placeholder="Calories/Unit"
              type="number"
              step="any"
              value={newIngredient.calories_per_unit}
              onChange={onInputChange}
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" disabled={adding} style={{ padding: '0.5em 1.5em' }}>Add</button>
              {addError && <span style={{ color: 'red' }}>{addError}</span>}
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);

export default AddIngredientModal;
