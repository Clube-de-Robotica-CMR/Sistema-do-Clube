import { useEffect, useMemo, useState } from "react";

import Dialog from "@/components/ui/dialog";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import type {
    GroupWithMembers,
    Member,
} from "@/core/entities/member.entity";

import {
    createGroup,
    updateGroup,
} from "../services";

import { findMembers } from "../../students/services";

interface GroupFormDialogProps {
    open: boolean;
    mode: "create" | "edit";

    group?: GroupWithMembers;

    onClose(): void;
    onSaved(): void;
}

export default function GroupFormDialog({
    open,
    mode,
    group,
    onClose,
    onSaved,
}: GroupFormDialogProps) {
    const [name, setName] =
        useState("");

    const [members, setMembers] =
        useState<Member[]>([]);

    const [selectedIds, setSelectedIds] =
        useState<string[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loadingMembers, setLoadingMembers] =
        useState(false);

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && group) {
            setName(group.name);

            setSelectedIds(
                group.members.map(
                    (member) => member.id
                )
            );
        } else {
            setName("");
            setSelectedIds([]);
        }

        setSearch("");
    }, [open, mode, group]);

    useEffect(() => {
        if (!open) return;

        async function loadMembers() {
            try {
                setLoadingMembers(true);

                const response =
                    await findMembers();

                setMembers(response);
            } finally {
                setLoadingMembers(false);
            }
        }

        loadMembers();
    }, [open]);

    const filteredMembers = useMemo(() => {
        const normalized =
            search.trim().toLowerCase();

        if (!normalized) {
            return members;
        }

        return members.filter((member) => {
            return (
                member.war_name
                    .toLowerCase()
                    .includes(normalized) ||
                member.full_name
                    .toLowerCase()
                    .includes(normalized) ||
                member.number
                    .toLowerCase()
                    .includes(normalized)
            );
        });
    }, [members, search]);

    function toggleMember(id: string) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter(
                    (memberId) =>
                        memberId !== id
                )
                : [...current, id]
        );
    }

    async function handleSubmit(
        event: React.SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
            setLoading(true);

            if (mode === "create") {
                await createGroup({
                    name,
                    member_ids: selectedIds,
                });
            } else {
                if (!group) return;

                await updateGroup({
                    id: group.id,
                    name,
                    member_ids: selectedIds,
                });
            }

            onSaved();
            onClose();
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
                        {mode === "create"
                            ? "Novo grupo"
                            : "Editar grupo"}
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Defina o nome do grupo e
                        selecione os membros.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <Input
                        label="Nome do grupo"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        required
                    />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    Membros
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {
                                        selectedIds.length
                                    }{" "}
                                    selecionado
                                    {selectedIds.length ===
                                    1
                                        ? ""
                                        : "s"}
                                </p>
                            </div>

                            <div className="w-72">
                                <Input
                                    value={search}
                                    placeholder="Pesquisar aluno..."
                                    onChange={(event) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200">
                            {loadingMembers ? (
                                <div className="p-8 text-center text-slate-500">
                                    Carregando alunos...
                                </div>
                            ) : filteredMembers.length ===
                              0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    Nenhum aluno encontrado.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredMembers.map(
                                        (member) => {
                                            const checked =
                                                selectedIds.includes(
                                                    member.id
                                                );

                                            return (
                                                <label
                                                    key={
                                                        member.id
                                                    }
                                                    className="
                                                        flex
                                                        cursor-pointer
                                                        items-center
                                                        gap-4
                                                        px-5
                                                        py-4
                                                        transition
                                                        hover:bg-violet-50/40
                                                    "
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            checked
                                                        }
                                                        onChange={() =>
                                                            toggleMember(
                                                                member.id
                                                            )
                                                        }
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-slate-900">
                                                            {
                                                                member.war_name
                                                            }
                                                        </p>

                                                        <p className="text-sm text-slate-500">
                                                            Nº{" "}
                                                            {
                                                                member.number
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                member.class
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                member.field
                                                            }
                                                        </p>
                                                    </div>

                                                    {member.group_id &&
                                                        member.group_id !==
                                                            group?.id && (
                                                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                                                Em outro
                                                                grupo
                                                            </span>
                                                        )}
                                                </label>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-slate-500">
                            Se um aluno já pertencer a
                            outro grupo e for selecionado,
                            ele será movido para este
                            grupo.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-auto px-6"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-auto px-6"
                        >
                            {mode === "create"
                                ? "Criar grupo"
                                : "Salvar alterações"}
                        </Button>
                    </div>
                </form>
            </Card>
        </Dialog>
    );
}