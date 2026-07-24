import { Plus, Search, SlidersHorizontal } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { cn } from "@/lib/cn";

interface CompetitionsToolbarProps {
    search: string;
    filtersApplied: boolean;
    onSearch(value: string): void;
    onFilter(): void;
    onCreate(): void;
}

export default function CompetitionsToolbar({
    search,
    filtersApplied,
    onSearch,
    onFilter,
    onCreate,
}: CompetitionsToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4 w-full">
            {/* Bloco de pesquisa: É o ÚNICO que tem flex-1 e w-full para empurrar o botão */}
            <div className="flex flex-1 items-center gap-3 min-w-0">
                <div className="relative flex-1 min-w-0">
                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <Input
                        value={search}
                        placeholder="Pesquisar competição..."
                        onChange={(event) =>
                            onSearch(event.target.value)
                        }
                        className="h-12 pl-11 w-full"
                    />
                </div>

                <button
                    type="button"
                    onClick={onFilter}
                    className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-white transition cursor-pointer",
                        filtersApplied
                            ? "border-violet-500 ring-2 ring-violet-100 text-violet-700"
                            : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                    )}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>

            {/* Botão de Criação: Totalmente travado para ocupar apenas o espaço do texto */}
            <Button
                className="h-12 px-5 shrink-0 w-auto min-w-fit whitespace-nowrap"
                onClick={onCreate}
            >
                <Plus size={18} />
                <span>Nova competição</span>
            </Button>
        </div>
    );
}
