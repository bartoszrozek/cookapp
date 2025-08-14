import React from "react";
import Modal from "./Modal";
import type { AddIngredientModalProps } from "../../types/Ingredients.types";

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  open,
  onClose,
  onSubmit,
  adding,
  addError,
  newIngredient,
  onInputChange
}) => (
  <Modal open={open} onClose={onClose} title="Add Ingredient">
    <form className="modal-form" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
  </Modal>
);

export default AddIngredientModal;
