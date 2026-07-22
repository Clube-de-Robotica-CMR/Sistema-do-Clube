import { Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { cn } from "@/lib/cn";

interface StudentsToolbarProps {
    role: "admin" | "diretoria";

    search: string;

    onSearch(value: string): void;

    onFilter(): void;

    onCreate(): void;

    onDeleteAll(): void;
}

export default function StudentsToolbar({
    role,
    search,
    onSearch,
    onFilter,
    onCreate,
    onDeleteAll,
}: StudentsToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 gap-3">
                <div className="flex-1">
                    <Input
                        value={search}
                        placeholder="Pesquisar aluno..."
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
                        "border-slate-200",
                        "bg-white",
                        "transition",
                        "hover:border-violet-300",
                        "hover:bg-violet-50"
                    )}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            <div className="flex gap-3">
                {role === "admin" && (
                    <Button
                        variant="danger"
                        className="h-12 w-auto px-5"
                        onClick={onDeleteAll}
                    >
                        <Trash2 size={18} />

                        <span>Apagar todos</span>
                    </Button>
                )}

                <Button
                    className="h-12 w-auto px-5"
                    onClick={onCreate}
                >
                    <Plus size={18} />

                    <span>Novo aluno</span>
                </Button>
            </div>
        </div>
    );
}