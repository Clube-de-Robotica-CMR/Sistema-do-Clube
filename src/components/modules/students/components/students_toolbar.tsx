import {
    FileText,
    Plus,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { cn } from "@/lib/cn";

interface StudentsToolbarProps {
    role: "admin" | "diretoria";

    search: string;

    hasFilters: boolean;

    onSearch(value: string): void;

    onFilter(): void;

    onExportPdf(): void;

    onCreate(): void;

    onDeleteAll(): void;
}

export default function StudentsToolbar({
    role,
    search,
    hasFilters,
    onSearch,
    onFilter,
    onExportPdf,
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
                        "bg-white",
                        "transition-all",
                        "duration-200",
                        hasFilters
                            ? "border-violet-600 text-violet-700 ring-2 ring-violet-200"
                            : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                    )}
                >
                    <SlidersHorizontal size={20} />
                </button>

                <Button
                    variant="secondary"
                    className="h-12 w-auto px-5"
                    onClick={onExportPdf}
                >
                    <FileText size={18} />

                    <span>PDF</span>
                </Button>
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