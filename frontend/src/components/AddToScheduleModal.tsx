import React from "react";
import { IoMdClose } from "react-icons/io";

interface AddToScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  scheduleAdding: boolean;
  scheduleError: string | null;
  scheduleForm: {
    date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  recipeName?: string;
}

const AddToScheduleModal: React.FC<AddToScheduleModalProps> = ({
  open,
  onClose,
  onSubmit,
  scheduleAdding,
  scheduleError,
  scheduleForm,
  onInputChange,
  recipeName
}) => (
  <>
    {open && (
      <div className="modal-overlay">
        <div className="modal-header">
          <h3 className="modal-title">{recipeName ? `Add to Schedule: ${recipeName}` : 'Add to Schedule'}</h3>
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
              value={scheduleForm.date}
              onChange={onInputChange}
              required
            />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" disabled={scheduleAdding} style={{ padding: '0.5em 1.5em' }}>Add</button>
              <button type="button" onClick={onClose}>Cancel</button>
              {scheduleError && <span style={{ color: 'red' }}>{scheduleError}</span>}
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);

export default AddToScheduleModal;
