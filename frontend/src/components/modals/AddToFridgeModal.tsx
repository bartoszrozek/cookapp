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
}) => (
     <Modal open={open} onClose={onClose} title={ingredientName ? `Add to Fridge: ${ingredientName}` : 'Add to Fridge'}>
     <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
       <input
         name="date"
         placeholder="Date (YYYY-MM-DD)"
         type="date"
         value={fridgeForm.expiration_date}
         onChange={onInputChange}
         required
       />
       <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
         <button type="submit" disabled={fridgeAdding} style={{ padding: '0.5em 1.5em' }}>Add</button>
         <button type="button" onClick={onClose}>Cancel</button>
         {fridgeError && <span style={{ color: 'red' }}>{fridgeError}</span>}
       </div>
     </form>
   </Modal>
);

export default AddToFridgeModal;
