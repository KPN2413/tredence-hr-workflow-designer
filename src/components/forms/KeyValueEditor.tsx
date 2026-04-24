"use client";

import { Plus, Trash2 } from "lucide-react";
import { TextInput } from "@/components/forms/FormPrimitives";
import type { KeyValuePair } from "@/types/workflow";

export function KeyValueEditor({
  value,
  onChange,
  title = "Custom fields"
}: {
  value: KeyValuePair[];
  onChange: (next: KeyValuePair[]) => void;
  title?: string;
}) {
  const addRow = () => onChange([...value, { id: crypto.randomUUID(), key: "", value: "" }]);
  const updateRow = (id: string, patch: Partial<KeyValuePair>) => {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };
  const removeRow = (id: string) => onChange(value.filter((item) => item.id !== id));

  return (
    <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {value.length === 0 ? (
        <p className="rounded-xl bg-white px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-100">No key-value pairs added.</p>
      ) : null}

      {value.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <TextInput placeholder="key" value={item.key} onChange={(e) => updateRow(item.id, { key: e.target.value })} />
          <TextInput placeholder="value" value={item.value} onChange={(e) => updateRow(item.id, { value: e.target.value })} />
          <button
            type="button"
            onClick={() => removeRow(item.id)}
            className="rounded-xl border border-slate-200 bg-white px-2 text-slate-500 hover:text-red-600"
            aria-label="Remove field"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
