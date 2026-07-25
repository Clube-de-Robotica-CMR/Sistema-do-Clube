import { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/card";
import Dialog from "@/components/ui/dialog";

import InventoryForm from "./inventory_form";

import { updateInventoryItem } from "../services";

import type {
    InventoryItem,
    CreateInventoryItemDTO,
} from "@/core/entities/inventory.entity";

interface EditItemDialogProps {
    open: boolean;

    item: InventoryItem | null;

    onClose(): void;

    onUpdated(): void;
}

export default function EditItemDialog({
    open,
    item,
    onClose,
    onUpdated,
}: EditItemDialogProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setLoading(false);
        }
    }, [open]);

    // Estabiliza a referência do array para não resetar o formulário ao alterar estados
    const initialValues = useMemo(
        () => (item ? [item] : undefined),
        [item?.id]
    );

    async function handleSubmit(data: CreateInventoryItemDTO) {
        if (!item) return;

        try {
            setLoading(true);

            await updateInventoryItem({
                id: item.id,
                ...data[0],
            });

            onUpdated();
            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">Editar item</h2>

                    <p className="mt-2 text-slate-500">
                        Atualize as informações do item do inventário.
                    </p>
                </div>

                <InventoryForm
                    initialValues={initialValues}
                    isEditing
                    loading={loading}
                    submitText="Salvar alterações"
                    onSubmit={handleSubmit}
                />
            </Card>
        </Dialog>
    );
}