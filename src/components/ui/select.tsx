import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type SelectCtx = {
  value: string | undefined;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  registerLabel: (value: string, label: string) => void;
  getLabel: (value: string) => string | undefined;
};

const Ctx = createContext<SelectCtx | null>(null);

function useSelectCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Select components must be used within <Select />");
  return ctx;
}

export function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const labelsRef = useRef<Map<string, string>>(new Map());

  const ctx = useMemo<SelectCtx>(
    () => ({
      value,
      setValue: (v) => onValueChange?.(v),
      open,
      setOpen,
      registerLabel: (v, label) => {
        labelsRef.current.set(v, label);
      },
      getLabel: (v) => labelsRef.current.get(v),
    }),
    [value, onValueChange, open]
  );

  return (
    <Ctx.Provider value={ctx}>
      <div className="relative inline-block">{children}</div>
    </Ctx.Provider>
  );
}

export function SelectTrigger({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useSelectCtx();
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      aria-expanded={open}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(!open);
      }}
      {...props}
    />
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, getLabel } = useSelectCtx();
  if (!value) return <span className="text-muted-foreground">{placeholder}</span>;
  return <span>{getLabel(value) ?? value}</span>;
}

export function SelectContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useSelectCtx();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("[data-select-root]")) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div
      data-select-root
      className={cn(
        "absolute z-50 mt-2 w-full min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  );
}

export function SelectItem({
  value,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: selected, setValue, setOpen, registerLabel } = useSelectCtx();

  useEffect(() => {
    if (typeof children === "string") registerLabel(value, children);
  }, [children, registerLabel, value]);

  const isActive = selected === value;

  return (
    <button
      type="button"
      className={cn(
        "w-full text-left px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e);
        setValue(value);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
