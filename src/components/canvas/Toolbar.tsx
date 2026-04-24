"use client";

import { Download, RefreshCcw, Trash2, Upload } from "lucide-react";

export function Toolbar({
  onReset,
  onDeleteSelected,
  onExport,
  onImport
}: {
  onReset: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}) {
  return (
    <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-soft backdrop-blur">
      <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        <RefreshCcw size={16} /> Reset
      </button>
      <button type="button" onClick={onDeleteSelected} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        <Trash2 size={16} /> Delete
      </button>
      <button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        <Download size={16} /> Export JSON
      </button>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        <Upload size={16} /> Import JSON
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onImport(file);
            event.currentTarget.value = "";
          }}
        />
      </label>
    </div>
  );
}
