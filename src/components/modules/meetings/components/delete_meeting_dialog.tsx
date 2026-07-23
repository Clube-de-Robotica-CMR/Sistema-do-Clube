import { useState } from "react";

import type { Meeting } from "@/core/entities/meeting.entity";

import ConfirmDialog from "@/components/ui/confirm_dialog";

import { deleteMeeting } from "../services";
import { formatMeetingDate } from "../utils";

interface DeleteMeetingDialogProps {
    meeting: Meeting | null;

    open: boolean;

    onClose(): void;

    onDeleted(): void;
}

export default function DeleteMeetingDialog({
    meeting,
    open,
    onClose,
    onDeleted,
}: DeleteMeetingDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleDelete() {
        if (!meeting) return;

        try {
            setLoading(true);

            await deleteMeeting(meeting.id);

            onDeleted();

            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <ConfirmDialog
            open={open}
            loading={loading}
            variant="danger"
            title="Excluir encontro?"
            description={`O encontro do dia ${meeting ? formatMeetingDate(meeting.date) : ""} será removido permanentemente.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            onClose={onClose}
            onConfirm={handleDelete}
        />
    );
}