import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  CheckCircle2,
  Rocket,
  Wrench,
  Pencil,
  ChevronDown,
  ChevronRight,
  X,
  TrendingUp,
  Users,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Search,
  Sparkles,
  Activity,
  Flag,
  Compass,
  Eye,
  ExternalLink,
  Calendar,
  CircleOff,
  Ban,
  Smartphone,
  HeartPulse,
} from "lucide-react";

// ─── Notion Schema Types ──────────────────────────────────────────────────────

type NotionStatus =
  | "Completed"
  | "Development Cycle"
  | "Design Cycle"
  | "Product Planning"
  | "Upcoming"
  | "Blocked"
  | "Cancelled";

type UrgencyRating = "🔥" | "3" | "2" | "1";

type ProductArea =
  | "Retail"
  | "Loss Prevention"
  | "AI"
  | "Loyalty"
  | "Production"
  | "Reporting"
  | "Donation Tracking"
  | "Point-of-Sale"
  | "Inventory Management"
  | "E-commerce"
  | "Tablet App"
  | "Database and Backend"
  | "ALL"
  | "TEAM"
  | "API"
  | "Automation"
  | "Mobile App";

type ProductInvolvement =
  | "Long-term planning"
  | "Support"
  | "Research"
  | "Discovery"
  | "Communications"
  | "Short-term planning"
  | "Deliverable"
  | "Rollout"
  | "Release Planning";

interface NotionProject {
  id: string;
  url: string;
  docName: string;
  benefits: string;
  projectStatus: NotionStatus;
  productArea: ProductArea[];
  productInvolvement: ProductInvolvement[];
  developmentTeam: string[];
  urgencyRating?: UrgencyRating;
  owner?: string;
  link?: string;
  quickNote?: string;
  startDate?: string;
  endDate?: string;
}

// ─── Real Notion Data (sourced from Product Team Project Documentation database)
// Last synced: May 14, 2026 · notion.so/uprightlabshq/2f10c3d2153880e98546c1a16fde4f3b
// Statuses reflect Notion "Project Status" field values

const PROJECTS: NotionProject[] = [
  // ── Development Cycle ──────────────────────────────────────────────────────
  {
    id: "mobile-payment",
    url: "https://www.notion.so/33c0c3d21538806a9276ecc56d193fbf",
    docName: "[Solutions DGR] POS Android App – Mobile Payment Handling",
    benefits:
      "Enables fast, anywhere checkout (line busting), reducing wait times and increasing conversion — cashiers complete the full transaction on tablet without the customer returning to a register.",
    projectStatus: "Design Cycle",
    productArea: ["Point-of-Sale", "Tablet App", "Retail"],
    productInvolvement: ["Discovery", "Research", "Short-term planning", "Rollout", "Release Planning"],
    developmentTeam: [],
    urgencyRating: "🔥",
    quickNote:
      "Next iteration of line busting will include payment processing. Credit card processor path (Pax A920 + POSLink) needs confirmation.",
  },
  {
    id: "ai-sorting",
    url: "https://www.notion.so/3260c3d215388053841be696dfc89e01",
    docName: "[Solutions DGR and pearldive] AI Automation Tools for Sorting",
    benefits:
      "Reduces manual sorting effort and increases accuracy/consistency — speeding item processing, lowering labor cost, and routing more high-value items to e-commerce.",
    projectStatus: "Product Planning",
    productArea: ["AI", "Production", "Retail"],
    productInvolvement: ["Discovery", "Research", "Communications", "Short-term planning"],
    developmentTeam: ["Dmitry Grabarev", "Dusan"],
    urgencyRating: "🔥",
    quickNote: "Alignment needed with pearldive team.",
  },
  {
    id: "pos-credit-cards",
    url: "https://www.notion.so/33c0c3d2153880c19b64e00c88b60fd3",
    docName: "[Solutions DGR] POS – Credit Card Processing",
    benefits:
      "Adds credit card payment support at the point of sale, reducing cash handling, speeding up transactions, and expanding payment flexibility for donors and customers.",
    projectStatus: "Development Cycle",
    productArea: ["Point-of-Sale", "Retail"],
    productInvolvement: ["Deliverable"],
    developmentTeam: ["Cris Victoria", "Mario", "Nikola"],
    urgencyRating: "3",
  },
  {
    id: "snap-grid",
    url: "https://www.notion.so/3190c3d2153880f7aa92e35c13d81bb2",
    docName: '[Solutions DGR] Production "Snap Grid"',
    benefits:
      "Reduces time to complete product classification in the production workflow — speeding up item processing for high-volume donation centers and improving sorting accuracy.",
    projectStatus: "Development Cycle",
    productArea: ["Production", "Inventory Management"],
    productInvolvement: ["Deliverable", "Short-term planning"],
    developmentTeam: ["Junyi", "Brook", "Zoran"],
    urgencyRating: "2",
  },
  {
    id: "pack-mode",
    url: "https://www.notion.so/33b0c3d215388094bf8adda0b71602e5",
    docName: "[Link] Pack Mode",
    benefits:
      "Eliminates paper-based verification and reduces mispacks for organizations without desktop packing stations — enabling full packing workflows on device, confirmed by teams like SoCal.",
    projectStatus: "Development Cycle",
    productArea: ["Inventory Management", "Automation"],
    productInvolvement: ["Deliverable", "Short-term planning"],
    developmentTeam: ["Russell Larsen", "Mario", "Bogdan"],
    urgencyRating: "2",
  },
  {
    id: "sales-cx-dashboard",
    url: "https://www.notion.so/3600c3d21538809b9f13ee5f3cc833a8",
    docName: "[TEAM] Sales & CX Team Tools on Product Information",
    benefits:
      "Gives Sales and CX a clear source of truth for releases and product vision, improving customer communication, team confidence, and trust in the product narrative.",
    projectStatus: "Development Cycle",
    productArea: ["ALL", "TEAM"],
    productInvolvement: ["Deliverable"],
    developmentTeam: [],
    urgencyRating: "3",
    startDate: "2026-05-08",
    endDate: "2026-05-22",
    quickNote:
      "This dashboard — a live feed of product status for Sales and CX. Due May 22.",
  },
  // ── Design / Planning ──────────────────────────────────────────────────────
  {
    id: "lister-api",
    url: "https://www.notion.so/3250c3d215388097aa10ff623bfb0dac",
    docName: "[Lister] API Access Shaping",
    benefits:
      "Opens programmatic access to Lister data for enterprise customers and integration partners, enabling custom workflows and connections to existing systems.",
    projectStatus: "Design Cycle",
    productArea: ["API", "E-commerce"],
    productInvolvement: ["Discovery", "Long-term planning"],
    developmentTeam: ["Dmitry Grabarev"],
    urgencyRating: "2",
    quickNote: "Initial outline complete. Further API research underway before shaping is finalized.",
  },
  {
    id: "pos-design-audit",
    url: "https://www.notion.so/35a0c3d21538802eb7e8cab08379e9a0",
    docName: "[Solutions DGR POS] Design Audit and Debt Payoff",
    benefits:
      "Resolves design inconsistencies surfaced by enterprise customers like GCCV — improving POS usability, reducing support friction, and raising overall product quality.",
    projectStatus: "Design Cycle",
    productArea: ["Point-of-Sale", "Retail"],
    productInvolvement: ["Discovery", "Research"],
    developmentTeam: ["Junyi", "Emily Bruce"],
    urgencyRating: "2",
    quickNote:
      "Driven by GCCV documenting built-up design debt. Design review in progress.",
  },
  // ── Product Planning ───────────────────────────────────────────────────────
  {
    id: "wms",
    url: "https://www.notion.so/3250c3d2153880e58e26da5a1516fdac",
    docName: "[All] Warehouse Management System",
    benefits:
      "Adds structured warehouse management capabilities for second-hand retailers — enabling complex, large-scale inventory operations that current products don't fully support.",
    projectStatus: "Product Planning",
    productArea: ["Inventory Management", "ALL"],
    productInvolvement: ["Long-term planning", "Discovery"],
    developmentTeam: [],
    urgencyRating: "1",
    quickNote: "Initial discovery call between teams is upcoming.",
  },
  {
    id: "customer-research",
    url: "https://www.notion.so/3480c3d215388044bdeccc0d491beb96",
    docName: "[All] Customer Needs – Generative Research",
    benefits:
      "Develops unique customer cohorts and surface deep insight from 25 shared customers between Solutions and Upright, directly informing the next product roadmap cycle.",
    projectStatus: "Product Planning",
    productArea: ["ALL"],
    productInvolvement: ["Research", "Discovery"],
    developmentTeam: [],
    urgencyRating: "2",
    quickNote:
      "Scheduling interview sessions with shared customer pool — Solutions + Upright.",
  },
  {
    id: "nova-itw",
    url: "https://www.notion.so/3340c3d2153880aeb84efca74cc05093",
    docName: "[Solutions ITW] NOVA Project Management",
    benefits:
      "Migrates Solutions ITW from MySQL to PostgreSQL, improving system reliability, reducing downtime, and enabling all new platform capabilities for ITW customers.",
    projectStatus: "Development Cycle",
    productArea: ["Database and Backend", "Retail"],
    productInvolvement: ["Short-term planning"],
    developmentTeam: ["Mark Hancock", "Russell Larsen", "Jeff Tayawa", "Felipe Battistella", "Mason Hardy", "Emily Bruce", "Prateek", "Roma Santos"],
    urgencyRating: "🔥",
    quickNote: "107 story points remain. Phase 1: PostgreSQL migration; Phase 2: API migration targeting Q2–Q3.",
  },
  // ── Additional Development Cycle ───────────────────────────────────────────
  {
    id: "production-ecommerce",
    url: "https://www.notion.so/31e0c3d2153880ba9011d03bf4f8212f",
    docName: "[Solutions DGR and Lister] Production <> E-commerce Integration",
    benefits:
      "Connects production and e-commerce flows — reducing rework, speeding listings via 2D barcode support in Lister, and increasing cross-sell potential between Solutions and Upright customers.",
    projectStatus: "Development Cycle",
    productArea: ["Inventory Management", "Production", "E-commerce"],
    productInvolvement: ["Short-term planning", "Discovery"],
    developmentTeam: ["Jose", "Mike", "Brook", "Zoran", "Dusan", "Dmitry Grabarev"],
    urgencyRating: "🔥",
    quickNote: "Phase 1: 2D Barcode Support in Lister.",
    startDate: "2026-03-20",
    endDate: "2026-03-25",
  },
  {
    id: "new-donations-app",
    url: "https://www.notion.so/3190c3d215388022ba82cdada5e4ad20",
    docName: "[Solutions DGR] New Donations App",
    benefits:
      "Modernizes donation intake by merging Secure Retail and Solutions tablet app workflows into a single unified app — faster processing, better data quality, shorter donor wait times.",
    projectStatus: "Development Cycle",
    productArea: ["Donation Tracking", "Tablet App", "Retail"],
    productInvolvement: ["Support"],
    developmentTeam: [],
    urgencyRating: "3",
    startDate: "2026-02-02",
    endDate: "2026-04-03",
  },
  {
    id: "reports-beautification",
    url: "https://www.notion.so/31f0c3d2153880de9fb0eb2c79317756",
    docName: "[Solutions ITW] Reports Beautification",
    benefits:
      "Improves readability and usability of reports so customers can find insights faster and act with confidence.",
    projectStatus: "Development Cycle",
    productArea: ["Reporting", "Retail"],
    productInvolvement: ["Support"],
    developmentTeam: ["Felipe Battistella", "Russel Vergara", "Emily Bruce", "Vanessa Nacino", "Mason Hardy"],
    urgencyRating: "2",
    quickNote: "9 open tasks in Q2 2026.",
    startDate: "2025-12-01",
    endDate: "2026-03-31",
  },
  {
    id: "settings-portal",
    url: "https://www.notion.so/33c0c3d2153880fe98cafda3b250ceec",
    docName: "[Solutions ITW] Settings Portal",
    benefits:
      "Makes configuration simpler and more self-serve, reducing admin time and support tickets.",
    projectStatus: "Development Cycle",
    productArea: ["Retail"],
    productInvolvement: ["Rollout", "Release Planning", "Discovery"],
    developmentTeam: ["Russell Larsen", "Eli Hughes", "Mason Hardy"],
    urgencyRating: "1",
    quickNote: "~26 Story Points Remain.",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
  },
  {
    id: "nova-postgres",
    url: "https://www.notion.so/3340c3d2153880478a9dd0130c8872de",
    docName: "Project NOVA – Postgres Migration: Remaining Work",
    benefits:
      "Completes the platform database migration to Postgres, improving query performance, data integrity, and long-term platform reliability for every client on the system.",
    projectStatus: "Development Cycle",
    productArea: ["Database and Backend"],
    productInvolvement: ["Deliverable", "Short-term planning"],
    developmentTeam: ["Dmitry Grabarev", "Bogdan", "Dusan"],
    urgencyRating: "🔥",
    quickNote: "Can only be completed after the data transfer task.",
  },
  // ── Blocked ────────────────────────────────────────────────────────────────
  {
    id: "replication-elt",
    url: "https://www.notion.so/31f0c3d2153880b5bbf9eae95603601b",
    docName: "[Solutions DGR] Replication: ELT Tool for Reporting",
    benefits:
      "Makes reporting data more reliable and timely, reducing manual data work and improving decisions.",
    projectStatus: "Blocked",
    productArea: ["Database and Backend", "Reporting"],
    productInvolvement: ["Long-term planning", "Discovery"],
    developmentTeam: [],
    urgencyRating: "3",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
  },
  // ── Upcoming ───────────────────────────────────────────────────────────────
  {
    id: "dynamic-pricing",
    url: "https://www.notion.so/3270c3d215388003a49afe4ea10f3525",
    docName: "[Solutions DGR] Dynamic Pricing",
    benefits:
      "Optimizes prices to increase revenue and sell-through while reducing manual pricing work.",
    projectStatus: "Upcoming",
    productArea: ["Reporting", "Production", "Retail"],
    productInvolvement: ["Short-term planning"],
    developmentTeam: [],
    urgencyRating: "2",
  },
  {
    id: "automated-tests",
    url: "https://www.notion.so/33c0c3d215388019a098d92e1c152763",
    docName: "[Solutions ITW] Automated Tests",
    benefits:
      "Catches regressions earlier and reduces production issues, improving reliability for customers.",
    projectStatus: "Upcoming",
    productArea: ["Automation", "Retail"],
    productInvolvement: ["Support"],
    developmentTeam: [],
    urgencyRating: "1",
    quickNote: "3 points on one task remain.",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
  },
  {
    id: "user-group",
    url: "https://www.notion.so/33c0c3d215388052955fc6a1447b497c",
    docName: "[Solutions ITW] User Group",
    benefits:
      "Creates a feedback loop for customers to influence roadmap, improving product-market fit and satisfaction.",
    projectStatus: "Upcoming",
    productArea: ["Retail"],
    productInvolvement: ["Support"],
    developmentTeam: [],
    urgencyRating: "1",
  },
  {
    id: "production-parity",
    url: "https://www.notion.so/3570c3d2153880d5b335dff2de7ef430",
    docName: "[Solutions DGR] Production Parity with STags Pro",
    benefits:
      "Aligns production capabilities across apps so teams can work consistently, reducing training and process friction.",
    projectStatus: "Upcoming",
    productArea: ["Production", "Retail"],
    productInvolvement: ["Short-term planning"],
    developmentTeam: [],
  },
  // ── Additional Product Planning ────────────────────────────────────────────
  {
    id: "ai-epic",
    url: "https://www.notion.so/34b0c3d21538805db0c5f50c3023abb0",
    docName: "[ALL] Epic: AI Supported Workflows",
    benefits:
      "Automates repetitive tasks and reduces cognitive load, improving productivity and consistency across teams.",
    projectStatus: "Product Planning",
    productArea: ["AI", "ALL"],
    productInvolvement: ["Long-term planning", "Discovery"],
    developmentTeam: [],
  },
  {
    id: "offline-mode",
    url: "https://www.notion.so/33b0c3d2153880038abdc4f817ca59f6",
    docName: "[Solutions ITW] Offline Mode",
    benefits:
      "Keeps store operations running during connectivity issues, reducing downtime and lost sales with automatic detection and failover.",
    projectStatus: "Product Planning",
    productArea: ["Point-of-Sale", "Database and Backend", "Retail"],
    productInvolvement: ["Research", "Short-term planning"],
    developmentTeam: [],
    urgencyRating: "3",
  },
  {
    id: "odoo-inventory",
    url: "https://www.notion.so/31e0c3d215388001a106cd6c83bd527f",
    docName: "[Solutions ITW] Inventory Management (Odoo)",
    benefits:
      "Improves inventory control and operational efficiency, reducing stockouts and manual reconciliation.",
    projectStatus: "Product Planning",
    productArea: ["Inventory Management", "Retail"],
    productInvolvement: ["Long-term planning"],
    developmentTeam: ["Daim Sayed", "Dmitry Grabarev", "Emily Bruce"],
    urgencyRating: "2",
    quickNote: "9 Tasks remain | 10 Tasks in 'Ready to Deploy'.",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  NotionStatus,
  { label: string; color: string; bg: string; icon: ReactNode; order: number }
> = {
  Completed: {
    label: "Completed",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: <CheckCircle2 size={11} />,
    order: 0,
  },
  Upcoming: {
    label: "Upcoming",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: <Rocket size={11} />,
    order: 1,
  },
  "Development Cycle": {
    label: "Development",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    icon: <Activity size={11} />,
    order: 2,
  },
  "Design Cycle": {
    label: "Design",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    icon: <Pencil size={11} />,
    order: 3,
  },
  "Product Planning": {
    label: "Planning",
    color: "#8b95b0",
    bg: "rgba(139,149,176,0.1)",
    icon: <Flag size={11} />,
    order: 4,
  },
  Blocked: {
    label: "Blocked",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    icon: <Ban size={11} />,
    order: 5,
  },
  Cancelled: {
    label: "Cancelled",
    color: "#374151",
    bg: "rgba(55,65,81,0.15)",
    icon: <CircleOff size={11} />,
    order: 6,
  },
};

const URGENCY_CONFIG: Record<
  UrgencyRating,
  { label: string; color: string; order: number }
> = {
  "🔥": { label: "🔥 Critical", color: "#ef4444", order: 0 },
  "3": { label: "High", color: "#f59e0b", order: 1 },
  "2": { label: "Medium", color: "#3b82f6", order: 2 },
  "1": { label: "Low", color: "#6b7280", order: 3 },
};

const AREA_COLORS: Partial<Record<ProductArea, string>> = {
  AI: "#a855f7",
  Loyalty: "#f59e0b",
  "Loss Prevention": "#ef4444",
  "E-commerce": "#22d3ee",
  "Point-of-Sale": "#10b981",
  Reporting: "#3b82f6",
  Automation: "#8b5cf6",
  "Mobile App": "#06b6d4",
  "Tablet App": "#0891b2",
  "Inventory Management": "#d97706",
  "Donation Tracking": "#10b981",
  API: "#6366f1",
};

const AREA_DEFAULT_COLOR = "#8b95b0";

// ─── Shared Atoms ──────────────────────────────────────────────────────────────

const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const DISPLAY: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  letterSpacing: "0.04em",
};

type ViewTab = "overview" | "sales" | "cx";
type StatusFilter = NotionStatus | "All" | "Active";

function StatusBadge({ status }: { status: NotionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium leading-none whitespace-nowrap"
      style={{ color: cfg.color, backgroundColor: cfg.bg, ...MONO }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function AreaTag({ area }: { area: ProductArea }) {
  const color = AREA_COLORS[area] ?? AREA_DEFAULT_COLOR;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium leading-none border"
      style={{
        color,
        backgroundColor: `${color}14`,
        borderColor: `${color}30`,
        ...MONO,
      }}
    >
      {area}
    </span>
  );
}

function InvolvementTag({ tag }: { tag: ProductInvolvement }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium leading-none bg-white/[0.06] text-[#8b95b0] border border-white/[0.06]"
      style={MONO}
    >
      {tag}
    </span>
  );
}

function UrgencyPip({ rating }: { rating?: UrgencyRating }) {
  if (!rating) return null;
  const cfg = URGENCY_CONFIG[rating];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px]"
      style={{ color: cfg.color, ...MONO }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
}

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[22px] font-semibold" style={DISPLAY}>
        {title}
      </h2>
      {sub && (
        <p className="text-[12px] mt-0.5 text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  activeTab,
  setActiveTab,
}: {
  activeTab: ViewTab;
  setActiveTab: (t: ViewTab) => void;
}) {
  const tabs: { id: ViewTab; label: string; icon: ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Eye size={12} /> },
    { id: "sales", label: "Sales", icon: <TrendingUp size={12} /> },
    { id: "cx", label: "CX", icon: <MessageSquare size={12} /> },
  ];

  return (
    <header
      className="sticky top-0 z-30 border-b border-border"
      style={{ backgroundColor: "#07090e" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 h-[52px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-primary shrink-0">
            <Sparkles size={13} className="text-primary-foreground" />
          </div>
          <span
            className="text-[16px] font-semibold text-foreground tracking-widest hidden sm:block"
            style={DISPLAY}
          >
            PRODUCT DASHBOARD
          </span>
        </div>

        <nav className="flex items-center gap-0.5 bg-white/[0.04] rounded p-1 border border-white/[0.05]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-all duration-150 leading-none ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div
          className="flex items-center gap-2 text-[11px] shrink-0 text-muted-foreground"
          style={MONO}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <a
            href="https://www.notion.so/uprightlabshq/2f10c3d2153880e98546c1a16fde4f3b"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hidden sm:inline"
          >
            notion.so/uprightlabshq
          </a>
          <ExternalLink size={10} className="hidden sm:block" />
          <button className="hover:text-primary transition-colors ml-0.5">
            <RefreshCw size={11} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatsRow({
  projects,
  onFilterClick,
}: {
  projects: NotionProject[];
  onFilterClick: (filter: StatusFilter) => void;
}) {
  const stats = useMemo(() => {
    const completed = projects.filter((p) => p.projectStatus === "Completed").length;
    const inDev = projects.filter((p) => p.projectStatus === "Development Cycle").length;
    const upcoming = projects.filter((p) => p.projectStatus === "Upcoming").length;
    const planning = projects.filter(
      (p) => p.projectStatus === "Product Planning" || p.projectStatus === "Design Cycle"
    ).length;
    const blocked = projects.filter((p) => p.projectStatus === "Blocked").length;
    return [
      {
        label: "Completed",
        value: completed,
        color: "#10b981",
        icon: <CheckCircle2 size={14} />,
        sub: "Shipped & available",
        filter: null as StatusFilter | null,
      },
      {
        label: "Shipping Soon",
        value: inDev,
        color: "#f59e0b",
        icon: <Rocket size={14} />,
        sub: "Upcoming releases in development",
        filter: "Development Cycle" as StatusFilter,
      },
      {
        label: "In Design / Planning",
        value: planning,
        color: "#a855f7",
        icon: <Flag size={14} />,
        sub: "Design cycle + planning",
        filter: "Design Cycle" as StatusFilter,
      },
      {
        label: "Product Queue",
        value: upcoming,
        color: "#3b82f6",
        icon: <HeartPulse size={14} />,
        sub: "Awaiting product cycle",
        filter: "Upcoming" as StatusFilter,
      },
      {
        label: "Blocked",
        value: blocked,
        color: "#ef4444",
        icon: <Ban size={14} />,
        sub: "Dependencies identified",
        filter: "Blocked" as StatusFilter,
      },
    ].filter((s) => s.value > 0);
  }, [projects]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          onClick={() => s.filter && onFilterClick(s.filter)}
          className={`rounded border border-border p-4 flex flex-col gap-2 transition-all ${
            s.filter
              ? "cursor-pointer hover:border-white/20 hover:bg-white/[0.03]"
              : ""
          }`}
          style={{ backgroundColor: "#0e1220" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
              style={MONO}
            >
              {s.label}
            </span>
            <span style={{ color: s.color }}>{s.icon}</span>
          </div>
          <div
            className="text-[36px] font-bold leading-none"
            style={{ color: s.color, ...DISPLAY }}
          >
            {s.value}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            {s.sub}
            {s.filter && (
              <ArrowUpRight size={10} className="opacity-40" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Work In Flight ───────────────────────────────────────────────────────────

const ACTIVE_STATUSES: NotionStatus[] = [
  "Upcoming",
  "Development Cycle",
  "Design Cycle",
  "Product Planning",
  "Blocked",
];

const FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All Active", value: "All" },
  { label: "Development", value: "Development Cycle" },
  { label: "Design", value: "Design Cycle" },
  { label: "Planning", value: "Product Planning" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Blocked", value: "Blocked" },
];

function WorkInFlight({
  projects,
  activeFilter,
  setActiveFilter,
}: {
  projects: NotionProject[];
  activeFilter: StatusFilter;
  setActiveFilter: (f: StatusFilter) => void;
}) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const inFlight = projects.filter((p) => ACTIVE_STATUSES.includes(p.projectStatus));

  const filtered = useMemo(() => {
    return inFlight
      .filter((p) => {
        const matchFilter =
          activeFilter === "All" || p.projectStatus === activeFilter;
        const matchSearch =
          search === "" ||
          p.docName.toLowerCase().includes(search.toLowerCase()) ||
          p.productArea.some((a) =>
            a.toLowerCase().includes(search.toLowerCase())
          ) ||
          p.developmentTeam.some((t) =>
            t.toLowerCase().includes(search.toLowerCase())
          );
        return matchFilter && matchSearch;
      })
      .sort(
        (a, b) =>
          STATUS_CONFIG[a.projectStatus].order -
          STATUS_CONFIG[b.projectStatus].order
      );
  }, [inFlight, activeFilter, search]);

  const toggle = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <section>
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <SectionHeading
          title="WORK IN FLIGHT"
          sub={`${inFlight.length} initiatives across all active stages`}
        />
        <div className="relative shrink-0">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search projects, area, team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded border border-border bg-white/[0.03] text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 w-52 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((f) => {
          const count =
            f.value === "All"
              ? inFlight.length
              : inFlight.filter((p) => p.projectStatus === f.value).length;
          const isActive = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium border transition-all ${
                isActive
                  ? "border-primary/40 text-primary bg-primary/[0.08]"
                  : "border-border text-muted-foreground hover:border-white/[0.14] hover:text-foreground"
              }`}
              style={MONO}
            >
              {f.label}
              <span
                className={`text-[10px] px-1 rounded ${
                  isActive ? "bg-primary/[0.15]" : "bg-white/[0.06]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="rounded border border-border overflow-hidden"
        style={{ backgroundColor: "#0e1220" }}
      >
        <div
          className="hidden lg:grid grid-cols-[2.5fr_0.8fr_1.4fr_1fr_0.6fr_28px] gap-4 px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          style={{ ...MONO, backgroundColor: "#080c18" }}
        >
          <span>Project</span>
          <span>Status</span>
          <span>Product Area</span>
          <span>Urgency Rank</span>
          <span></span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center text-[13px] text-muted-foreground">
            No projects match current filters.
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.id}
              className={
                i < filtered.length - 1 ? "border-b border-border" : ""
              }
            >
              <div
                className="grid grid-cols-1 lg:grid-cols-[2.5fr_0.8fr_1.4fr_1fr_0.6fr_28px] gap-2 lg:gap-4 px-4 py-3 items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => toggle(p.id)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-[13px] font-medium text-foreground leading-snug truncate">
                      {p.docName}
                    </p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      title="Open in Notion"
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  {p.quickNote && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {p.quickNote}
                    </p>
                  )}
                </div>
                <StatusBadge status={p.projectStatus} />
                <div className="flex flex-wrap gap-1 hidden lg:flex">
                  {p.productArea.slice(0, 2).map((a) => (
                    <AreaTag key={a} area={a} />
                  ))}
                </div>
                <div className="hidden lg:block">
                  <UrgencyPip rating={p.urgencyRating} />
                </div>
                <ChevronRight
                  size={13}
                  className={`transition-transform duration-200 text-muted-foreground ${
                    expandedId === p.id ? "rotate-90" : ""
                  }`}
                />
              </div>

              {expandedId === p.id && (
                <div
                  className="border-t border-border px-4 py-4 space-y-4"
                  style={{ backgroundColor: "#080c18" }}
                >
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-1.5"
                      style={MONO}
                    >
                      Customer Benefits
                    </p>
                    <p className="text-[13px] leading-relaxed text-foreground">
                      {p.benefits}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                        style={MONO}
                      >
                        Product Area
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.productArea.map((a) => (
                          <AreaTag key={a} area={a} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                        style={MONO}
                      >
                        Product Involvement
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.productInvolvement.map((t) => (
                          <InvolvementTag key={t} tag={t} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                        style={MONO}
                      >
                        Development Team
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {p.developmentTeam.join(", ")}
                      </p>
                    </div>
                  </div>
                  {p.projectStatus === "Blocked" && p.quickNote && (
                    <div
                      className="rounded p-3"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.06)",
                        borderLeft: "2px solid #ef4444",
                      }}
                    >
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] mb-1"
                        style={{ color: "#ef4444", ...MONO }}
                      >
                        Blocker
                      </p>
                      <p className="text-[13px] text-foreground leading-relaxed">
                        {p.quickNote}
                      </p>
                    </div>
                  )}
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
                  >
                    <ExternalLink size={11} />
                    Open in Notion
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ─── Completed Projects ───────────────────────────────────────────────────────

function CompletedProjects({ projects }: { projects: NotionProject[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const completed = projects.filter((p) => p.projectStatus === "Completed");

  return (
    <section>
      <SectionHeading
        title="RECENTLY COMPLETED"
        sub={`${completed.length} features shipped — click to expand for Sales & CX context`}
      />

      <div className="grid grid-cols-1 gap-3">
        {completed.map((p) => {
          const expanded = expandedId === p.id;
          return (
            <div
              key={p.id}
              className="rounded border border-border overflow-hidden"
              style={{ backgroundColor: "#0e1220" }}
            >
              <div
                className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(expanded ? null : p.id)}
              >
                <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 bg-[rgba(16,185,129,0.12)]">
                  <CheckCircle2 size={14} className="text-[#10b981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[13px] font-semibold text-foreground">
                      {p.docName}
                    </span>
                    {p.urgencyRating === "🔥" && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(239,68,68,0.1)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]"
                        style={MONO}
                      >
                        HIGH IMPACT
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
                    {p.benefits}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {p.productArea.slice(0, 2).map((a) => (
                      <AreaTag key={a} area={a} />
                    ))}
                  </div>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 text-muted-foreground ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {expanded && (
                <div
                  className="border-t border-border px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-6"
                  style={{ backgroundColor: "#080c18" }}
                >
                  <div className="space-y-4">
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-1.5"
                        style={MONO}
                      >
                        Customer Benefits
                      </p>
                      <p className="text-[13px] leading-relaxed font-medium" style={{ color: "#10b981" }}>
                        {p.benefits}
                      </p>
                    </div>
                    {p.quickNote && (
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-1.5"
                          style={MONO}
                        >
                          Quick Note
                        </p>
                        <p className="text-[13px] leading-relaxed text-foreground">
                          {p.quickNote}
                        </p>
                      </div>
                    )}
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                        style={MONO}
                      >
                        Product Area
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.productArea.map((a) => (
                          <AreaTag key={a} area={a} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                        style={MONO}
                      >
                        Product Involvement
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.productInvolvement.map((t) => (
                          <InvolvementTag key={t} tag={t} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                        style={MONO}
                      >
                        Built By
                      </p>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        {p.developmentTeam.join(", ")}
                      </p>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
                    >
                      <ExternalLink size={11} />
                      Open in Notion
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Product Vision ───────────────────────────────────────────────────────────

const STRATEGIC_PILLARS = [
  {
    icon: <Zap size={15} />,
    title: "Increase Productivity and Accuracy",
    description:
      "Provide valuable AI tools for supporting users with more data in critical workflows",
    color: "#f59e0b",
  },
  {
    icon: <Shield size={15} />,
    title: "Platform Reliability",
    description:
      "Stable infrastructure foundation, increase reliability and security for all customers and product lines.",
    color: "#22d3ee",
  },
  {
    icon: <Users size={15} />,
    title: "Customer Retention",
    description:
      "Delight existing customers with features that address productivity efficiency and data insights to measure success.",
    color: "#a855f7",
  },
  {
    icon: <ArrowUpRight size={15} />,
    title: "Customer Acquisition",
    description:
      "Unlock new markets and prospect conversions with key features, competitive parity, and industry innovation.",
    color: "#10b981",
  },
  {
    icon: <Smartphone size={15} />,
    title: "Mobile-First Tools",
    description:
      "Introduce new roles to mobile tools and reduce dependencies across operational workflows.",
    color: "#3b82f6",
  },
];

function ProductVision({ projects }: { projects: NotionProject[] }) {
  const areaCount = useMemo(() => {
    const counts: Partial<Record<ProductArea, number>> = {};
    projects.forEach((p) =>
      p.productArea.forEach((a) => {
        counts[a] = (counts[a] ?? 0) + 1;
      })
    );
    return Object.entries(counts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 6) as [ProductArea, number][];
  }, [projects]);

  return (
    <section
      className="rounded border border-border p-5 lg:p-7"
      style={{ backgroundColor: "#0e1220" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        <div>
          <SectionHeading title="PRODUCT VISION" />
          <blockquote
            className="text-[17px] leading-relaxed font-semibold border-l-2 border-primary pl-4 mb-6 text-foreground"
            style={DISPLAY}
          >
            "We unlock the full value of unique, secondhand goods using intelligent,
            purpose built software."
          </blockquote>
          <div className="space-y-5">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2"
                style={MONO}
              >
                Most Active Product Areas
              </p>
              <div className="space-y-1.5">
                {areaCount.map(([area, count]) => (
                  <div key={area} className="flex items-center gap-2.5">
                    <AreaTag area={area} />
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${Math.round((count / projects.length) * 100)}%`,
                          backgroundColor:
                            AREA_COLORS[area] ?? AREA_DEFAULT_COLOR,
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] text-muted-foreground"
                      style={MONO}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.1em] text-[#ffffff] mb-2"
                style={MONO}
              >
                Metrics for Prioritization
              </p>
              <ul className="space-y-1.5">
  <li className="flex items-start gap-2 text-[12px] text-[#ffffff]">

    <span>
      Reach, Impact, Confidence, and Effort{" "}
      <br />
<a
  href="https://www.notion.so/uprightlabshq/RICE-Scoring-at-Commerce-35e0c3d2153880fbab10d37a8d3ea01b?source=copy_link"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1 text-primary hover:underline"
>
  Learn More
  <ExternalLink size={11} />
</a>
    </span>
  </li>
</ul>
            </div>
          </div>
        </div>

        <div>
          <p
            className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4"
            style={MONO}
          >
            Strategic Pillars
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {STRATEGIC_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded border border-border p-4"
                style={{ backgroundColor: "#080c18" }}
              >
                <div
                  className="flex items-center gap-2 mb-2"
                  style={{ color: pillar.color }}
                >
                  {pillar.icon}
                  <span className="text-[12px] font-semibold" style={DISPLAY}>
                    {pillar.title.toUpperCase()}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sales View ───────────────────────────────────────────────────────────────

function SalesView({ projects }: { projects: NotionProject[] }) {
  const highUrgencyActive = projects.filter(
    (p) =>
      ACTIVE_STATUSES.includes(p.projectStatus) &&
      (p.urgencyRating === "🔥" || p.urgencyRating === "3")
  );

  const completedHighImpact = projects.filter(
    (p) =>
      p.projectStatus === "Completed" &&
      (p.urgencyRating === "🔥" || p.urgencyRating === "3")
  );

  const inDevProjects = projects.filter((p) => p.projectStatus === "Development Cycle");

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading
          title="WHAT'S SHIPPING NEXT"
          sub="Projects actively in development — get ahead of customer conversations now"
        />
        {inDevProjects.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">
            No projects currently in Development Cycle.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inDevProjects.map((p) => (
              <div
                key={p.id}
                className="rounded border p-4 space-y-3"
                style={{
                  backgroundColor: "#0e1220",
                  borderColor: "rgba(59,130,246,0.3)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge status="Development Cycle" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground leading-snug">
                  {p.docName}
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "#10b981" }}>
                  {p.benefits}
                </p>
                {p.quickNote && (
                  <p className="text-[12px] leading-relaxed text-muted-foreground">
                    {p.quickNote}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {p.productArea.map((a) => (
                    <AreaTag key={a} area={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading
          title="HIGH-PRIORITY PIPELINE"
          sub="🔥 and high-urgency projects in active development"
        />
        <div
          className="rounded border border-border overflow-hidden"
          style={{ backgroundColor: "#0e1220" }}
        >
          <div
            className="hidden md:grid grid-cols-[2.5fr_0.8fr_1.2fr_1.5fr] gap-4 px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
            style={{ ...MONO, backgroundColor: "#080c18" }}
          >
            <span>Project</span>
            <span>Status</span>
            <span>Urgency</span>
            <span>Product Area</span>
          </div>
          {highUrgencyActive.map((p, i) => (
            <div
              key={p.id}
              className={`px-4 py-3 ${
                i < highUrgencyActive.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-[2.5fr_0.8fr_1.2fr_1.5fr] gap-2 md:gap-4 items-start md:items-center">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    {p.docName}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {p.benefits}
                  </p>
                </div>
                <StatusBadge status={p.projectStatus} />
                <UrgencyPip rating={p.urgencyRating} />
                <div className="flex flex-wrap gap-1">
                  {p.productArea.slice(0, 2).map((a) => (
                    <AreaTag key={a} area={a} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="RECENTLY SHIPPED — HIGH IMPACT"
          sub="Use these in demos and renewal conversations"
        />
        <div className="space-y-3">
          {completedHighImpact.map((p) => (
            <div
              key={p.id}
              className="rounded border border-border p-4 flex flex-col lg:flex-row gap-4"
              style={{ backgroundColor: "#0e1220" }}
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <StatusBadge status="Completed" />
                  <span className="text-[13px] font-semibold text-foreground">
                    {p.docName}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: "#10b981" }}>
                  {p.benefits}
                </p>
                {p.quickNote && (
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {p.quickNote}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {p.productArea.map((a) => (
                  <AreaTag key={a} area={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="COMPETITIVE POSITIONING" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: "We're Ahead",
              color: "#10b981",
              items: [
                "Purpose-built for resale + donation orgs — not adapted from general retail",
                "AI-powered sorting and classification (Solutions DGR + pearldive)",
                'Production "Snap Grid" cuts classification time at donation centers',
                "Mobile POS + line-busting on Android — no hardware dependency",
                "Integrated donation tracking with donor receipts",
                "pearldive + Lister for omnichannel resale listing",
              ],
            },
            {
              title: "Honest Gaps to Know",
              color: "#f59e0b",
              items: [
                "Credit card processing still in development (DGR) — coming soon",
                "Warehouse management is early-stage (discovery phase)",
                "Lister API access is in design — not yet available",
              ],
            },
            {
              title: "Objection Playbook",
              color: "#a855f7",
              items: [
                '"We need credit card support" → In development now — ask for timeline',
                '"We need a WMS" → In discovery — flag for Product to prioritize',
                '"Evaluating competitors" → Walk them through NOVA + AI roadmap live',
                '"Can we integrate?" → Lister API in design, pearldive commerce kicking off',
              ],
            },
          ].map((col) => (
            <div
              key={col.title}
              className="rounded border border-border p-4"
              style={{ backgroundColor: "#0e1220" }}
            >
              <p
                className="text-[11px] font-semibold mb-3 uppercase tracking-[0.06em]"
                style={{ color: col.color, ...MONO }}
              >
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[12px] text-muted-foreground leading-relaxed"
                  >
                    <span
                      className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── CX View ─────────────────────────────────────────────────────────────────

function CXView({ projects }: { projects: NotionProject[] }) {
  const withRollout = projects.filter((p) =>
    p.productInvolvement.includes("Rollout")
  );
  const inDev = projects.filter((p) => p.projectStatus === "Development Cycle");
  const blocked = projects.filter((p) => p.projectStatus === "Blocked");
  const withComms = projects.filter((p) =>
    p.productInvolvement.includes("Communications")
  );

  return (
    <div className="space-y-8">
      {withComms.length > 0 && (
        <section>
          <SectionHeading
            title="CUSTOMER COMMUNICATION NEEDED"
            sub="Projects tagged Communications — coordinate with Product on messaging"
          />
          <div className="space-y-3">
            {withComms.map((p) => (
              <div
                key={p.id}
                className="rounded border p-4"
                style={{
                  backgroundColor: "#0e1220",
                  borderColor: "rgba(34,211,238,0.2)",
                }}
              >
                <div className="flex items-start gap-4 flex-wrap lg:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      <StatusBadge status={p.projectStatus} />
                      <span className="text-[14px] font-semibold text-foreground">
                        {p.docName}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground mb-3">
                      {p.benefits}
                    </p>
                    {p.quickNote && (
                      <div
                        className="rounded p-3"
                        style={{
                          backgroundColor: "rgba(34,211,238,0.06)",
                          borderLeft: "2px solid #22d3ee",
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-[0.1em] mb-1 text-primary"
                          style={MONO}
                        >
                          CX Context
                        </p>
                        <p className="text-[13px] leading-relaxed text-foreground">
                          {p.quickNote}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {p.productArea.slice(0, 3).map((a) => (
                      <AreaTag key={a} area={a} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeading
          title="UPCOMING LAUNCHES — PREPARE NOW"
          sub="Projects in active development — start drafting help articles, FAQs, and training materials"
        />
        {inDev.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">
            No projects currently in development.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inDev.map((p) => (
              <div
                key={p.id}
                className="rounded border border-border p-4 space-y-3"
                style={{ backgroundColor: "#0e1220" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status="Development Cycle" />
                </div>
                <h3 className="text-[14px] font-semibold text-foreground leading-snug">
                  {p.docName}
                </h3>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {p.benefits}
                </p>
                {p.quickNote && (
                  <p className="text-[12px] leading-relaxed text-muted-foreground italic">
                    {p.quickNote}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {p.productArea.map((a) => (
                    <AreaTag key={a} area={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {withRollout.length > 0 && (
        <section>
          <SectionHeading
            title="ROLLOUT TRACKING"
            sub="Projects tagged Rollout — monitor for customer support spikes"
          />
          <div
            className="rounded border border-border overflow-hidden"
            style={{ backgroundColor: "#0e1220" }}
          >
            <div
              className="hidden md:grid grid-cols-[2.5fr_0.8fr_1.4fr_1fr] gap-4 px-4 py-2.5 border-b border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
              style={{ ...MONO, backgroundColor: "#080c18" }}
            >
              <span>Project</span>
              <span>Status</span>
              <span>Product Area</span>
              <span>Owner</span>
            </div>
            {withRollout.map((p, i) => (
              <div
                key={p.id}
                className={`grid grid-cols-1 md:grid-cols-[2.5fr_0.8fr_1.4fr_1fr] gap-2 md:gap-4 px-4 py-3 items-center ${
                  i < withRollout.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    {p.docName}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {p.benefits}
                  </p>
                </div>
                <StatusBadge status={p.projectStatus} />
                <div className="flex flex-wrap gap-1">
                  {p.productArea.slice(0, 2).map((a) => (
                    <AreaTag key={a} area={a} />
                  ))}
                </div>
                <span className="text-[12px] text-muted-foreground">
                  {p.owner ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {blocked.length > 0 && (
        <section>
          <SectionHeading
            title="BLOCKED PROJECTS"
            sub="Do not commit these to customers — communicate delays proactively if asked"
          />
          <div className="space-y-3">
            {blocked.map((p) => (
              <div
                key={p.id}
                className="rounded border p-4"
                style={{
                  backgroundColor: "#0e1220",
                  borderColor: "rgba(239,68,68,0.25)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <StatusBadge status="Blocked" />
                  <span className="text-[14px] font-semibold text-foreground">
                    {p.docName}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-muted-foreground mb-3">
                  {p.benefits}
                </p>
                {p.quickNote && (
                  <div
                    className="rounded p-3"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.06)",
                      borderLeft: "2px solid #ef4444",
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.1em] mb-1"
                      style={{ color: "#ef4444", ...MONO }}
                    >
                      Blocker
                    </p>
                    <p className="text-[13px] text-foreground leading-relaxed">
                      {p.quickNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8f9b6c2d`;

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  const filterProjects = (list: NotionProject[]) =>
    list.filter((p) => !p.docName.startsWith("[TEAM]"));

  const [projects, setProjects] = useState<NotionProject[]>(filterProjects(PROJECTS));
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const workInFlightRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = (filter: StatusFilter) => {
    setActiveFilter(filter);
    setTimeout(() => {
      workInFlightRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const fetchProjects = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${SERVER_URL}/notion/projects`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.projects?.length) {
        setProjects(filterProjects(data.projects as NotionProject[]));
        setLastSynced(new Date());
      }
    } catch (err: any) {
      const msg = err.name === "AbortError" ? "Request timed out" : (err.message ?? "Unknown error");
      console.error("Notion sync failed:", msg);
      setSyncError(msg);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {syncError && (
        <div className="flex items-center justify-center gap-2 py-2 text-[11px] text-amber-700 bg-amber-50 border-b border-amber-200">
          <AlertTriangle size={11} />
          Notion sync failed — showing cached data.
          {syncError.includes("Failed to fetch") || syncError.includes("NetworkError") ? (
            <span className="font-medium">Deploy the Edge Function from Make settings to enable live sync.</span>
          ) : syncError.includes("401") || syncError.includes("unauthorized") || syncError.includes("invalid") ? (
            <span className="font-medium">Invalid Notion token — update <code className="bg-amber-100 px-1 rounded">NOTION_API_TOKEN</code> in Make settings with a valid <code className="bg-amber-100 px-1 rounded">secret_…</code> token from notion.so/my-integrations, then redeploy.</span>
          ) : (
            <span>({syncError})</span>
          )}
          <button
  onClick={fetchProjects}
  className="ml-1 underline hover:no-underline"
>
  Retry
</button>
        </div>
      )}
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 space-y-8">
        {activeTab === "overview" && (
          <>
            <ProductVision projects={projects} />
            <StatsRow projects={projects} onFilterClick={handleFilterClick} />
            <div ref={workInFlightRef}>
              <WorkInFlight
                projects={projects}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
            <CompletedProjects projects={projects} />
          </>
        )}
        {activeTab === "sales" && <SalesView projects={projects} />}
        {activeTab === "cx" && <CXView projects={projects} />}
      </main>
      <div className="fixed bottom-4 right-4">
        {syncing ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-[12px] text-muted-foreground">
            <RefreshCw size={12} className="animate-spin" />
            Syncing…
          </div>
        ) : lastSynced ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-[12px] text-muted-foreground">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Synced · {lastSynced.toLocaleTimeString()}
            <button
              onClick={fetchProjects}
              className="ml-1 hover:text-foreground transition-colors"
              title="Refresh from Notion"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border shadow-sm text-[12px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <RefreshCw size={12} />
            Sync from Notion
          </button>
        )}
      </div>
    </div>
  );
}
