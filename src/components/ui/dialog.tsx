import { ReactNode, useEffect } from "react";

interface DialogProps {
    open: boolean;

    children: ReactNode;

    onClose(): void;

    maxWidth?: "sm" | "md" | "lg";
}

const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
};

export default function Dialog({
    open,
    children,
    onClose,
    maxWidth = "md",
}: DialogProps) {
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener(
                "keydown",
                handleKey
            );
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-6
                backdrop-blur-sm
            "
            onClick={onClose}
        >
            <div
                onClick={(event) =>
                    event.stopPropagation()
                }
                className={`
                    relative
                    w-full
                    ${widths[maxWidth]}
                    animate-in
                    fade-in
                    zoom-in-95
                    duration-200
                `}
            >
                {children}
            </div>
        </div>
    );
}