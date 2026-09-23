import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  FileQuestion,
  Repeat,
  BrainCircuit,
  Ticket,
  MessageSquare,
  BookOpen,
  Archive,
  Workflow as WorkflowIcon,
  FileCog,
  Network,
  Database,
  Box,
  GitBranch,
  GitCommit,
  FolderGit2,
  Waypoints,
  Search,
  ListChecks,
  Sparkles,
  ShieldAlert,
  Boxes,
  LayoutGrid,
  Gauge,
  Container,
  type LucideIcon,
} from "lucide-react";

// ---------- Page 1: Challenges ----------
export interface Challenge {
  id: string;
  title: string;
  sublabel: string;
  icon: LucideIcon;
}

export const CHALLENGES: Challenge[] = [
  { id: "legacy", title: "Complex legacy systems", sublabel: "Limited documentation", icon: FileCog },
  { id: "time", title: "Time-consuming investigations", sublabel: "Evidence spread across tools", icon: Clock },
  { id: "reactive", title: "Reactive support", sublabel: "Problems found after impact", icon: AlertTriangle },
  { id: "context", title: "Incomplete Jira context", sublabel: "Previous reasoning is hard to find", icon: FileQuestion },
  { id: "repeat", title: "Repeated investigation", sublabel: "The same work is rediscovered", icon: Repeat },
  { id: "knowledge", title: "Knowledge loss", sublabel: "Slow onboarding and transfer", icon: BrainCircuit },
];

export const PE_SUPPORT_NODE = { label: "PE Support", icon: ShieldCheck };

// ---------- Page 2: Capabilities + ecosystem ----------
export interface Capability {
  id: string;
  label: string;
  relatedNodeIds: string[];
}

export const CAPABILITIES: Capability[] = [
  { id: "cases", label: "Finds similar old cases in Jira", relatedNodeIds: ["jira", "kb"] },
  { id: "slack", label: "Finds relevant Slack discussions", relatedNodeIds: ["slack"] },
  { id: "notion", label: "Surfaces the right Notion runbooks and docs", relatedNodeIds: ["notion"] },
  { id: "compare", label: "Logs a traceable evidence trail—never a hallucinated guess", relatedNodeIds: ["airflow", "cloudwatch", "s3", "dataapi", "secapi", "databases"] },
  { id: "reuse", label: "Reuses prior investigations", relatedNodeIds: ["jira", "kb"] },
  { id: "learn", label: "Learns from completed case investigations", relatedNodeIds: ["manifests", "sourcecode", "commits", "pulls"] },
];

export type EcosystemGroupId = "context" | "runtime" | "implementation";

export interface EcosystemNode {
  id: string;
  label: string;
  icon: LucideIcon;
  group: EcosystemGroupId;
}

export const ECOSYSTEM_NODES: EcosystemNode[] = [
  { id: "jira", label: "Jira", icon: Ticket, group: "context" },
  { id: "slack", label: "Slack", icon: MessageSquare, group: "context" },
  { id: "notion", label: "Notion", icon: BookOpen, group: "context" },
  { id: "kb", label: "Knowledge Base", icon: Archive, group: "context" },

  { id: "airflow", label: "Airflow", icon: WorkflowIcon, group: "runtime" },
  { id: "cloudwatch", label: "CloudWatch", icon: Gauge, group: "runtime" },
  { id: "s3", label: "S3", icon: Box, group: "runtime" },
  { id: "dataapi", label: "DataAPI", icon: Network, group: "runtime" },
  { id: "secapi", label: "SecAPI", icon: ShieldAlert, group: "runtime" },
  { id: "databases", label: "Databases", icon: Database, group: "runtime" },

  { id: "manifests", label: "Manifests", icon: FileCog, group: "implementation" },
  { id: "sourcecode", label: "Source code", icon: FolderGit2, group: "implementation" },
  { id: "commits", label: "Commits", icon: GitCommit, group: "implementation" },
  { id: "pulls", label: "Pull requests", icon: GitBranch, group: "implementation" },
];

export const ECOSYSTEM_GROUP_LABEL: Record<EcosystemGroupId, string> = {
  context: "Context",
  runtime: "Runtime evidence",
  implementation: "Implementation evidence",
};

// ---------- Architecture diagram (Page 2 deep-dive) ----------
export type ArchGroupId = "caseContext" | "application" | "platform" | "engineering";

export interface ArchNode {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ArchGroup {
  id: ArchGroupId;
  title: string;
  purpose: string;
  accent: "cyan" | "green" | "amber" | "red";
  position: "upper-left" | "upper-right" | "lower-right" | "lower-left";
  nodes: ArchNode[];
  packets: string[];
}

export const ARCH_GROUPS: ArchGroup[] = [
  {
    id: "caseContext",
    title: "Case context",
    purpose: "Understands the case, conversation, and investigation history",
    accent: "cyan",
    position: "upper-left",
    nodes: [
      { id: "jira", label: "Jira", icon: Ticket },
      { id: "slack", label: "Slack", icon: MessageSquare },
      { id: "notion", label: "Notion", icon: BookOpen },
      { id: "prevcases", label: "Previous cases", icon: Archive },
    ],
    packets: ["Symptom", "Timeline", "Conversation", "Precedent"],
  },
  {
    id: "application",
    title: "Application evidence",
    purpose: "Traces application behavior and data dependencies",
    accent: "green",
    position: "upper-right",
    nodes: [
      { id: "airflow", label: "Airflow", icon: WorkflowIcon },
      { id: "manifests", label: "Manifests", icon: FileCog },
      { id: "dataapi", label: "DataAPI", icon: Network },
      { id: "secapi", label: "SecAPI", icon: ShieldAlert },
      { id: "dissapi", label: "DissAPI", icon: Waypoints },
    ],
    packets: ["Task state", "Configuration", "API response", "Data dependency"],
  },
  {
    id: "platform",
    title: "Platform evidence",
    purpose: "Verifies runtime state, logs, storage, and infrastructure",
    accent: "amber",
    position: "lower-right",
    nodes: [
      { id: "s3", label: "S3", icon: Box },
      { id: "databases", label: "DB1", icon: Database },
      { id: "openlens", label: "OpenLens (pods)", icon: Container },
      { id: "grafana", label: "Grafana", icon: LayoutGrid },
      { id: "cloudwatch", label: "CloudWatch", icon: Gauge },
    ],
    packets: ["Log event", "File state", "Query result", "Pod status", "Metric"],
  },
  {
    id: "engineering",
    title: "Engineering evidence",
    purpose: "Connects observed behavior to code and implementation history",
    accent: "red",
    position: "lower-left",
    nodes: [
      { id: "localrepo", label: "Local repositories", icon: FolderGit2 },
      { id: "leankg", label: "LeanKG", icon: Boxes },
      { id: "gitlens", label: "GitLens", icon: GitCommit },
      { id: "github", label: "GitHub", icon: GitBranch },
    ],
    packets: ["Code path", "Commit", "Ownership", "Dependency", "Previous change"],
  },
];

export const ARCH_STAGE_COPY = [
  "A case cannot be understood from one system alone.",
  "What happened—and has it happened before?",
  "Where did the application behavior diverge?",
  "What was actually happening at runtime?",
  "Which implementation explains the observed behavior?",
  "Correlate first. Conclude second.",
];

// ---------- Page 3: Workflow ----------
export type DecisionClass =
  | "False alarm"
  | "Ops fix"
  | "Inventory"
  | "Enhancement"
  | "Blocked"
  | "Defect";

export const DECISION_CLASSES: { label: DecisionClass; sub: string; accent: string }[] = [
  { label: "False alarm", sub: "Nothing is broken", accent: "var(--text-tertiary)" },
  { label: "Ops fix", sub: "One operational action resolves it", accent: "var(--green)" },
  { label: "Inventory", sub: "List, CSV, or audit request", accent: "var(--cyan)" },
  { label: "Enhancement", sub: "New capability belongs in ENG", accent: "var(--cyan)" },
  { label: "Blocked", sub: "Human decision required", accent: "var(--amber)" },
  { label: "Defect", sub: "Verified code or configuration bug", accent: "var(--red)" },
];

export interface WorkflowStep {
  title: string;
  desc: string;
  tags?: string[];
  mono?: boolean;
}

export interface WorkflowBranch {
  question: string;
  yes: { title: string; desc: string };
  no: { title: string; desc: string };
}

export interface WorkflowStage {
  id: string;
  index: number;
  title: string;
  accent: string;
  steps: WorkflowStep[];
  branch?: WorkflowBranch;
  decisionGrid?: boolean;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "intake",
    index: 1,
    title: "Intake",
    accent: "#3b82f6",
    steps: [
      { title: "Jira PES ticket", desc: "Case enters the workflow" },
      { title: "Poll every 60s", desc: "Automatic intake while UI is up" },
      { title: "Wait: created + 5 min", desc: "Time for support to fill Jira" },
      { title: "Manual UI / CLI", desc: "Alternative direct trigger" },
    ],
  },
  {
    id: "prepare",
    index: 2,
    title: "Prepare",
    accent: "#14b8a6",
    steps: [
      { title: "Preflight", desc: "Validate creds, agent, environment" },
      { title: "Sync code repos", desc: "Pull current code and context" },
      { title: "Slack start message", desc: "Sherlock posts investigation start" },
    ],
  },
  {
    id: "route",
    index: 3,
    title: "Route first",
    accent: "#a855f7",
    steps: [
      { title: "Playbooks INDEX.md", desc: "Find the known route before exploring" },
      { title: "Prior FINAL.md + KB runbooks", desc: "PES/ENG scripts · Notion runbooks" },
    ],
    branch: {
      question: "Sibling case? Does a closely related case already exist?",
      yes: { title: "Optimized", desc: "Investigate delta only" },
      no: { title: "Full", desc: "Run full investigation" },
    },
  },
  {
    id: "investigate",
    index: 4,
    title: "Investigate with purpose",
    accent: "#f2b84b",
    steps: [
      {
        title: "Collect evidence",
        desc: "Jira · Slack threads · PRs · skills",
        tags: ["Airflow", "S3", "SecAPI", "DB1", "Code", "Pods"],
      },
      { title: "Explain each finding", desc: "Record why it mattered, not just what was found" },
    ],
    decisionGrid: true,
  },
  {
    id: "output",
    index: 5,
    title: "Output",
    accent: "#0f9d58",
    steps: [
      { title: "FINAL.md", desc: "Canonical investigation result", mono: true },
      { title: "Draft Jira comment", desc: "Human review and paste" },
      { title: "Slack thread + canvas", desc: "Progress and final summary" },
    ],
  },
  {
    id: "learn",
    index: 6,
    title: "Learn / backtrack",
    accent: "#ec4899",
    steps: [
      { title: "distill_case.sh", desc: "Extract reusable knowledge", mono: true },
      { title: "Update playbook", desc: "Optimal path + skip list" },
      { title: "Feed future routing", desc: "Next similar case starts here, not from scratch" },
    ],
  },
];

// ---------- Page 4: Improve (Playbook + Distill) ----------
export const IMPROVE_HEADING = "The process that improves Sherlock";

export const PLAYBOOK_INTRO = "A playbook tells Sherlock how to investigate a type of problem. It contains:";

export const PLAYBOOK_POINTS = [
  "When this investigation path should be used",
  "What to check first",
  "What evidence to collect",
  "What checks can be skipped",
  "When to stop investigating",
];

export const PLAYBOOK_EXAMPLE = {
  title: "A futures price changes overnight.",
  lead: "The playbook tells Sherlock to:",
  steps: [
    "Check the old and new prices.",
    "Check SecAPI history.",
    "Check the Reuters source files.",
    "Confirm whether Reuters corrected the price.",
  ],
  skipped: ["Airflow", "Helix", "Broad code searches"],
  skipNote:
    "If these records agree, Sherlock can skip Airflow, Helix, and broad code searches because they will not explain where the price came from.",
};

export const DISTILL_INTRO = "Distill is how Sherlock learns from a completed investigation. After a case finishes, it records:";

export const DISTILL_POINTS = [
  "What evidence solved the case",
  "What checks wasted time",
  "What pattern may appear again",
  "Whether a playbook should be created or updated",
];

export const DISTILL_EXAMPLE = {
  lead: "In the Reuters price investigation, checking SecAPI and the Reuters files solved the case. Checking Airflow or Helix was unnecessary.",
  addsLead: "Distill adds:",
  adds: ["SecAPI and Reuters files to the playbook's recommended steps", "Airflow and Helix to its skip list"],
  closing: "The next similar investigation can therefore start with the useful checks.",
};

// ---------- Page 5: Cases ----------
export interface CaseCheck {
  system: string;
  finding: string;
}

export interface CaseStudy {
  id: string;
  label: string;
  headline: string;
  issue: string;
  chain: string[];
  checks: CaseCheck[];
  contribution: string[];
  outcome: string;
  transformation: string;
  mode: "Investigate" | "Reuse" | "Recommend";
}

export const CASES: CaseStudy[] = [
  {
    id: "PES-1167",
    label: "PES-1167",
    headline: "Complex cross-system investigation",
    issue:
      "A valid Bloomberg curve file was skipped because the ingestion pipeline expected the wrong date.",
    chain: [
      "London holiday calendar",
      "Expected 28 Aug—not 31 Aug",
      "31 Aug file skipped",
      "Curve missing from SecAPI",
      "HSIEM calculation failed",
    ],
    checks: [
      { system: "Airflow", finding: "Ran; copied 28 Aug" },
      { system: "S3", finding: "31 Aug file missing" },
      { system: "DataAPI", finding: "Expected Friday's filename" },
      { system: "SecAPI", finding: "Curve missing 31 Aug" },
      { system: "Manifest", finding: "SOFR requires 31 Aug" },
      { system: "Jira", finding: "Vendor delivered; HSIEM still failed" },
      { system: "Source code", finding: "LnB date rollback found" },
    ],
    contribution: [
      "Connected the complete failure chain",
      "Proved a normal rerun would fail again",
      "Recommended the calendar exception and recovery sequence",
    ],
    outcome: "Production followed the proposed recovery sequence.",
    transformation: "Scattered failures → one verified root cause",
    mode: "Investigate",
  },
  {
    id: "PES-1168",
    label: "PES-1168 · using PES-352",
    headline: "Finding and safely reusing an earlier solution",
    issue:
      "The upload succeeded, but Citi's Java parser interpreted the successful API response as a failure.",
    chain: [
      "PES-1168 symptom",
      "Sherlock finds PES-352",
      "Same client/API behavior",
      "Verify portfolio and schema",
      "Reuse established resolution",
    ],
    checks: [
      { system: "Jira", finding: "Found PES-352" },
      { system: "IndexAPI", finding: "Response was valid" },
      { system: "Databases", finding: "Portfolio stored" },
      { system: "Source code", finding: "Contract unchanged" },
    ],
    contribution: [
      "Found the seven-month-old precedent",
      "Confirmed the portfolio was stored",
      "Verified the current API contract and implementation",
      "Avoided an unnecessary MerQube rollback",
    ],
    outcome: "Citi updated its parser to tolerate additional response fields.",
    transformation: "Old knowledge → verified reuse—not blind copying",
    mode: "Reuse",
  },
  {
    id: "PES-991",
    label: "PES-991 / PR #10659",
    headline: "A precise, scoped engineering recommendation",
    issue:
      "The real-time price check compared replica copies for every metric published to SecAPI, while HSIEDBUS also publishes text fields through that same path.",
    chain: [
      "Airflow DAG fails on every run",
      "SecAPI publishes text metrics",
      "One shared source-code check covers every metric",
      "Numeric checks must remain intact",
    ],
    checks: [
      { system: "Airflow", finding: "DAG failing every run" },
      { system: "SecAPI", finding: "Text metrics published" },
      { system: "Source code", finding: "One check, every metric" },
      { system: "Production rerun", finding: "Numeric checks intact" },
    ],
    contribution: [
      "Identified a type mismatch, not a pricing error",
      "Recommended comparing replicas only when the values are numeric",
      "Located the skip-and-log path inside the shared checker",
      "Defined what must remain unchanged",
    ],
    outcome: "PR #10659 implemented the same guard Sherlock proposed.",
    transformation: "One text field → scoped, type-guarded check",
    mode: "Recommend",
  },
];

// ---------- Page 6: Roadmap ----------
export interface RoadmapPhase {
  id: string;
  phase: number;
  title: string;
  points: string[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "centralize",
    phase: 1,
    title: "Centralize",
    points: ["One place for every tool"],
  },
  {
    id: "interactive",
    phase: 2,
    title: "Make it interactive",
    points: ["Chat with the investigation"],
  },
  {
    id: "automate",
    phase: 3,
    title: "Scalability",
    points: ["Usable by every team at MerQube"],
  },
];

export const ICONS = { Search, ListChecks, Sparkles };

// ---------- Page 6: Accuracy ----------
export const ACCURACY_HEADLINE = {
  value: 88.2,
  window: "14 Sep – 18 Sep · 34 tickets",
  rise: "+23.2pp since 15 Aug – 29 Aug",
};

export interface AccuracyPoint {
  label: string;
  sub: string;
  value: number;
  gain?: string;
}

export const ACCURACY_TREND: AccuracyPoint[] = [
  { label: "15 Aug – 29 Aug", sub: "20 tickets", value: 65.0 },
  { label: "30 Aug – 13 Sep", sub: "22 tickets", value: 81.8, gain: "+16.8pp" },
  { label: "14 Sep – 18 Sep", sub: "34 tickets", value: 88.2, gain: "+6.4pp" },
];

export const ACCURACY_SOURCES = ["Airflow", "Code", "Jira", "Slack", "Manifests", "SecAPI", "DataAPI", "DB", "S3"];

export interface AccuracyStage {
  era: string;
  activeSources: string[];
  memoryActive: boolean;
  title: string;
  accuracy: number;
  final?: boolean;
  gain?: string;
}

export const ACCURACY_STAGES: AccuracyStage[] = [
  {
    era: "15 Aug – 29 Aug",
    activeSources: ["Airflow", "Code"],
    memoryActive: false,
    title: "Airflow logs and code only",
    accuracy: 65.0,
  },
  {
    era: "30 Aug – 13 Sep",
    activeSources: ACCURACY_SOURCES,
    memoryActive: false,
    title: "Went into the data layer too",
    accuracy: 81.8,
    gain: "+16.8pp",
  },
  {
    era: "14 Sep – 18 Sep",
    activeSources: ACCURACY_SOURCES,
    memoryActive: true,
    title: "Plus lessons from cases already solved",
    accuracy: 88.2,
    final: true,
    gain: "+6.4pp",
  },
];
