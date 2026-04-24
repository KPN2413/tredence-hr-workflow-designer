"use client";

import { Handle, Position } from "@xyflow/react";
import { CheckCircle2, FileCheck2, Flag, GitPullRequestArrow, PlayCircle, Settings2 } from "lucide-react";
import { cn } from "@/lib/classNames";
import type { WorkflowNodeType } from "@/types/workflow";

const iconMap = {
  start: PlayCircle,
  task: FileCheck2,
  approval: GitPullRequestArrow,
  automated: Settings2,
  end: Flag
};

const toneMap: Record<WorkflowNodeType, string> = {
  start: "border-emerald-200 bg-emerald-50 text-emerald-700",
  task: "border-sky-200 bg-sky-50 text-sky-700",
  approval: "border-violet-200 bg-violet-50 text-violet-700",
  automated: "border-amber-200 bg-amber-50 text-amber-700",
  end: "border-slate-200 bg-slate-50 text-slate-700"
};

export function BaseNode({
  kind,
  title,
  subtitle,
  selected,
  hasErrors
}: {
  kind: WorkflowNodeType;
  title: string;
  subtitle: string;
  selected: boolean;
  hasErrors: boolean;
}) {
  const Icon = iconMap[kind];

  return (
    <div
      className={cn(
        "w-64 rounded-2xl border bg-white p-3 shadow-soft transition",
        selected ? "border-slate-900 ring-4 ring-slate-200" : "border-slate-200",
        hasErrors ? "border-red-400 ring-4 ring-red-100" : ""
      )}
    >
      {kind !== "start" ? <Handle type="target" position={Position.Left} className="!h-3 !w-3 !bg-slate-500" /> : null}

      <div className="flex items-start gap-3">
        <div className={cn("rounded-xl border p-2", toneMap[kind])}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-slate-900">{title}</p>
            {!hasErrors ? <CheckCircle2 size={14} className="shrink-0 text-emerald-500" /> : null}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {kind.replace("automated", "auto step")}
      </div>

      {kind !== "end" ? <Handle type="source" position={Position.Right} className="!h-3 !w-3 !bg-slate-500" /> : null}
    </div>
  );
}
