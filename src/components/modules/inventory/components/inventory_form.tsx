import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import type {
    InventoryClassification,
    InventoryCollection,
    InventoryStatus,
    CreateInventoryItemDTO,
    InventoryItem,
} from "@/core/entities/inventory.entity";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import { ValidationError } from "@/lib/validation_error";

interface InventoryFormProps {
    initialValues?: InventoryItem[];

    isEditing?: boolean;

    loading?: boolean;

    submitText: string;

    onSubmit(
        data: CreateInventoryItemDTO
    ): Promise<void>;
}

const classifications: InventoryClassification[] = [
    "Microcontrolador",
    "Atuador",
    "Componente Mecânico",
    "Sensor",
    "Conector",
    "Energia",
    "Variados",
    "Dispositivo de saída",
];

const collections: InventoryCollection[] = [
    "Arduino",
    "LEGO SPIKE",
    "LEGO EV3",
];

const statuses: InventoryStatus[] = [
    "Funcionando",
    "Sem funcionamento",
    "A analisar",
];

type EditableItem = {
    item: string;
    quantity: number;
    classification: InventoryClassification;
    collection: InventoryCollection;
    status: InventoryStatus;
    location: string;
};

const createEmptyItem = (): EditableItem => ({
    item: "",
    quantity: 1,
    classification: "Variados",
    collection: "Arduino",
    status: "Funcionando",
    location: "",
});

export default function InventoryForm({
    initialValues,
    isEditing,
    loading,
    submitText,
    onSubmit,
}: InventoryFormProps) {
    const [items, setItems] = useState<EditableItem[]>([
        createEmptyItem(),
    ]);

    // Controla qual item está expandido (index)
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const [errors, setErrors] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        if (
            initialValues &&
            initialValues.length > 0
        ) {
            setItems(
                initialValues.map((item) => ({
                    item: item.item,
                    quantity: item.quantity,
                    classification:
                        item.classification,
                    collection:
                        item.collection,
                    status: item.status,
                    location: item.location,
                }))
            );
        } else {
            setItems([createEmptyItem()]);
        }

        setOpenIndex(0);
        setErrors({});
    }, [initialValues]);

    function updateItem(
        index: number,
        field: keyof EditableItem,
        value: any
    ) {
        setItems((previous) =>
            previous.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    }

    function addItem() {
        setItems((previous) => {
            const next = [...previous, createEmptyItem()];
            // Abre automaticamente o novo item adicionado
            setOpenIndex(next.length - 1);
            return next;
        });
    }

    function removeItem(index: number) {
        if (items.length === 1) return;

        setItems((previous) => {
            const updated = previous.filter((_, i) => i !== index);
            // Ajusta o índice do item aberto após remoção
            setOpenIndex((current) => {
                if (current === index) return Math.max(0, index - 1);
                if (current !== null && current > index) return current - 1;
                return current;
            });
            return updated;
        });
    }

    function toggleExpand(index: number) {
        setOpenIndex((previous) => (previous === index ? null : index));
    }

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        setErrors({});

        try {
            await onSubmit(
                items.map((item) => ({
                    item: item.item,
                    quantity: item.quantity,
                    classification:
                        item.classification,
                    collection:
                        item.collection,
                    status: item.status,
                    location: item.location,
                }))
            );
        } catch (error) {
            if (
                error instanceof ValidationError
            ) {
                const fieldErrors: Record<
                    string,
                    string
                > = {};

                Object.entries(
                    error.details.fieldErrors
                ).forEach(
                    ([field, messages]) => {
                        if (
                            messages &&
                            messages.length > 0
                        ) {
                            fieldErrors[
                                field
                            ] = messages[0];
                        }
                    }
                );

                setErrors(fieldErrors);
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Limitador de altura com scroll suave para a lista */}
            <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
                {items.map(
                    (inventoryItem, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white transition-all"
                            >
                                {/* Cabeçalho clicável (Accordion Header) */}
                                <div
                                    onClick={() => toggleExpand(index)}
                                    className="flex cursor-pointer items-center justify-between p-4 hover:bg-slate-50 rounded-2xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                                            {index + 1}
                                        </span>

                                        <div>
                                            <h3 className="font-semibold text-slate-800">
                                                {inventoryItem.item || `Item ${index + 1}`}
                                            </h3>

                                            {!isOpen && (
                                                <p className="text-xs text-slate-400">
                                                    Qtd: {inventoryItem.quantity} • {inventoryItem.classification} • {inventoryItem.collection}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        {items.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="danger"
                                                onClick={() => removeItem(index)}
                                                className="flex h-8 w-8 items-center justify-center p-0"
                                                title="Remover item"
                                            >
                                                <Trash2 size={15} />
                                            </Button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(index)}
                                            className="p-1 text-slate-400 hover:text-slate-600"
                                        >
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Corpo do formulário (só renderiza/exibe quando aberto) */}
                                {isOpen && (
                                    <div className="border-t border-slate-100 p-5 space-y-4">
                                        <Input
                                            label="Nome"
                                            value={inventoryItem.item}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "item",
                                                    e.target.value
                                                )
                                            }
                                            error={
                                                errors[`item.${index}`] ??
                                                errors.item
                                            }
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Quantidade"
                                                type="number"
                                                value={String(
                                                    inventoryItem.quantity
                                                )}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "quantity",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />

                                            <Input
                                                label="Localização"
                                                value={inventoryItem.location}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <label className="space-y-2">
                                                <span className="text-sm font-medium">
                                                    Classificação
                                                </span>

                                                <select
                                                    value={inventoryItem.classification}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "classification",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-12 w-full rounded-xl border border-slate-200 px-4"
                                                >
                                                    {classifications.map(
                                                        (value) => (
                                                            <option
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {value}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </label>

                                            <label className="space-y-2">
                                                <span className="text-sm font-medium">
                                                    Coleção
                                                </span>

                                                <select
                                                    value={inventoryItem.collection}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "collection",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-12 w-full rounded-xl border border-slate-200 px-4"
                                                >
                                                    {collections.map(
                                                        (value) => (
                                                            <option
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {value}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </label>

                                            <label className="space-y-2">
                                                <span className="text-sm font-medium">
                                                    Status
                                                </span>

                                                <select
                                                    value={inventoryItem.status}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-12 w-full rounded-xl border border-slate-200 px-4"
                                                >
                                                    {statuses.map(
                                                        (value) => (
                                                            <option
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {value}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
                {!isEditing ? (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={addItem}
                    >
                        + Adicionar item
                    </Button>
                ) : (
                    <div />
                )}

                <Button
                    type="submit"
                    loading={loading}
                >
                    {submitText}
                </Button>
            </div>
        </form>
    );
}