import { useEffect, useState } from "react";

import type { RankingRow } from "./types";

import { findRanking } from "./services";

import RankingTable from "./components/ranking_table";
import RankingLoading from "./components/ranking_loading";
import RankingEmpty from "./components/ranking_empty";

export default function RankingModule() {
    const [rows, setRows] = useState<
        RankingRow[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    async function loadRanking() {
        try {
            setLoading(true);

            const ranking =
                await findRanking();

            setRows(ranking);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRanking();
    }, []);

    return (
        <div className="flex h-full flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold">
                    Ascensão
                </h1>

                <p className="mt-2 text-slate-500">
                    Ranking geral de pontuação
                    dos alunos e elegibilidade
                    para ascensão de nível.
                </p>
            </header>

            <div className="flex-1">
                {loading ? (
                    <RankingLoading />
                ) : rows.length === 0 ? (
                    <RankingEmpty />
                ) : (
                    <RankingTable
                        rows={rows}
                    />
                )}
            </div>
        </div>
    );
}