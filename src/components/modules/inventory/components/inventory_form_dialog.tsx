import { useState } from "react";

import type {
    InventoryItem,
    CreateInventoryItemDTO,
} from "@/core/entities/inventory.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";

import InventoryForm from "./inventory_form";

import {
    createInventoryItems,
    updateInventoryItem,
} from "../services";

interface InventoryFormDialogProps {
    open: boolean;

    mode: "create" | "edit";

    item?: InventoryItem;

    onClose(): void;

    onSaved(): void;
}

export default function InventoryFormDialog({
    open,
    mode,
    item,
    onClose,
    onSaved,
}: InventoryFormDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(
        data: CreateInventoryItemDTO
    ) {
        try {
            setLoading(true);

            if (mode === "create") {
                await createInventoryItems(data);
            } else {
                await updateInventoryItem({
                    id: item!.id,
                    ...data[0],
                });
            }

            onClose();
            onSaved();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
        >
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        {mode === "create"
                            ? "Adicionar itens"
                            : "Editar item"}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        {mode === "create"
                            ? "Cadastre um ou mais itens do inventário."
                            : "Atualize as informações do item."}
                    </p>
                </div>

                <InventoryForm
                    initialValues={
                        item
                            ? [item]
                            : undefined
                    }
                    loading={loading}
                    submitText={
                        mode === "create"
                            ? "Adicionar itens"
                            : "Salvar alterações"
                    }
                    onSubmit={handleSubmit}
                />
            </Card>
        </Dialog>
    );
}