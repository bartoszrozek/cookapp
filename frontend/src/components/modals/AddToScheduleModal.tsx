import React from "react";
import type { AddToScheduleModalProps } from "../../types/Schedule.types";
import Modal from "./Modal";
 
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
   <Modal open={open} onClose={onClose} title={recipeName ? `Add to Schedule: ${recipeName}` : 'Add to Schedule'}>
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
   </Modal>
 );

export default AddToScheduleModal;
