import { useState } from "react";

import ConfirmDialog from "@/components/ui/confirm_dialog";

import type { InventoryItem } from "@/core/entities/inventory.entity";

import { deleteInventoryItem } from "../services";

interface DeleteItemDialogProps {
    open: boolean;

    item: InventoryItem | null;

    onClose(): void;

    onDeleted(): void;
}

export default function DeleteItemDialog({
    open,
    item,
    onClose,
    onDeleted,
}: DeleteItemDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleDelete() {
        if (!item) return;

        try {
            setLoading(true);

            await deleteInventoryItem(item.id);

            onDeleted();

            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <ConfirmDialog
            open={open}
            variant="danger"
            title="Excluir item?"
            description={
                item
                    ? `O item "${item.item}" será removido permanentemente do sistema. Esta ação não poderá ser desfeita.`
                    : ""
            }
            confirmText="Excluir"
            cancelText="Cancelar"
            loading={loading}
            onConfirm={handleDelete}
            onClose={onClose}
        />
    );
}