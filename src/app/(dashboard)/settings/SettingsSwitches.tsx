"use client";

import { useState, useEffect } from "react";


export function SettingsSwitch({ id, initialState = false }: { id: string, initialState?: boolean }) {
  const [checked, setChecked] = useState(initialState);

  useEffect(() => {
    const saved = localStorage.getItem(`settings_${id}`);
    if (saved !== null) {
      // eslint-disable-next-line
      setChecked(saved === "true");
    }
  }, [id]);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    localStorage.setItem(`settings_${id}`, String(next));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-input"}`}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
