import { useState } from "react";

import Card from "@/components/ui/card";
import Dialog from "@/components/ui/dialog";

import InventoryForm from "./inventory_form";

import { createInventoryItems } from "../services";

import type { CreateInventoryItemDTO } from "@/core/entities/inventory.entity";

interface CreateInventoryItemDialogProps {
    open: boolean;

    onClose(): void;

    onCreated(): void;
}

export default function CreateInventoryItemDialog({
    open,
    onClose,
    onCreated,
}: CreateInventoryItemDialogProps) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(data: CreateInventoryItemDTO) {
        try {
            setLoading(true);

            await createInventoryItems(data);

            onCreated();

            onClose();
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
                        Novo item
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Cadastre um ou mais itens no inventário do Clube de Robótica.
                    </p>
                </div>

                <InventoryForm
                    loading={loading}
                    submitText="Cadastrar"
                    onSubmit={handleSubmit}
                />
            </Card>
        </Dialog>
    );
}