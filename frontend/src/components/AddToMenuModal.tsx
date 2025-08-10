import React from "react";
import { IoMdClose } from "react-icons/io";

interface AddToMenuModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  menuAdding: boolean;
  menuError: string | null;
  menuForm: {
    date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  recipeName?: string;
}

const AddToMenuModal: React.FC<AddToMenuModalProps> = ({
  open,
  onClose,
  onSubmit,
  menuAdding,
  menuError,
  menuForm,
  onInputChange,
  recipeName
}) => (
  <>
    {open && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-header">
          <h3 className="modal-title">{recipeName ? `Add to Menu: ${recipeName}` : 'Add to Menu'}</h3>
          <button
            className="modal-close-button"
            onClick={() => onClose()}
          >
            <IoMdClose size={16} />
          </button>
        </div>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              name="date"
              placeholder="Date (YYYY-MM-DD)"
              type="date"
              value={menuForm.date}
              onChange={onInputChange}
              required
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" disabled={menuAdding} style={{ padding: '0.5em 1.5em' }}>Add</button>
              <button type="button" onClick={onClose}>Cancel</button>
              {menuError && <span style={{ color: 'red' }}>{menuError}</span>}
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);

export default AddToMenuModal;
