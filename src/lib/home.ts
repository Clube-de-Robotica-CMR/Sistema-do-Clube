import {
    BookOpen,
    CalendarDays,
    Medal,
    Package,
    Trophy,
    UserCog,
    Users,
    type LucideIcon,
} from "lucide-react";

export type HomeModule =
    | "students"
    | "meetings"
    | "bonus"
    | "competitions"
    | "ranking"
    | "inventory"
    | "users";

export interface SidebarItem {
    id: HomeModule;
    label: string;
    icon: LucideIcon;
    adminOnly?: boolean;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        id: "students",
        label: "Alunos",
        icon: Users,
    },
    {
        id: "meetings",
        label: "Encontros",
        icon: CalendarDays,
    },
    {
        id: "bonus",
        label: "Bônus (GIP)",
        icon: Medal,
    },
    {
        id: "competitions",
        label: "Competições",
        icon: Trophy,
    },
    {
        id: "ranking",
        label: "Ascensão de Nível",
        icon: BookOpen,
    },
    {
        id: "inventory",
        label: "Inventário",
        icon: Package,
    },
    {
        id: "users",
        label: "Usuários",
        icon: UserCog,
        adminOnly: true,
    },
];

export const HOME_MODULE_STORAGE_KEY = "home-module";
export const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebar-collapsed";