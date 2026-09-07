import { useEffect, useRef, type ReactNode } from "react";
import { X, Inbox } from "lucide-react";
export function Badge({ children }: { children: ReactNode }) {
  const value = String(children);
  return (
    <span
      className={`badge ${/Completed|Validated|Strong|Passed/.test(value) ? "success" : /High|Rejected|Cancelled|Failed/.test(value) ? "danger" : /Pending|Hold|Information/.test(value) ? "warning" : ""}`}
    >
      {children}
    </span>
  );
}
export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Empty({
  text = "No records found.",
  children,
}: {
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <Inbox size={30} />
      <p>{text}</p>
      {children}
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div className="progress-row">
      <progress max="100" value={value} aria-label={`${value}% complete`} />
      <span>{value}%</span>
    </div>
  );
}
export function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog ref={ref} onCancel={onClose} aria-labelledby="modal-title">
      <div className="dialog-head">
        <h2 id="modal-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Message({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  return (
    <>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="notice success" role="status">
          {success}
        </div>
      )}
    </>
  );
}
export function Timeline({
  history,
}: {
  history: { date: string; label: string }[];
}) {
  return (
    <ol className="timeline">
      {history.map((h, i) => (
        <li key={`${h.date}-${i}`}>
          <span className="muted">{h.date}</span>
          <strong>{h.label}</strong>
        </li>
      ))}
    </ol>
  );
}
