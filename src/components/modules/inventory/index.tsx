import { useEffect, useState } from "react";

import type {
    InventoryFilter,
    InventoryItem,
} from "@/core/entities/inventory.entity";

import { findInventoryItems } from "./services";

import InventoryToolbar from "./components/inventory_toolbar";
import InventoryTable from "./components/inventory_table";
import InventoryLoading from "./components/inventory_loading";
import InventoryEmpty from "./components/inventory_empty";

import CreateInventoryItemDialog from "./components/create_item_dialog";
import EditItemDialog from "./components/edit_item_dialog";
import DeleteItemDialog from "./components/delete_item_dialog";
import InventoryFiltersDialog from "./components/inventory_filters_dialog";

export default function InventoryModule() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState<InventoryFilter>({});

    const [filterOpen, setFilterOpen] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);

    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

    const hasFilters =
        Boolean(search) ||
        Object.values(filters).some(
            (value) =>
                value !== undefined &&
                value !== ""
        );

    async function loadItems(
        searchValue?: string,
        filterValue?: InventoryFilter
    ) {
        try {
            setLoading(true);

            const response = await findInventoryItems({
                ...(filterValue ?? filters),
                search: searchValue ?? search,
            });

            setItems(response);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadItems();
        }, 250);

        return () => clearTimeout(timeout);
    }, [search, filters]);

    function handleFilter() {
        setFilterOpen(true);
    }

    function handleCreate() {
        setCreateOpen(true);
    }

    function handleEdit(item: InventoryItem) {
        setEditingItem(item);
    }

    function handleDelete(item: InventoryItem) {
        setDeletingItem(item);
    }

    return (
        <>
            <div className="flex h-full flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold">
                        Inventário
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Gerencie todos os itens do Clube de Robótica.
                    </p>
                </header>

                <InventoryToolbar
                    search={search}
                    filtersApplied={hasFilters}
                    onSearch={setSearch}
                    onFilter={handleFilter}
                    onCreate={handleCreate}
                />

                <div className="flex-1">
                    {loading ? (
                        <InventoryLoading />
                    ) : items.length === 0 ? (
                        <InventoryEmpty
                            hasFilters={hasFilters}
                        />
                    ) : (
                        <InventoryTable
                            items={items}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            <InventoryFiltersDialog
                open={filterOpen}
                filters={filters}
                onClose={() => setFilterOpen(false)}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                    setFilterOpen(false);
                }}
            />

            <CreateInventoryItemDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={loadItems}
            />

            <EditItemDialog
                item={editingItem}
                open={editingItem !== null}
                onClose={() => setEditingItem(null)}
                onUpdated={loadItems}
            />

            <DeleteItemDialog
                item={deletingItem}
                open={deletingItem !== null}
                onClose={() => setDeletingItem(null)}
                onDeleted={loadItems}
            />
        </>
    );
}