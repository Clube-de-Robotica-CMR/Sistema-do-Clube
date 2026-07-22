import { useEffect, useState } from "react";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import type {
    FindMembersFilter,
    MemberField,
    MemberLevel,
} from "@/core/entities/member.entity";

interface StudentFiltersDialogProps {
    open: boolean;

    filters: FindMembersFilter;

    onClose(): void;

    onApply(filters: FindMembersFilter): void;
}

const levels: (MemberLevel | "")[] = [
    "",
    "Nível B",
    "Nível A",
    "Indefinido",
];

const fields: (MemberField | "")[] = [
    "",
    "Programação",
    "Mecatrônica",
    "Indefinido",
];

export default function StudentFiltersDialog({
    open,
    filters,
    onClose,
    onApply,
}: StudentFiltersDialogProps) {
    const [studentClass, setStudentClass] =
        useState("");

    const [level, setLevel] =
        useState<MemberLevel | "">("");

    const [field, setField] =
        useState<MemberField | "">("");

    const [director, setDirector] =
        useState<"" | "true" | "false">("");

    useEffect(() => {
        if (!open) return;

        setStudentClass(filters.class ?? "");

        setLevel(
            (filters.level as MemberLevel) ?? ""
        );

        setField(
            (filters.field as MemberField) ?? ""
        );

        if (filters.is_director === true) {
            setDirector("true");
        } else if (
            filters.is_director === false
        ) {
            setDirector("false");
        } else {
            setDirector("");
        }
    }, [filters, open]);

    function handleApply(
        event: React.FormEvent
    ) {
        event.preventDefault();

        onApply({
            class: studentClass || undefined,
            level: level || undefined,
            field: field || undefined,
            is_director:
                director === ""
                    ? undefined
                    : director === "true",
        });

        onClose();
    }

    function handleClear() {
        setStudentClass("");
        setLevel("");
        setField("");
        setDirector("");

        onApply({});

        onClose();
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
                        Filtrar alunos
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Escolha quais alunos deseja
                        visualizar.
                    </p>
                </div>

                <form
                    onSubmit={handleApply}
                    className="space-y-5"
                >
                    <Input
                        label="Turma"
                        value={studentClass}
                        onChange={(e) =>
                            setStudentClass(
                                e.target.value
                            )
                        }
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <label className="space-y-2">
                            <span className="text-sm font-medium">
                                Área
                            </span>

                            <select
                                value={field}
                                onChange={(e) =>
                                    setField(
                                        e.target
                                            .value as MemberField
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 px-4"
                            >
                                {fields.map((value) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {value === ""
                                            ? "Todas"
                                            : value}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium">
                                Nível
                            </span>

                            <select
                                value={level}
                                onChange={(e) =>
                                    setLevel(
                                        e.target
                                            .value as MemberLevel
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 px-4"
                            >
                                {levels.map((value) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {value === ""
                                            ? "Todos"
                                            : value}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label className="space-y-2 block">
                        <span className="text-sm font-medium">
                            Diretoria
                        </span>

                        <select
                            value={director}
                            onChange={(e) =>
                                setDirector(
                                    e.target.value as
                                    | ""
                                    | "true"
                                    | "false"
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 px-4"
                        >
                            <option value="">
                                Todos
                            </option>

                            <option value="true">
                                Apenas diretoria
                            </option>

                            <option value="false">
                                Apenas membros
                            </option>
                        </select>
                    </label>

                    <div className="flex justify-between pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClear}
                        >
                            Limpar filtros
                        </Button>

                        <Button type="submit">
                            Aplicar filtros
                        </Button>
                    </div>
                </form>
            </Card>
        </Dialog>
    );
}