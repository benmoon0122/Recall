import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface SidebarThread {
  id: string;
  label: string;
  query: string;
}

interface ThreadsContextValue {
  threads: SidebarThread[];
  addThread: (query: string) => string; // returns the new thread id
}

const ThreadsContext = createContext<ThreadsContextValue | null>(null);

const INITIAL_THREADS: SidebarThread[] = [
  { id: "t1", label: "Lambda vs ECS decision", query: "Why did we choose Lambda over ECS for the payment service?" },
  { id: "t2", label: "DynamoDB single-table design", query: "How does our DynamoDB single-table design work?" },
  { id: "t3", label: "Nova AI integration", query: "What's our Amazon Nova integration architecture?" },
  { id: "t4", label: "CDK deployment pipeline", query: "How did we set up the CDK deployment pipeline?" },
  { id: "t5", label: "S3 data lake architecture", query: "What's the architecture for our S3 data lake?" },
];

let nextId = 100;

export function ThreadsProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<SidebarThread[]>(INITIAL_THREADS);

  const addThread = useCallback((query: string) => {
    const id = `t${nextId++}`;
    const label = query.length > 34 ? query.slice(0, 34) + "..." : query;
    setThreads((prev) => {
      if (prev.some((t) => t.query === query)) return prev;
      return [{ id, label, query }, ...prev];
    });
    return id;
  }, []);

  return (
    <ThreadsContext.Provider value={{ threads, addThread }}>
      {children}
    </ThreadsContext.Provider>
  );
}

export function useThreads() {
  const ctx = useContext(ThreadsContext);
  if (!ctx) throw new Error("useThreads must be used within ThreadsProvider");
  return ctx;
}
