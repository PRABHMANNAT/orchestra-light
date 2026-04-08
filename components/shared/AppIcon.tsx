import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Eye,
  GitFork,
  Globe,
  Headphones,
  Layers,
  ListTodo,
  Lock,
  MessageSquare,
  Package,
  PackageCheck,
  Plug,
  RefreshCw,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Users
} from "lucide-react";

const icons = {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Eye,
  GitFork,
  Globe,
  Headphones,
  Layers,
  ListTodo,
  Lock,
  MessageSquare,
  Package,
  PackageCheck,
  Plug,
  RefreshCw,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Users
} as const;

export function AppIcon({
  name,
  size = 14,
  className
}: {
  name: keyof typeof icons;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.5} className={className} />;
}

