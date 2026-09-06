import { useEffect, useState } from "react";

import type {
    GroupWithMembers,
} from "@/core/entities/member.entity";

import { findGroups } from "./services";

import GroupsToolbar from "./components/groups_toolbar";
import GroupsGrid from "./components/groups_grid";
import GroupsLoading from "./components/groups_loading";
import GroupsEmpty from "./components/groups_empty";

import GroupDetailsDialog from "./components/group_details_dialog";
import GroupFormDialog from "./components/group_form_dialog";
import DeleteGroupDialog from "./components/delete_group_dialog";

export default function GroupsModule() {
    const [groups, setGroups] =
        useState<GroupWithMembers[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [viewingGroup, setViewingGroup] =
        useState<GroupWithMembers | null>(
            null
        );

    const [createOpen, setCreateOpen] =
        useState(false);

    const [editingGroup, setEditingGroup] =
        useState<GroupWithMembers | null>(
            null
        );

    const [deletingGroup, setDeletingGroup] =
        useState<GroupWithMembers | null>(
            null
        );

    async function loadGroups() {
        try {
            setLoading(true);

            const response =
                await findGroups();

            setGroups(response);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGroups();
    }, []);

    function handleCreate() {
        setCreateOpen(true);
    }

    function handleView(
        group: GroupWithMembers
    ) {
        setViewingGroup(group);
    }

    function handleEdit(
        group: GroupWithMembers
    ) {
        setEditingGroup(group);
    }

    function handleDelete(
        group: GroupWithMembers
    ) {
        setDeletingGroup(group);
    }

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">
                        Grupos
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Organize os alunos em grupos.
                    </p>
                </header>

                <GroupsToolbar
                    onCreate={handleCreate}
                />

                <div className="flex-1">
                    {loading ? (
                        <GroupsLoading />
                    ) : groups.length === 0 ? (
                        <GroupsEmpty
                            onCreate={
                                handleCreate
                            }
                        />
                    ) : (
                        <GroupsGrid
                            groups={groups}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={
                                handleDelete
                            }
                        />
                    )}
                </div>
            </div>

            <GroupDetailsDialog
                group={viewingGroup}
                open={
                    viewingGroup !== null
                }
                onClose={() =>
                    setViewingGroup(null)
                }
            />

            <GroupFormDialog
                open={createOpen}
                mode="create"
                onClose={() =>
                    setCreateOpen(false)
                }
                onSaved={() => {
                    setCreateOpen(false);
                    loadGroups();
                }}
            />

            <GroupFormDialog
                open={
                    editingGroup !== null
                }
                mode="edit"
                group={
                    editingGroup ??
                    undefined
                }
                onClose={() =>
                    setEditingGroup(null)
                }
                onSaved={() => {
                    setEditingGroup(null);
                    loadGroups();
                }}
            />

            <DeleteGroupDialog
                open={
                    deletingGroup !== null
                }
                group={deletingGroup}
                onClose={() =>
                    setDeletingGroup(null)
                }
                onDeleted={() => {
                    setDeletingGroup(null);
                    loadGroups();
                }}
            />
        </>
    );
}