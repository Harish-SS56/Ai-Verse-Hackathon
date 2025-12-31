import { LucideIcon } from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  capabilities: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId: string;
}
