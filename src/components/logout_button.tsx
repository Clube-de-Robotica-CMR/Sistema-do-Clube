import { useRouter } from "next/router";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { rpcClient } from "@/services/api";
import { useState } from "react";
import Dialog from "./ui/dialog";

interface LogoutButtonProps {
    collapsed: boolean;
}

export default function LogoutButton({ collapsed }: LogoutButtonProps) {
    const router = useRouter();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    async function logout() {
        try {
            setLogoutLoading(true);
            await rpcClient("auth", "logout");
            router.replace("/login");
        } finally {
            setLogoutLoading(false);
            setDialogOpen(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setDialogOpen(true)}
                className={cn(
                    "flex w-full cursor-pointer items-center rounded-2xl px-4 py-3",
                    "transition-all duration-200",
                    "hover:bg-red-500/20 hover:text-red-100",
                    collapsed ? "justify-center" : "gap-4"
                )}
            >
                <LogOut size={21} />

                {!collapsed && <span className="font-medium">Sair</span>}
            </button>

            <Dialog
                open={dialogOpen}
                variant="danger"
                title="Sair da conta?"
                description="Sua sessão será encerrada e será necessário fazer login novamente."
                confirmText="Sair"
                cancelText="Cancelar"
                loading={logoutLoading}
                onClose={() => setDialogOpen(false)}
                onConfirm={logout}
            />
        </>
    );
}
