import { useEffect, useState } from "react";

import {
    InventoryClassificationSchema,
    InventoryCollectionSchema,
    InventoryStatusSchema,
    type InventoryClassification,
    type InventoryCollection,
    type InventoryFilter,
    type InventoryStatus,
} from "@/core/entities/inventory.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface InventoryFiltersDialogProps {
    open: boolean;

    filters: InventoryFilter;

    onClose(): void;

    onApply(
        filters: InventoryFilter
    ): void;
}

const classifications: (
    | InventoryClassification
    | ""
)[] = [
        "",
        ...Object.values(InventoryClassificationSchema.enum),
    ]

const collections: (
    | InventoryCollection
    | ""
)[] = [
        "",
        ...Object.values(InventoryCollectionSchema.enum),
    ]

const statuses: (
    | InventoryStatus
    | ""
)[] = [
        "",
        ...Object.values(InventoryStatusSchema.enum),
    ]

export default function InventoryFiltersDialog({
    open,
    filters,
    onClose,
    onApply,
}: InventoryFiltersDialogProps) {
    const [
        classification,
        setClassification,
    ] = useState<
        InventoryClassification | ""
    >("");

    const [
        collection,
        setCollection,
    ] = useState<
        InventoryCollection | ""
    >("");

    const [status, setStatus] =
        useState<InventoryStatus | "">("");

    useEffect(() => {
        if (!open) return;

        setClassification(
            (filters.classification as InventoryClassification) ??
            ""
        );

        setCollection(
            (filters.collection as InventoryCollection) ??
            ""
        );

        setStatus(
            (filters.status as InventoryStatus) ??
            ""
        );
    }, [filters, open]);

    function handleApply(
        event: React.FormEvent
    ) {
        event.preventDefault();

        onApply({
            classification:
                classification ||
                undefined,

            collection:
                collection || undefined,

            status:
                status || undefined,
        });

        onClose();
    }

    function handleClear() {
        setClassification("");
        setCollection("");
        setStatus("");

        onApply({});

        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
        >
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        Filtrar inventário
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Escolha quais itens deseja
                        visualizar.
                    </p>
                </div>

                <form
                    onSubmit={handleApply}
                    className="space-y-5"
                >
                    <label className="block space-y-2">
                        <span className="text-sm font-medium">
                            Classificação
                        </span>

                        <select
                            value={
                                classification
                            }
                            onChange={(e) =>
                                setClassification(
                                    e.target
                                        .value as InventoryClassification
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 px-4"
                        >
                            {classifications.map(
                                (value) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {value ===
                                            ""
                                            ? "Todas"
                                            : value}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">
                            Coleção
                        </span>

                        <select
                            value={
                                collection
                            }
                            onChange={(e) =>
                                setCollection(
                                    e.target
                                        .value as InventoryCollection
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 px-4"
                        >
                            {collections.map(
                                (value) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {value ===
                                            ""
                                            ? "Todas"
                                            : value}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium">
                            Status
                        </span>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target
                                        .value as InventoryStatus
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 px-4"
                        >
                            {statuses.map(
                                (value) => (
                                    <option
                                        key={
                                            value
                                        }
                                        value={
                                            value
                                        }
                                    >
                                        {value ===
                                            ""
                                            ? "Todos"
                                            : value}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    <div className="flex justify-between pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={
                                handleClear
                            }
                        >
                            Limpar filtros
                        </Button>

                        <Button type="submit">
                            Aplicar filtros
                        </Button>
                    </div>
                </form>
            </Card>
        </Dialog>
    );
}