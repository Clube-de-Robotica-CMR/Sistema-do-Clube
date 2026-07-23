import { useEffect, useState } from "react";

import type {
    FindMeetingsFilter,
    Meeting,
} from "@/core/entities/meeting.entity";

import {
    deleteAllMeetings,
    findMeetings,
} from "./services";

import MeetingsToolbar from "./components/meetings_toolbar";
import MeetingsGallery from "./components/meetings_gallery";
import MeetingsLoading from "./components/meetings_loading";
import MeetingsEmpty from "./components/meetings_empty";

import ConfirmDialog from "@/components/ui/confirm_dialog";
import CreateMeetingDialog from "./components/create_meeting_dialog";
import MeetingDetailsDialog from "./components/meeting_details_dialog";
import MeetingFiltersDialog from "./components/meeting_filters_dialog";
import DeleteMeetingDialog from "./components/delete_meeting_dialog";

interface MeetingsModuleProps {
    role: "admin" | "diretoria";
}

export default function MeetingsModule({
    role,
}: MeetingsModuleProps) {
    const [meetings, setMeetings] = useState<
        Meeting[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [filters, setFilters] =
        useState<
            Partial<FindMeetingsFilter>
        >({});

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [createOpen, setCreateOpen] =
        useState(false);

    const [viewingMeeting, setViewingMeeting] =
        useState<Meeting | null>(null);

    const [deletingMeeting, setDeletingMeeting] =
        useState<Meeting | null>(null);

    const [deleteAllOpen, setDeleteAllOpen] =
        useState(false);

    async function loadMeetings(
        filterValue?: Partial<FindMeetingsFilter>
    ) {
        try {
            setLoading(true);

            const response =
                await findMeetings(
                    filterValue ?? filters
                );

            setMeetings(response);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMeetings();
    }, []);

    useEffect(() => {
        loadMeetings();
    }, [filters]);

    function handleFilter() {
        setFilterOpen(true);
    }

    function handleCreate() {
        setCreateOpen(true);
    }

    function handleOpen(
        meeting: Meeting
    ) {
        setViewingMeeting(meeting);
    }

    function handleDelete(
        meeting: Meeting
    ) {
        setDeletingMeeting(meeting);
    }

    async function handleDeleteAll() {
        await deleteAllMeetings();

        setDeleteAllOpen(false);

        loadMeetings();
    }

    const filtersApplied =
        Object.values(filters).some(
            (value) =>
                value !== undefined &&
                value !== null
        );

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">
                        Encontros
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Gerencie todos os encontros
                        do clube.
                    </p>
                </header>

                <MeetingsToolbar
                    role={role}
                    filtersApplied={
                        filtersApplied
                    }
                    onFilter={handleFilter}
                    onCreate={handleCreate}
                    onDeleteAll={() =>
                        setDeleteAllOpen(true)
                    }
                />

                <div className="flex-1">
                    {loading ? (
                        <MeetingsLoading />
                    ) : meetings.length ===
                        0 ? (
                        <MeetingsEmpty
                            onCreate={
                                handleCreate
                            }
                        />
                    ) : (
                        <MeetingsGallery
                            meetings={
                                meetings
                            }
                            onOpen={
                                handleOpen
                            }
                            onDelete={
                                handleDelete
                            }
                        />
                    )}
                </div>
            </div>

            <MeetingDetailsDialog
                meeting={viewingMeeting}
                open={
                    viewingMeeting !== null
                }
                onClose={() =>
                    setViewingMeeting(null)
                }
                onUpdated={loadMeetings}
            />

            <MeetingFiltersDialog
                open={filterOpen}
                filters={filters}
                onClose={() =>
                    setFilterOpen(false)
                }
                onApply={(newFilters: Partial<FindMeetingsFilter>) => {
                    setFilters(newFilters);
                    setFilterOpen(false);
                }}
            />

            <CreateMeetingDialog
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
                onCreated={loadMeetings}
            />

            <DeleteMeetingDialog
                meeting={deletingMeeting}
                open={
                    deletingMeeting !== null
                }
                onClose={() =>
                    setDeletingMeeting(null)
                }
                onDeleted={loadMeetings}
            />

            <ConfirmDialog
                open={deleteAllOpen}
                variant="danger"
                title="Apagar todos os encontros?"
                description="Todos os encontros cadastrados serão removidos permanentemente."
                confirmText="Apagar"
                cancelText="Cancelar"
                onClose={() =>
                    setDeleteAllOpen(false)
                }
                onConfirm={
                    handleDeleteAll
                }
            />
        </>
    );
}