import {
  BarChart3,
  CalendarDays,
  MessageCircle,
  Package,
  PawPrint,
  ShieldPlus,
  Stethoscope,
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
  MessageCircle,
  BarChart3,
  Package,
};
