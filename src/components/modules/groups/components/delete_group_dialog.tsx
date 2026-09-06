import { useState } from "react";

import ConfirmDialog from "@/components/ui/confirm_dialog";

import type {
    GroupWithMembers,
} from "@/core/entities/member.entity";

import { deleteGroup } from "../services";

interface DeleteGroupDialogProps {
    open: boolean;

    group: GroupWithMembers | null;

    onClose(): void;
    onDeleted(): void;
}

export default function DeleteGroupDialog({
    open,
    group,
    onClose,
    onDeleted,
}: DeleteGroupDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleDelete() {
        if (!group) return;

        try {
            setLoading(true);

            await deleteGroup(group.id);

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
            title="Excluir grupo?"
            description={
                group
                    ? `O grupo "${group.name}" será removido. Os membros não serão excluídos e ficarão sem grupo.`
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