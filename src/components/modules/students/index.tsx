import { useEffect, useState } from "react";

import type {
    FindMembersFilter,
    GroupWithMembers,
    Member,
} from "@/core/entities/member.entity";

import {
    deleteAllMembers,
    findGroups,
    findMembers,
} from "./services";

import StudentsToolbar from "./components/students_toolbar";
import StudentsTable from "./components/students_table";
import StudentsLoading from "./components/students_loading";
import StudentsEmpty from "./components/students_empty";

import ConfirmDialog from "@/components/ui/confirm_dialog";
import CreateStudentDialog from "./components/create_student_dialog";
import EditStudentDialog from "./components/edit_student_dialog";
import DeleteStudentDialog from "./components/delete_student_dialog";
import StudentDetailsDialog from "./components/student_details_dialog";
import StudentFiltersDialog from "./components/student_filters_dialog";
import { generateStudentsPDF } from "@/lib/students_pdf";
import ExportPdfDialog from "@/components/ui/export_pdf_dialog";

interface StudentsModuleProps {
    role: "admin" | "diretoria";
}

export default function StudentsModule({
    role,
}: StudentsModuleProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filters, setFilters] =
        useState<FindMembersFilter>({});

    const [filterOpen, setFilterOpen] =
        useState(false);

    const [viewingMember, setViewingMember] =
        useState<Member | null>(null);

    const [createOpen, setCreateOpen] =
        useState(false);

    const [editingMember, setEditingMember] =
        useState<Member | null>(null);

    const [deletingMember, setDeletingMember] =
        useState<Member | null>(null);

    const [deleteAllOpen, setDeleteAllOpen] =
        useState(false);

    const [pdfOpen, setPdfOpen] =
        useState(false);

    const [groups, setGroups] =
        useState<GroupWithMembers[]>([]);


    const hasFilters = Object.values(filters).some(
        (value) =>
            value !== undefined &&
            value !== "" &&
            value !== false
    );

    async function loadMembers(
        searchValue?: string,
        filterValue?: FindMembersFilter
    ) {
        try {
            setLoading(true);

            const response = await findMembers({
                ...(filterValue ?? filters),
                search: searchValue ?? search,
            });

            setMembers(response);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    loadMembers();
    loadGroups();
}, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadMembers();
        }, 250);

        return () => clearTimeout(timeout);
    }, [search, filters]);

    async function loadGroups() {
    const response = await findGroups();
    setGroups(response);
}

    function handleFilter() {
        setFilterOpen(true);
    }

    function handleView(member: Member) {
        setViewingMember(member);
    }

    function handleCreate() {
        setCreateOpen(true);
    }

    function handleEdit(member: Member) {
        setEditingMember(member);
    }

    function handleDelete(member: Member) {
        setDeletingMember(member);
    }

    function handlePDF() {
        setPdfOpen(true);
    }

    async function handleDeleteAll() {
        await deleteAllMembers();

        setDeleteAllOpen(false);

        loadMembers();
    }

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">
                        Alunos
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Gerencie todos os alunos do
                        clube.
                    </p>
                </header>

                <StudentsToolbar
                    role={role}
                    search={search}
                    hasFilters={hasFilters}
                    onSearch={setSearch}
                    onFilter={handleFilter}
                    onExportPdf={handlePDF}
                    onCreate={handleCreate}
                    onDeleteAll={() =>
                        setDeleteAllOpen(true)
                    }
                />

                <div className="flex-1">
                    {loading ? (
                        <StudentsLoading />
                    ) : members.length === 0 ? (
                        <StudentsEmpty
                            onCreate={handleCreate}
                        />
                    ) : (
                        <StudentsTable
    members={members}
    groups={groups}
    onView={handleView}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
                    )}
                </div>
            </div>

            <StudentDetailsDialog
    member={viewingMember}
    groups={groups}
    open={viewingMember !== null}
    onClose={() =>
        setViewingMember(null)
    }
/>

            <StudentFiltersDialog
    open={filterOpen}
    filters={filters}
    groups={groups}
    onClose={() =>
        setFilterOpen(false)
    }
    onApply={(newFilters) => {
        setFilters(newFilters);
        setFilterOpen(false);
    }}
/>

            <CreateStudentDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={loadMembers}
            />

            <EditStudentDialog
                member={editingMember}
                open={editingMember !== null}
                onClose={() =>
                    setEditingMember(null)
                }
                onUpdated={loadMembers}
            />

            <DeleteStudentDialog
                member={deletingMember}
                open={deletingMember !== null}
                onClose={() =>
                    setDeletingMember(null)
                }
                onDeleted={loadMembers}
            />

            <ConfirmDialog
                open={deleteAllOpen}
                variant="danger"
                title="Apagar todos os alunos?"
                description="Todos os alunos cadastrados serão removidos permanentemente."
                confirmText="Apagar"
                cancelText="Cancelar"
                onClose={() =>
                    setDeleteAllOpen(false)
                }
                onConfirm={handleDeleteAll}
            />

            <ExportPdfDialog
                file="Relação_Robótica.pdf"
                open={pdfOpen}
                onClose={() => setPdfOpen(false)}
                onPreparePdf={generateStudentsPDF}
            />
        </>
    );
}