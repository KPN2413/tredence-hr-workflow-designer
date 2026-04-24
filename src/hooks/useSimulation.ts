"use client";

import { useState } from "react";
import { simulateWorkflow } from "@/lib/mockApi";
import type { SimulationResult, WorkflowGraph } from "@/types/workflow";

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (workflow: WorkflowGraph) => {
    setIsRunning(true);
    setError(null);

    try {
      const simulation = await simulateWorkflow(workflow);
      setResult(simulation);
      return simulation;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Simulation failed.";
      setError(message);
      return null;
    } finally {
      setIsRunning(false);
    }
  };

  const clearSimulation = () => {
    setResult(null);
    setError(null);
  };

  return { result, isRunning, error, runSimulation, clearSimulation };
}
