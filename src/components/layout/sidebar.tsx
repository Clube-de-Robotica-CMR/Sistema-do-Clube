import Image from "next/image";
import {
    Users,
    CalendarDays,
    Medal,
    Trophy,
    TrendingUp,
    Boxes,
    Shield,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { HomeModule } from "@/lib/home";
import LogoutButton from "@/components/logout_button";

interface SidebarProps {
    role: "admin" | "diretoria";
    activeModule: HomeModule;
    collapsed: boolean;
    onChangeModule(module: HomeModule): void;
    onToggleCollapse(): void;
}

interface SidebarItem {
    id: HomeModule;
    label: string;
    icon: any;
    adminOnly?: boolean;
}

const items: SidebarItem[] = [
    { id: "students", label: "Alunos", icon: Users },
    { id: "meetings", label: "Encontros", icon: CalendarDays },
    { id: "bonus", label: "Bônus (GIP)", icon: Medal },
    { id: "competitions", label: "Competições", icon: Trophy },
    { id: "ranking", label: "Ascensão", icon: TrendingUp },
    { id: "inventory", label: "Inventário", icon: Boxes },
    { id: "users", label: "Usuários", icon: Shield, adminOnly: true },
];

export default function Sidebar({
    role,
    activeModule,
    collapsed,
    onChangeModule,
    onToggleCollapse,
}: SidebarProps) {
    return (
        <aside
            className={cn(
                "flex h-screen flex-col",
                "bg-gradient-to-b from-violet-700 via-violet-600 to-fuchsia-600",
                "text-white",
                "transition-all duration-300",
                collapsed ? "w-24" : "w-72"
            )}
        >
            {/* Logo */}
            <div className={cn("flex items-center gap-4", "border-b border-white/10", "px-5 py-6")}>
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center", "rounded-2xl bg-white shadow-md")}>
                    <Image
                        src="/logo.png"
                        alt="Clube de Robótica"
                        width={42}
                        height={42}
                        priority
                    />
                </div>

                {!collapsed && (
                    <div>
                        <p className="text-lg font-bold">Clube de</p>
                        <p className="text-lg font-bold">Robótica</p>
                    </div>
                )}
            </div>

            {/* Navegação */}
            <nav className="flex-1 px-3 py-5">
                <ul className="space-y-2">
                    {items.map((item) => {
                        if (item.adminOnly && role !== "admin") {
                            return null;
                        }

                        const Icon = item.icon;
                        const active = activeModule === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onChangeModule(item.id)}
                                    className={cn(
                                        "flex w-full cursor-pointer items-center rounded-2xl px-4 py-3",
                                        "transition-all duration-200",
                                        active ? "bg-white text-violet-700 shadow-md" : "hover:bg-white/10",
                                        collapsed ? "justify-center" : "gap-4"
                                    )}
                                >
                                    <Icon size={21} />
                                    {!collapsed && <span className="font-medium">{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Container Inferior Corrigido */}
            <div className="border-t border-white/10 px-3 py-4 space-y-2">
                {/* Logout */}
                <LogoutButton collapsed={collapsed} />

                {/* Collapse */}
                <button
                    onClick={onToggleCollapse}
                    className={cn(
                        "flex w-full items-center justify-center rounded-2xl p-3 transition hover:bg-white/10",
                    )}
                >
                    {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                </button>
            </div>
        </aside>
    );
}
