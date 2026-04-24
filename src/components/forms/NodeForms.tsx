"use client";

import { useMemo } from "react";
import { Field, Select, TextArea, TextInput, Toggle } from "@/components/forms/FormPrimitives";
import { KeyValueEditor } from "@/components/forms/KeyValueEditor";
import type {
  ApprovalConfig,
  AutomatedConfig,
  AutomationAction,
  EndConfig,
  StartConfig,
  TaskConfig,
  WorkflowNode,
  WorkflowNodeConfig
} from "@/types/workflow";

function mergeConfig<T extends WorkflowNodeConfig>(config: T, patch: Partial<T>): T {
  return { ...config, ...patch };
}

export function NodeForm({
  node,
  automations,
  onChange
}: {
  node: WorkflowNode;
  automations: AutomationAction[];
  onChange: (config: WorkflowNodeConfig) => void;
}) {
  const errors = node.data.validationErrors ?? [];

  return (
    <div className="space-y-4">
      {errors.length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">Validation issues</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {node.data.kind === "start" ? (
        <StartNodeForm config={node.data.config as StartConfig} onChange={onChange} />
      ) : null}
      {node.data.kind === "task" ? <TaskNodeForm config={node.data.config as TaskConfig} onChange={onChange} /> : null}
      {node.data.kind === "approval" ? (
        <ApprovalNodeForm config={node.data.config as ApprovalConfig} onChange={onChange} />
      ) : null}
      {node.data.kind === "automated" ? (
        <AutomatedNodeForm config={node.data.config as AutomatedConfig} automations={automations} onChange={onChange} />
      ) : null}
      {node.data.kind === "end" ? <EndNodeForm config={node.data.config as EndConfig} onChange={onChange} /> : null}
    </div>
  );
}

function StartNodeForm({ config, onChange }: { config: StartConfig; onChange: (config: WorkflowNodeConfig) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Start title">
        <TextInput value={config.title} onChange={(e) => onChange(mergeConfig(config, { title: e.target.value }))} />
      </Field>
      <KeyValueEditor value={config.metadata} onChange={(metadata) => onChange(mergeConfig(config, { metadata }))} title="Metadata" />
    </div>
  );
}

function TaskNodeForm({ config, onChange }: { config: TaskConfig; onChange: (config: WorkflowNodeConfig) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput value={config.title} onChange={(e) => onChange(mergeConfig(config, { title: e.target.value }))} />
      </Field>
      <Field label="Description">
        <TextArea value={config.description} onChange={(e) => onChange(mergeConfig(config, { description: e.target.value }))} />
      </Field>
      <Field label="Assignee">
        <TextInput value={config.assignee} onChange={(e) => onChange(mergeConfig(config, { assignee: e.target.value }))} />
      </Field>
      <Field label="Due date">
        <TextInput type="date" value={config.dueDate} onChange={(e) => onChange(mergeConfig(config, { dueDate: e.target.value }))} />
      </Field>
      <KeyValueEditor value={config.customFields} onChange={(customFields) => onChange(mergeConfig(config, { customFields }))} />
    </div>
  );
}

function ApprovalNodeForm({ config, onChange }: { config: ApprovalConfig; onChange: (config: WorkflowNodeConfig) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput value={config.title} onChange={(e) => onChange(mergeConfig(config, { title: e.target.value }))} />
      </Field>
      <Field label="Approver role">
        <Select value={config.approverRole} onChange={(e) => onChange(mergeConfig(config, { approverRole: e.target.value }))}>
          <option>Manager</option>
          <option>HRBP</option>
          <option>Director</option>
          <option>Finance Lead</option>
        </Select>
      </Field>
      <Field label="Auto-approve threshold" hint="Allowed range: 0 to 100">
        <TextInput
          type="number"
          min={0}
          max={100}
          value={config.autoApproveThreshold}
          onChange={(e) => onChange(mergeConfig(config, { autoApproveThreshold: Number(e.target.value) }))}
        />
      </Field>
    </div>
  );
}

function AutomatedNodeForm({
  config,
  automations,
  onChange
}: {
  config: AutomatedConfig;
  automations: AutomationAction[];
  onChange: (config: WorkflowNodeConfig) => void;
}) {
  const selectedAction = useMemo(
    () => automations.find((automation) => automation.id === config.actionId) ?? automations[0],
    [automations, config.actionId]
  );

  const changeAction = (actionId: string) => {
    const action = automations.find((item) => item.id === actionId);
    const params = Object.fromEntries((action?.params ?? []).map((param) => [param, config.params[param] ?? ""]));
    onChange(mergeConfig(config, { actionId, params }));
  };

  const updateParam = (param: string, value: string) => {
    onChange(mergeConfig(config, { params: { ...config.params, [param]: value } }));
  };

  return (
    <div className="space-y-4">
      <Field label="Title">
        <TextInput value={config.title} onChange={(e) => onChange(mergeConfig(config, { title: e.target.value }))} />
      </Field>
      <Field label="Mock API action">
        <Select value={config.actionId} onChange={(e) => changeAction(e.target.value)}>
          {automations.map((automation) => (
            <option key={automation.id} value={automation.id}>
              {automation.label}
            </option>
          ))}
        </Select>
      </Field>
      {selectedAction ? <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">{selectedAction.description}</p> : null}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Action parameters</p>
        {(selectedAction?.params ?? []).map((param) => (
          <Field key={param} label={param}>
            <TextInput value={config.params[param] ?? ""} onChange={(e) => updateParam(param, e.target.value)} />
          </Field>
        ))}
      </div>
    </div>
  );
}

function EndNodeForm({ config, onChange }: { config: EndConfig; onChange: (config: WorkflowNodeConfig) => void }) {
  return (
    <div className="space-y-4">
      <Field label="End message">
        <TextInput value={config.message} onChange={(e) => onChange(mergeConfig(config, { message: e.target.value }))} />
      </Field>
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Show summary</p>
          <p className="text-xs text-slate-400">Display summary flag during simulation.</p>
        </div>
        <Toggle checked={config.showSummary} onChange={(showSummary) => onChange(mergeConfig(config, { showSummary }))} />
      </div>
    </div>
  );
}
