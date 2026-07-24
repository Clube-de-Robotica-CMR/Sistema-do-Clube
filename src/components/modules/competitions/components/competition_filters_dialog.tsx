import { useEffect, useState } from "react";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface CompetitionFiltersDialogProps {
    open: boolean;

    year?: number;

    onClose(): void;

    onApply(year?: number): void;
}

export default function CompetitionFiltersDialog({
    open,
    year,
    onClose,
    onApply,
}: CompetitionFiltersDialogProps) {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(
            year
                ? String(year)
                : ""
        );
    }, [year, open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
        >
            <Card className="rounded-3xl p-8">
                <h2 className="text-2xl font-bold">
                    Filtros
                </h2>

                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium">
                        Ano
                    </label>

                    <Input
                        type="number"
                        placeholder="Ex.: 2026"
                        value={value}
                        onChange={(event) =>
                            setValue(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={() => {
                            onApply(
                                value.trim()
                                    ? Number(value)
                                    : undefined
                            );

                            onClose();
                        }}
                    >
                        Aplicar
                    </Button>
                </div>
            </Card>
        </Dialog>
    );
}