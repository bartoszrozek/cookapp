export interface AddToScheduleModalProps {
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
