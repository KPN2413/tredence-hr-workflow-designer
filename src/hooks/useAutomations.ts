"use client";

import { useEffect, useState } from "react";
import { getAutomations } from "@/lib/mockApi";
import type { AutomationAction } from "@/types/workflow";

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAutomations()
      .then((items) => {
        if (active) setAutomations(items);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load automations.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { automations, isLoading, error };
}
