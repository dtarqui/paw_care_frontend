import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Clock,
  History,
  MessageCircle,
  Package,
  PawPrint,
  Settings,
  ShieldPlus,
  Stethoscope,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// El backend manda el nombre del ícono como string (para no acoplar el dominio a una
// librería de UI); acá se traduce al componente real de lucide-react.
export const ICON_MAP: Record<string, LucideIcon> = {
  PawPrint,
  CalendarDays,
  Wallet,
  Stethoscope,
  ShieldPlus,
  Users,
  User,
  MessageCircle,
  BarChart3,
  Package,
  Clock,
  History,
  Settings,
  BookOpen,
};
