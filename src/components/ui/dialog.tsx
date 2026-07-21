import { ReactNode, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import Button from "./button";
import Card from "./card";
import { cn } from "@/lib/cn";

interface DialogProps {
    open: boolean;
    title: string;
    description?: string;
    children?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "primary" | "danger";
    loading?: boolean;
    onConfirm(): void;
    onClose(): void;
}

export default function Dialog({
    open,
    title,
    description,
    children,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "primary",
    loading = false,
    onConfirm,
    onClose,
}: DialogProps) {
    const [mounted, setMounted] = useState(open);

    useEffect(() => {
        if (open) {
            setMounted(true);
        } else {
            const timer = setTimeout(() => {
                setMounted(false);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [open]);

    if (!mounted) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-50",
                "flex items-center justify-center",
                "bg-black/40 backdrop-blur-sm p-6",
                "transition-all duration-200",
                open ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={onClose}
        >
            <Card
                className={cn(
                    "relative w-full max-w-md rounded-3xl p-8",
                    "transition-all duration-200 hover:shadow-2xl",
                    open
                        ? "scale-100 translate-y-0 opacity-100"
                        : "scale-95 translate-y-2 opacity-0"
                )}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                >
                    <X size={18} />
                </button>

                {/* Container centralizado para Ícone, Título e Descrição */}
                <div className="flex flex-col items-center text-center">
                    <div
                        className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl mb-4",
                            variant === "danger"
                                ? "bg-red-100 text-red-600"
                                : "bg-violet-100 text-violet-700"
                        )}
                    >
                        {variant === "danger" ? (
                            <AlertTriangle size={20} />
                        ) : (
                            <CheckCircle2 size={20} />
                        )}
                    </div>

                    <h2 className="text-lg font-semibold text-black">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-2 text-[15px] leading-6 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {/* Renderiza children caso você passe conteúdo extra */}
                {children && <div className="mt-4">{children}</div>}

                {/* Rodapé com botões alinhados nas extremidades */}
                <div className="mt-8 flex w-full justify-between items-center gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-11 w-auto px-6 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        variant={variant === "danger" ? "danger" : "primary"}
                        className="h-11 w-auto px-6"
                        loading={loading}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
