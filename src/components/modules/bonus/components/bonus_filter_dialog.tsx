import { useEffect, useState } from "react";

import type { Quarter } from "@/core/entities/meeting.entity";

import Card from "@/components/ui/card";
import Dialog from "@/components/ui/dialog";
import Button from "@/components/ui/button";

interface BonusFilterDialogProps {
    open: boolean;

    quarter: Quarter;

    onClose(): void;

    onApply(
        quarter: Quarter
    ): void;
}

const quarters: Quarter[] = [
    "1°",
    "2°",
    "3°",
];

export default function BonusFilterDialog({
    open,
    quarter,
    onClose,
    onApply,
}: BonusFilterDialogProps) {
    const [selectedQuarter, setSelectedQuarter] =
        useState<Quarter>("1°");

    useEffect(() => {
        setSelectedQuarter(quarter);
    }, [quarter]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
        >
            <Card className="rounded-3xl p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        Filtros
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Selecione o trimestre desejado.
                    </p>
                </div>

                <label className="space-y-2">
                    <span className="text-sm font-medium">
                        Trimestre
                    </span>

                    <select
                        value={selectedQuarter}
                        onChange={(event) =>
                            setSelectedQuarter(
                                event.target.value as Quarter
                            )
                        }
                        className="
                            h-12
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            transition
                            focus:border-violet-500
                            focus:outline-none
                        "
                    >
                        {quarters.map((quarter) => (
                            <option
                                key={quarter}
                                value={quarter}
                            >
                                {quarter}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="mt-8 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={() =>
                            onApply(selectedQuarter)
                        }
                    >
                        Aplicar
                    </Button>
                </div>
            </Card>
        </Dialog>
    );
}