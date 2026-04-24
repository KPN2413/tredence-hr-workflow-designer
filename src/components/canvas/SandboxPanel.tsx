"use client";

import { CheckCircle2, Loader2, Play, XCircle } from "lucide-react";
import type { SimulationResult, WorkflowGraph } from "@/types/workflow";

export function SandboxPanel({
  workflow,
  result,
  isRunning,
  error,
  onRun
}: {
  workflow: WorkflowGraph;
  result: SimulationResult | null;
  isRunning: boolean;
  error: string | null;
  onRun: () => void;
}) {
  return (
    <div className="absolute bottom-5 left-5 z-10 w-[420px] rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Workflow sandbox</p>
          <h3 className="mt-1 text-base font-bold text-slate-900">Test designed graph</h3>
          <p className="mt-1 text-xs text-slate-500">
            {workflow.nodes.length} nodes · {workflow.edges.length} edges serialized to mock /simulate API
          </p>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Run
        </button>
      </div>

      {error ? <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {result ? (
        <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
          {result.ok ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} /> Simulation completed
            </div>
          ) : (
            <div className="space-y-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <div className="flex items-center gap-2 font-semibold">
                <XCircle size={16} /> Simulation blocked
              </div>
              <ul className="list-disc space-y-1 pl-5">
                {result.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.steps.map((step, index) => (
            <div key={`${step.nodeId}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Step {index + 1} · {step.nodeType}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">{step.title}</p>
              <p className="mt-1 text-xs text-slate-500">{step.message}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
