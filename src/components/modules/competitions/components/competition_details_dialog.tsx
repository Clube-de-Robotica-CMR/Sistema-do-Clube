// competition_details_dialog.tsx

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type {
    Competition,
    CompetitionResult,
} from "@/core/entities/competition.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import ConfirmDialog from "@/components/ui/confirm_dialog";

import CompetitionResultsEditor from "./competition_results_editor";

import {
    deleteCompetition,
    findCompetitionResults,
    saveCompetitionResults,
    updateCompetition,
} from "../services";

import { formatCompetitionDate, placementMedal } from "../utils";

import { ValidationError } from "@/lib/validation_error";

interface CompetitionDetailsDialogProps {
    competition: Competition | null;
    open: boolean;
    onClose(): void;
    onUpdated(): void;
}

export default function CompetitionDetailsDialog({
    competition,
    open,
    onClose,
    onUpdated,
}: CompetitionDetailsDialogProps) {
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [results, setResults] = useState<CompetitionResult[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open || !competition) {
            return;
        }

        async function load() {
            const response = await findCompetitionResults(competition!.id);

            setName(competition!.name);
            setDate(new Date(competition!.date).toISOString().split("T")[0]);
            setResults(response);
            setEditing(false);
            setErrors({});
        }

        load();
    }, [open, competition]);

    async function handleSave() {
        if (!competition) return;

        setErrors({});

        // 1. Validação do Pódio no Frontend (Bloqueio de campos vazios)
        const hasEmptyResults = results.some(
            (r) => !r.member_war_name?.trim() || !r.member_number?.trim()
        );

        if (hasEmptyResults) {
            setErrors({
                podium: "Preencha todos os campos dos competidores adicionados ou remova as linhas vazias."
            });
            return; // Bloqueia a execução aqui, impedindo o envio ao backend
        }

        try {
            setLoading(true);

            // Ajuste de fuso horário seguro local ao salvar
            const parsedDate = new Date(`${date}T00:00:00`);

            await updateCompetition({
                id: competition.id,
                name,
                date: parsedDate,
            });

            await saveCompetitionResults({
                competition_id: competition.id,
                // Aplica o .trim() para limpar espaços extras antes de enviar
                results: results.map(
                    ({ member_number, member_war_name, placement }) => ({
                        member_number: member_number.trim(),
                        member_war_name: member_war_name.trim(),
                        placement,
                    })
                ),
            });

            setEditing(false);
            onUpdated();
        } catch (error) {
            if (error instanceof ValidationError) {
                const fieldErrors: Record<string, string> = {};

                Object.entries(error.details.fieldErrors).forEach(([field, messages]) => {
                    if (messages && messages.length > 0) {
                        fieldErrors[field] = messages[0];
                    }
                });

                setErrors(fieldErrors);
                return;
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!competition) return;

        try {
            setLoading(true);
            await deleteCompetition(competition.id);
            setDeleteOpen(false);
            onClose();
            onUpdated();
        } finally {
            setLoading(false);
        }
    }

    if (!competition) {
        return null;
    }

    const firstPlace = results.filter((result) => result.placement === "1°");
    const secondPlace = results.filter((result) => result.placement === "2°");
    const thirdPlace = results.filter((result) => result.placement === "3°");

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
            >
                <Card className="rounded-3xl p-8">
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {competition.name}
                            </h2>

                            <p className="mt-2 text-slate-500">
                                {formatCompetitionDate(competition.date)}
                            </p>
                        </div>

                        {/* Container de Ações Blindado */}
                        <div className="flex items-center gap-3 shrink-0">
                            {!editing ? (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="h-11 w-11 p-0 flex items-center justify-center rounded-xl shrink-0"
                                    onClick={() => setEditing(true)}
                                >
                                    <Pencil size={18} />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    loading={loading}
                                    className="h-11 px-5 font-medium whitespace-nowrap rounded-xl"
                                    onClick={handleSave}
                                >
                                    Salvar
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="danger"
                                className="h-11 w-11 p-0 flex items-center justify-center rounded-xl shrink-0"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </div>

                    {editing ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Nome"
                                    value={name}
                                    error={errors.name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Input
                                    label="Data"
                                    type="date"
                                    value={date}
                                    error={errors.date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <CompetitionResultsEditor
                                results={results}
                                onChange={setResults}
                            />

                            {/* Alerta de erro visual do pódio para o usuário */}
                            {errors.podium && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600 animate-fade-in">
                                    {errors.podium}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Card 1° Lugar */}
                            <Card className="rounded-2xl p-5">
                                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <span>{placementMedal("1°")}</span>
                                    Primeiro Lugar
                                </h3>

                                <div className="space-y-3">
                                    {firstPlace.length === 0 ? (
                                        <p className="text-slate-400">Nenhum resultado.</p>
                                    ) : (
                                        firstPlace.map((result) => (
                                            <div
                                                key={result.id}
                                                className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
                                            >
                                                <span className="font-medium">
                                                    {result.member_war_name}
                                                </span>
                                                <span className="text-slate-500">
                                                    {result.member_number}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>

                            {/* Card 2° Lugar */}
                            <Card className="rounded-2xl p-5">
                                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <span>{placementMedal("2°")}</span>
                                    Segundo Lugar
                                </h3>

                                <div className="space-y-3">
                                    {secondPlace.length === 0 ? (
                                        <p className="text-slate-400">Nenhum resultado.</p>
                                    ) : (
                                        secondPlace.map((result) => (
                                            <div
                                                key={result.id}
                                                className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
                                            >
                                                <span className="font-medium">
                                                    {result.member_war_name}
                                                </span>
                                                <span className="text-slate-500">
                                                    {result.member_number}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>

                            {/* Card 3° Lugar */}
                            <Card className="rounded-2xl p-5">
                                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                    <span>{placementMedal("3°")}</span>
                                    Terceiro Lugar
                                </h3>

                                <div className="space-y-3">
                                    {thirdPlace.length === 0 ? (
                                        <p className="text-slate-400">Nenhum resultado.</p>
                                    ) : (
                                        thirdPlace.map((result) => (
                                            <div
                                                key={result.id}
                                                className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
                                            >
                                                <span className="font-medium">
                                                    {result.member_war_name}
                                                </span>
                                                <span className="text-slate-500">
                                                    {result.member_number}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}
                </Card>
            </Dialog>

            <ConfirmDialog
                variant="danger"
                open={deleteOpen}
                title="Deletar competição"
                description="Tem certeza que deseja remover esta competição e todo o seu pódio? Esta ação não pode ser desfeita."
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                loading={loading}
            />
        </>
    );
}
