import { useEffect, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";

export const todayIso = () => new Date().toLocaleDateString("en-CA");
export const fmtDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
export const fmtDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function downloadCsv(text: string, name: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-${todayIso()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Money / number box that lets you type "0.5" without the field fighting you. */
export function Num({ value, onChange, ...rest }: { value: number; onChange: (n: number) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  const [s, setS] = useState(value ? String(value) : "");
  useEffect(() => { if (Number(s || 0) !== value) setS(value ? String(value) : ""); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <input
      {...rest}
      type="number" step="0.01" min="0" inputMode="decimal" value={s}
      onChange={(e) => { setS(e.target.value); onChange(e.target.value === "" ? 0 : Number(e.target.value)); }}
    />
  );
}

/** The slide-up form used by reservations and actions (same look as the client form). */
export function Sheet({ title, onClose, onSubmit, children }: { title: string; onClose: () => void; onSubmit: (e: FormEvent) => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="pt__ov" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="pt__sheet" onSubmit={onSubmit}>
        <div className="pt__sh">
          <h2 className="pt__h2">{title}</h2>
          <button type="button" className="pt__x" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </form>
    </div>
  );
}
