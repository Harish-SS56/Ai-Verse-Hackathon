import { 
  User, 
  TrendingUp, 
  Map, 
  Briefcase, 
  MessageSquare,
  Target
} from "lucide-react";
import { Agent } from "@/types/agent";

export const agents: Agent[] = [
  {
    id: "career-profiling",
    name: "Career Profiling",
    description: "Parses resume, GitHub, LinkedIn & builds your career memory",
    icon: User,
    color: "from-lavender-deep to-lavender",
    capabilities: [
      "Resume parsing",
      "GitHub analysis",
      "LinkedIn integration",
      "Grade tracking",
      "Interest mapping"
    ]
  },
  {
    id: "market-intelligence",
    name: "Market Intelligence",
    description: "Analyzes job market trends and in-demand skills",
    icon: TrendingUp,
    color: "from-lavender to-lavender-light",
    capabilities: [
      "Job description analysis",
      "Skill demand tracking",
      "Hiring trends",
      "Role feasibility"
    ]
  },
  {
    id: "skill-roadmap",
    name: "Skill Gap & Roadmap",
    description: "Creates personalized learning paths and milestones",
    icon: Map,
    color: "from-lavender-light to-cream",
    capabilities: [
      "Gap analysis",
      "Weekly milestones",
      "Project recommendations",
      "Resource curation"
    ]
  },
  {
    id: "action-application",
    name: "Action & Application",
    description: "Helps with job applications and resume tailoring",
    icon: Briefcase,
    color: "from-cream to-lavender-light",
    capabilities: [
      "Job matching",
      "Resume tailoring",
      "Application prep",
      "Deadline tracking"
    ]
  },
  {
    id: "feedback-learning",
    name: "Feedback & Learning",
    description: "Analyzes outcomes and updates your career strategy",
    icon: MessageSquare,
    color: "from-lavender-light to-lavender-deep",
    capabilities: [
      "Rejection analysis",
      "Interview feedback",
      "Strategy updates",
      "Priority adjustment"
    ]
  },
  {
    id: "progress-motivation",
    name: "Progress Checker & Motivation",
    description: "Monitors progress, sends reminders, and keeps you motivated",
    icon: Target,
    color: "from-lavender-deep to-purple-600",
    capabilities: [
      "Progress tracking",
      "Smart reminders",
      "Streak monitoring",
      "Burnout detection",
      "Motivational coaching",
      "Accountability alerts"
    ]
  }
];
