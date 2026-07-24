import { useEffect, useState } from "react";

import type {
    CreateCompetitionDTO,
    CompetitionResult,
    Placement,
} from "@/core/entities/competition.entity";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import PodiumSection from "./podium_section"; // Importação do seu componente de pódio

import { ValidationError } from "@/lib/validation_error";

// Tipo simplificado idêntico ao exigido pelo Dialog
interface CompetitionFormData {
    competition: CreateCompetitionDTO;
    results: Omit<
        CompetitionResult,
        "id" | "competition_id" | "created_at" | "updated_at"
    >[];
}

interface CompetitionFormProps {
    initialValues?: Partial<CreateCompetitionDTO>;
    initialResults?: CompetitionResult[]; // Permite reaproveitar para edição futuramente
    loading?: boolean;
    submitText: string;
    onSubmit(data: CompetitionFormData): Promise<void>;
}

export default function CompetitionForm({
    initialValues,
    initialResults = [],
    loading,
    submitText,
    onSubmit,
}: CompetitionFormProps) {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");

    // Estado unificado para os resultados do pódio
    const [results, setResults] = useState<CompetitionResult[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setName(initialValues?.name ?? "");

        setDate(
            initialValues?.date
                ? new Date(initialValues.date).toISOString().split("T")[0]
                : ""
        );

        setResults(initialResults);
        setErrors({});
    }, [initialValues, initialResults]);

    // Filtra os resultados por colocação para alimentar cada seção do pódio
    const getResultsByPlacement = (placement: Placement) =>
        results.filter((r) => r.placement === placement);

    // Atualiza apenas os resultados da colocação específica mantendo o restante intocado
    const handlePodiumChange = (placement: Placement, updatedSection: CompetitionResult[]) => {
        const remainingResults = results.filter((r) => r.placement !== placement);
        setResults([...remainingResults, ...updatedSection]);
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setErrors({});

        // 1. Validação do Pódio no Frontend
        // Verifica se existe alguma linha adicionada onde o nome ou número está em branco
        const hasEmptyResults = results.some(
            (r) => !r.member_war_name.trim() || !r.member_number.trim()
        );

        if (hasEmptyResults) {
            setErrors({
                podium: "Preencha todos os campos dos competidores adicionados ou remova as linhas vazias."
            });
            return; // Bloqueia o envio para o backend
        }

        try {
            const parsedDate = new Date(`${date}T00:00:00`);

            const formattedResults = results.map(
                ({ member_number, member_war_name, placement }) => ({
                    member_number: member_number.trim(),
                    member_war_name: member_war_name.trim(),
                    placement,
                })
            );

            await onSubmit({
                competition: {
                    name,
                    date: parsedDate,
                },
                results: formattedResults,
            });
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
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados Principais da Competição */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Nome da Competição"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    required
                />

                <Input
                    label="Data"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    error={errors.date}
                    required
                />
            </div>

            {/* Gerenciamento Dinâmico do Pódio */}
            <div className="border-t border-slate-100 pt-6 space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Classificação do Pódio</h3>

                <div className="grid grid-cols-1 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <PodiumSection
                        title="1°"
                        results={getResultsByPlacement("1°")}
                        onChange={(updated) => handlePodiumChange("1°", updated)}
                    />

                    <PodiumSection
                        title="2°"
                        results={getResultsByPlacement("2°")}
                        onChange={(updated) => handlePodiumChange("2°", updated)}
                    />

                    <PodiumSection
                        title="3°"
                        results={getResultsByPlacement("3°")}
                        onChange={(updated) => handlePodiumChange("3°", updated)}
                    />
                </div>
            </div>

            {errors.podium && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600 animate-fade-in">
                    {errors.podium}
                </div>
            )}

            {/* Rodapé de Ações */}
            <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading} disabled={loading}>
                    {submitText}
                </Button>
            </div>
        </form>
    );
}
