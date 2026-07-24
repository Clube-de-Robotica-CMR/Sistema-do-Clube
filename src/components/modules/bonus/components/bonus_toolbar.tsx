import { SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/cn";

interface BonusToolbarProps {

    filterApplied: boolean;

    onFilter(): void;
}

export default function BonusToolbar({
    filterApplied,
    onFilter,
}: BonusToolbarProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-1 gap-3">
                <button
                    onClick={onFilter}
                    className={cn(
                        "flex",
                        "h-12",
                        "w-12",
                        "cursor-pointer",
                        "items-center",
                        "justify-center",
                        "rounded-xl",
                        "border",
                        "bg-white",
                        "transition",

                        filterApplied
                            ? "border-violet-500 ring-2 ring-violet-100 text-violet-700"
                            : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                    )}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>
    );
}