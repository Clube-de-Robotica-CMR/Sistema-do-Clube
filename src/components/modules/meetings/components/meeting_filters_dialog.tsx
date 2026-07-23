import { useEffect, useState } from "react";

import type {
    FindMeetingsFilter,
    Quarter,
} from "@/core/entities/meeting.entity";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface MeetingFiltersDialogProps {
    open: boolean;

    filters: Partial<FindMeetingsFilter>;

    onClose(): void;

    onApply(
        filters: Partial<FindMeetingsFilter>
    ): void;
}

const quarters: Quarter[] = [
    "1°",
    "2°",
    "3°",
];

export default function MeetingFiltersDialog({
    open,
    filters,
    onClose,
    onApply,
}: MeetingFiltersDialogProps) {
    const [quarter, setQuarter] =
        useState("");

    useEffect(() => {
        if (!open) return;

        setQuarter(
            filters.quarter ?? ""
        );
    }, [open, filters]);

    function handleApply() {
        onApply({
            quarter: quarter
                ? (quarter as Quarter)
                : undefined,
        });
    }

    function handleClear() {
        setQuarter("");

        onApply({});
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
        >
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        Filtros
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Filtre os encontros
                        cadastrados.
                    </p>
                </div>

                <div className="space-y-5">
                    <label className="space-y-2 block">
                        <span className="text-sm font-medium">
                            Trimestre
                        </span>

                        <select
                            value={quarter}
                            onChange={(e) =>
                                setQuarter(
                                    e.target.value
                                )
                            }
                            className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                bg-white
                                px-4
                                transition
                                focus:border-violet-600
                                focus:ring-4
                                focus:ring-violet-100
                                focus:outline-none
                            "
                        >
                            <option value="">
                                Todos
                            </option>

                            {quarters.map(
                                (
                                    quarter
                                ) => (
                                    <option
                                        key={
                                            quarter
                                        }
                                        value={
                                            quarter
                                        }
                                    >
                                        {
                                            quarter
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    <div className="flex justify-between pt-4">
                        <Button
                            variant="secondary"
                            onClick={
                                handleClear
                            }
                        >
                            Limpar filtros
                        </Button>

                        <Button
                            onClick={
                                handleApply
                            }
                        >
                            Aplicar filtros
                        </Button>
                    </div>
                </div>
            </Card>
        </Dialog>
    );
}