import { Plus, SlidersHorizontal } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { cn } from "@/lib/cn";

interface InventoryToolbarProps {
    search: string;

    filtersApplied: boolean;

    onSearch(value: string): void;

    onFilter(): void;

    onCreate(): void;
}

export default function InventoryToolbar({
    search,
    filtersApplied,
    onSearch,
    onFilter,
    onCreate,
}: InventoryToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 gap-3">
                <div className="flex-1">
                    <Input
                        value={search}
                        placeholder="Pesquisar item..."
                        onChange={(event) =>
                            onSearch(event.target.value)
                        }
                        className="h-12"
                    />
                </div>

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
                        "transition-all",
                        "duration-200",
                        filtersApplied
                            ? "border-violet-600 text-violet-700 ring-2 ring-violet-200"
                            : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                    )}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            <div className="flex gap-3">
                <Button
                    className="h-12 w-auto px-5"
                    onClick={onCreate}
                >
                    <Plus size={18} />

                    <span>Adicionar item</span>
                </Button>
            </div>
        </div>
    );
}