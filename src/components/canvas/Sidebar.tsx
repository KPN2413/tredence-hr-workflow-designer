"use client";

import { FileCheck2, Flag, GitPullRequestArrow, PlayCircle, Settings2 } from "lucide-react";
import { NODE_DESCRIPTIONS, NODE_LABELS } from "@/lib/workflowDefaults";
import type { WorkflowNodeType } from "@/types/workflow";

const nodePalette: { type: WorkflowNodeType; icon: React.ComponentType<{ size?: number }> }[] = [
  { type: "start", icon: PlayCircle },
  { type: "task", icon: FileCheck2 },
  { type: "approval", icon: GitPullRequestArrow },
  { type: "automated", icon: Settings2 },
  { type: "end", icon: Flag }
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, type: WorkflowNodeType) => {
    event.dataTransfer.setData("application/hr-workflow-node", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Tredence case study</p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950">HR Workflow Designer</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Drag nodes to the canvas, configure them, and run workflow simulation.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Node library</p>
        {nodePalette.map(({ type, icon: Icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            className="cursor-grab rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft active:cursor-grabbing"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{NODE_LABELS[type]}</p>
                <p className="text-xs text-slate-500">{NODE_DESCRIPTIONS[type]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 p-4 text-xs leading-5 text-slate-500">
        <p className="font-semibold text-slate-700">Submission coverage</p>
        <p className="mt-1">React Flow canvas, dynamic forms, mock APIs, sandbox, validation, export/import.</p>
      </div>
    </aside>
  );
}
