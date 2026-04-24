"use client";

import { SlidersHorizontal } from "lucide-react";
import { NodeForm } from "@/components/forms/NodeForms";
import { NODE_LABELS, titleFromConfig } from "@/lib/workflowDefaults";
import type { AutomationAction, WorkflowNode, WorkflowNodeConfig } from "@/types/workflow";

export function NodeFormPanel({
  selectedNode,
  automations,
  onUpdate
}: {
  selectedNode?: WorkflowNode;
  automations: AutomationAction[];
  onUpdate: (nodeId: string, config: WorkflowNodeConfig) => void;
}) {
  return (
    <section className="flex h-full w-96 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-slate-900 p-2 text-white">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Node Form Panel</h2>
            <p className="text-xs text-slate-500">Controlled, type-specific configuration forms</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {selectedNode ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Selected node</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {titleFromConfig(selectedNode.data.kind, selectedNode.data.config)}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{NODE_LABELS[selectedNode.data.kind]}</p>
            </div>
            <NodeForm
              node={selectedNode}
              automations={automations}
              onChange={(config) => onUpdate(selectedNode.id, config)}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <p className="text-sm font-semibold text-slate-700">No node selected</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Click any canvas node to edit its fields here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
