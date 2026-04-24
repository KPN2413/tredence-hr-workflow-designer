"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type NodeChange
} from "@xyflow/react";
import { Sidebar } from "@/components/canvas/Sidebar";
import { NodeFormPanel } from "@/components/canvas/NodeFormPanel";
import { SandboxPanel } from "@/components/canvas/SandboxPanel";
import { Toolbar } from "@/components/canvas/Toolbar";
import { nodeTypes } from "@/components/nodes";
import { useAutomations } from "@/hooks/useAutomations";
import { useSimulation } from "@/hooks/useSimulation";
import { exportWorkflowJson, readWorkflowJson } from "@/hooks/useWorkflowJson";
import { hasValidationErrors, validateWorkflow } from "@/lib/validation";
import { createWorkflowNode, initialEdges, initialNodes, titleFromConfig } from "@/lib/workflowDefaults";
import type { WorkflowEdge, WorkflowGraph, WorkflowNode, WorkflowNodeConfig, WorkflowNodeType } from "@/types/workflow";

function enrichWithValidation(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const result = validateWorkflow({ nodes, edges });
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      validationErrors: result.nodeErrors[node.id] ?? []
    }
  }));
}

export function WorkflowDesigner() {
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<WorkflowNode>(initialNodes);
  const [edges, setEdges, onEdgesChangeBase] = useEdgesState<WorkflowEdge>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("task-1");
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
  const { automations } = useAutomations();
  const { result, isRunning, error, runSimulation, clearSimulation } = useSimulation();

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId), [nodes, selectedNodeId]);
  const workflow: WorkflowGraph = useMemo(() => ({ nodes, edges }), [nodes, edges]);
  const validation = useMemo(() => validateWorkflow(workflow), [workflow]);

  const onNodesChange = useCallback(
    (changes: NodeChange<WorkflowNode>[]) => {
      onNodesChangeBase(changes);
      clearSimulation();
    },
    [clearSimulation, onNodesChangeBase]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: `${connection.source}-${connection.target}-${Date.now()}`,
            type: "smoothstep",
            animated: true
          },
          currentEdges
        )
      );
      clearSimulation();
    },
    [clearSimulation, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/hr-workflow-node") as WorkflowNodeType;
      if (!type) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 120,
        y: event.clientY - bounds.top - 40
      };

      const newNode = createWorkflowNode(type, position);
      setNodes((currentNodes) => [...currentNodes, newNode]);
      setSelectedNodeId(newNode.id);
      clearSimulation();
    },
    [clearSimulation, setNodes]
  );

  const updateNodeConfig = useCallback(
    (nodeId: string, config: WorkflowNodeConfig) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id !== nodeId) return node;
          const label = titleFromConfig(node.data.kind, config);
          return {
            ...node,
            data: {
              ...node.data,
              label,
              config
            }
          };
        })
      );
      clearSimulation();
    },
    [clearSimulation, setNodes]
  );

  const deleteSelected = useCallback(() => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNodeId));
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId && !selectedEdgeIds.includes(edge.id)
      )
    );
    setSelectedNodeId(null);
    setSelectedEdgeIds([]);
    clearSimulation();
  }, [clearSimulation, selectedEdgeIds, selectedNodeId, setEdges, setNodes]);

  const resetWorkflow = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNodeId("task-1");
    setSelectedEdgeIds([]);
    clearSimulation();
  }, [clearSimulation, setEdges, setNodes]);

  const importWorkflow = useCallback(
    async (file: File) => {
      try {
        const imported = await readWorkflowJson(file);
        setNodes(imported.nodes);
        setEdges(imported.edges as Edge[]);
        setSelectedNodeId(imported.nodes[0]?.id ?? null);
        clearSimulation();
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Invalid workflow file.");
      }
    },
    [clearSimulation, setEdges, setNodes]
  );

  const run = useCallback(async () => {
    const validatedNodes = enrichWithValidation(nodes, edges);
    setNodes(validatedNodes);
    await runSimulation({ nodes: validatedNodes, edges });
  }, [edges, nodes, runSimulation, setNodes]);

  const validatedNodes = useMemo(() => enrichWithValidation(nodes, edges), [edges, nodes]);

  return (
    <main className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      <Sidebar />

      <section className="relative flex-1">
        <Toolbar
          onReset={resetWorkflow}
          onDeleteSelected={deleteSelected}
          onExport={() => exportWorkflowJson(workflow)}
          onImport={importWorkflow}
        />

        <div className="absolute right-5 top-5 z-10 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-soft backdrop-blur">
          <p className="font-bold text-slate-900">Graph Health</p>
          <p className={hasValidationErrors(validation) ? "text-red-600" : "text-emerald-600"}>
            {hasValidationErrors(validation) ? "Fix validation errors before final submission" : "Valid workflow structure"}
          </p>
        </div>

        <ReactFlow
          nodes={validatedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={(changes) => {
            onEdgesChangeBase(changes);
            clearSimulation();
          }}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onEdgeClick={(_, edge) => setSelectedEdgeIds([edge.id])}
          onPaneClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeIds([]);
          }}
          fitView
          className="bg-[radial-gradient(circle_at_1px_1px,#cbd5e1_1px,transparent_0)] [background-size:24px_24px]"
        >
          <Background gap={24} size={1} />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>

        <SandboxPanel workflow={workflow} result={result} isRunning={isRunning} error={error} onRun={run} />
      </section>

      <NodeFormPanel selectedNode={selectedNode} automations={automations} onUpdate={updateNodeConfig} />
    </main>
  );
}
