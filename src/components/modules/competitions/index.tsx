import { useEffect, useState } from "react";

import type { Competition } from "@/core/entities/competition.entity";

import { deleteCompetition, findCompetitions } from "./services";

import CompetitionsToolbar from "./components/competitions_toolbar";
import CompetitionsGallery from "./components/competitions_gallery";
import CompetitionsLoading from "./components/competitions_loading";
import CompetitionsEmpty from "./components/competitions_empty";
import CompetitionDetailsDialog from "./components/competition_details_dialog";
import CreateCompetitionDialog from "./components/create_competition_dialog";
import CompetitionFiltersDialog from "./components/competition_filters_dialog";
import ConfirmDialog from "@/components/ui/confirm_dialog"; // Importando o ConfirmDialog

export default function CompetitionsModule() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState<number | undefined>(new Date().getFullYear());

    // Estados para controle dos Modais
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Estados para rastrear a competição selecionada
    const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
    const [competitionIdToDelete, setCompetitionIdToDelete] = useState<string | null>(null);

    async function loadCompetitions() {
        try {
            setLoading(true);
            const data = await findCompetitions({ search, year });
            setCompetitions(data);
        } finally {
            setLoading(false);
        }
    }

    // Chamado pelo card na galeria: apenas guarda o ID e abre o modal de confirmação
    function handleOpenDeleteConfirm(competition: Competition) {
        setCompetitionIdToDelete(competition.id);
        setDeleteOpen(true);
    }

    // Chamado pelo onConfirm do ConfirmDialog: deleta de fato no banco de dados
    async function handleDeleteCompetition() {
        if (!competitionIdToDelete) return;

        try {
            setLoading(true);
            await deleteCompetition(competitionIdToDelete);
            setDeleteOpen(false);
            setCompetitionIdToDelete(null);
            await loadCompetitions(); // Atualiza a lista após deletar
        } catch (error) {
            console.error("Erro ao deletar competição:", error);
            alert("Não foi possível deletar a competição.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCompetitions();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadCompetitions();
        }, 250);

        return () => clearTimeout(timeout);
    }, [search, year]);

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">Competições</h1>
                    <p className="mt-2 text-slate-500">
                        Gerencie o histórico de competições do clube.
                    </p>
                </header>

                <CompetitionsToolbar
                    search={search}
                    onSearch={setSearch}
                    filtersApplied={year !== undefined}
                    onFilter={() => setFiltersOpen(true)}
                    onCreate={() => setCreateOpen(true)}
                />

                <div className="flex-1">
                    {loading && competitions.length === 0 ? (
                        <CompetitionsLoading />
                    ) : competitions.length === 0 ? (
                        <CompetitionsEmpty onCreate={() => setCreateOpen(true)} />
                    ) : (
                        <CompetitionsGallery
                            competitions={competitions}
                            onOpen={setSelectedCompetition}
                            onDelete={handleOpenDeleteConfirm} // Abre a confirmação
                        />
                    )}
                </div>
            </div>

            <CompetitionFiltersDialog
                open={filtersOpen}
                year={year}
                onClose={() => setFiltersOpen(false)}
                onApply={setYear}
            />

            <CreateCompetitionDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={loadCompetitions}
            />

            <CompetitionDetailsDialog
                competition={selectedCompetition}
                open={selectedCompetition !== null}
                onClose={() => setSelectedCompetition(null)}
                onUpdated={loadCompetitions}
            />

            {/* Modal de Confirmação adicionado ao escopo global do módulo */}
            <ConfirmDialog
                variant="danger"
                open={deleteOpen}
                title="Deletar competição"
                description="Tem certeza que deseja remover esta competição e todo o seu pódio? Esta ação não pode ser desfeita."
                onClose={() => {
                    setDeleteOpen(false);
                    setCompetitionIdToDelete(null);
                }}
                onConfirm={handleDeleteCompetition}
                loading={loading}
            />
        </>
    );
}
