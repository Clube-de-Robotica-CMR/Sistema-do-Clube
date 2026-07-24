import { useState } from "react";

import type {
    CreateCompetitionDTO,
    CompetitionResult,
} from "@/core/entities/competition.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";

import CompetitionForm from "./competition_form";

import {
    createCompetition,
    saveCompetitionResults,
} from "../services";

interface CompetitionFormData {
    competition: CreateCompetitionDTO;
    results: Omit<
        CompetitionResult,
        | "id"
        | "competition_id"
        | "created_at"
        | "updated_at"
    >[];
}

interface CreateCompetitionDialogProps {
    open: boolean;

    onClose(): void;

    onCreated(): void;
}

export default function CreateCompetitionDialog({
    open,
    onClose,
    onCreated,
}: CreateCompetitionDialogProps) {
    const [loading, setLoading] =
        useState(false);

    async function handleCreate({
        competition,
        results,
    }: CompetitionFormData) {
        try {
            setLoading(true);

            const created =
                await createCompetition(
                    competition
                );

            await saveCompetitionResults({
                competition_id: created.id,
                results,
            });

            onClose();

            onCreated();
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
                        Nova competição
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Cadastre uma nova competição
                        e defina seu pódio.
                    </p>
                </div>

                <CompetitionForm
                    loading={loading}
                    submitText="Criar competição"
                    onSubmit={handleCreate}
                />
            </Card>
        </Dialog>
    );
}