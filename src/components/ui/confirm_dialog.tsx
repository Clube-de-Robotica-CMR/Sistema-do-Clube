import { AlertTriangle, CheckCircle2, X } from "lucide-react";

import Card from "./card";
import Button from "./button";
import Dialog from "./dialog";
import { cn } from "@/lib/cn";

interface ConfirmDialogProps {
    open: boolean;

    title: string;

    description?: string;

    variant?: "primary" | "danger";

    confirmText?: string;

    cancelText?: string;

    loading?: boolean;

    onConfirm(): void;

    onClose(): void;
}

export default function ConfirmDialog({
    open,
    title,
    description,
    variant = "primary",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
        >
            <Card className="relative rounded-3xl p-8">
                <button
                    onClick={onClose}
                    className="
                        absolute
                        right-5
                        top-5
                        rounded-xl
                        p-2
                        text-slate-500
                        transition
                        hover:bg-slate-100
                    "
                >
                    <X size={18} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div
                        className={cn(
                            "mb-5 flex h-16 w-16 items-center justify-center rounded-2xl",

                            variant === "danger"
                                ? "bg-red-100 text-red-600"
                                : "bg-violet-100 text-violet-700"
                        )}
                    >
                        {variant === "danger" ? (
                            <AlertTriangle size={30} />
                        ) : (
                            <CheckCircle2 size={30} />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-black">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        variant={
                            variant === "danger"
                                ? "danger"
                                : "primary"
                        }
                        loading={loading}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </Card>
        </Dialog>
    );
}