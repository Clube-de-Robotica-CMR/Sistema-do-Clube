import { useEffect, useState } from "react";

import type { Quarter } from "@/core/entities/meeting.entity";

import {
    findBonusRows,
} from "./services";

import type { BonusRow } from "./types";

import BonusToolbar from "./components/bonus_toolbar";
import BonusTable from "./components/bonus_table";
import BonusLoading from "./components/bonus_loading";
import BonusEmpty from "./components/bonus_empty";
import BonusFilterDialog from "./components/bonus_filter_dialog";

export default function BonusModule() {
    const [rows, setRows] =
        useState<BonusRow[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [quarter, setQuarter] =
        useState<Quarter>("1°");

    const [filterOpen, setFilterOpen] =
        useState(false);

    async function loadRows() {
        try {
            setLoading(true);

            const response =
                await findBonusRows(
                    quarter,
                );

            setRows(response);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRows();
    }, []);

    useEffect(() => {
        loadRows();
    }, [quarter]);

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">
                        GIP
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Visualize presença e
                        bonificação dos alunos.
                    </p>
                </header>

                <BonusToolbar
                    filterApplied={quarter !== "1°"}
                    onFilter={() =>
                        setFilterOpen(true)
                    }
                />

                <div className="flex-1">
                    {loading ? (
                        <BonusLoading />
                    ) : rows.length === 0 ? (
                        <BonusEmpty />
                    ) : (
                        <BonusTable
                            rows={rows}
                        />
                    )}
                </div>
            </div>

            <BonusFilterDialog
                open={filterOpen}
                quarter={quarter}
                onClose={() =>
                    setFilterOpen(false)
                }
                onApply={(newQuarter) => {
                    setQuarter(newQuarter);

                    setFilterOpen(false);
                }}
            />
        </>
    );
}