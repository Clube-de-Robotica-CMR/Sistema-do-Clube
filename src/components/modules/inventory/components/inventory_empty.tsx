import { PackageSearch } from "lucide-react";

import Card from "@/components/ui/card";

interface InventoryEmptyProps {
    hasFilters: boolean;
}

export default function InventoryEmpty({
    hasFilters,
}: InventoryEmptyProps) {
    return (
        <Card className="flex flex-col items-center justify-center rounded-3xl py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <PackageSearch
                    size={32}
                    className="text-slate-500"
                />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
                {hasFilters
                    ? "Nenhum item encontrado"
                    : "Nenhum item cadastrado"}
            </h3>

            <p className="mt-2 max-w-md text-slate-500">
                {hasFilters
                    ? "Tente alterar os filtros para encontrar os itens desejados."
                    : "Cadastre o primeiro item do inventário para começar."}
            </p>
        </Card>
    );
}