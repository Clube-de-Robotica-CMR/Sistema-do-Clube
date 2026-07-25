import { Lock, Pencil, Trash2 } from "lucide-react";

import type { User } from "@/core/entities/user.entity";

interface UserRowProps {
    user: User;

    onEdit(user: User): void;

    onDelete(user: User): void;
}

export default function UserRow({
    user,
    onEdit,
    onDelete,
}: UserRowProps) {
    const isAdmin = user.role === "admin";

    return (
        <tr className="border-b transition-colors hover:bg-violet-50/40">
            <td className="px-6 py-4 font-medium">
                {user.name}
            </td>

            <td className="px-6 py-4">
                <span
                    className={
                        isAdmin
                            ? "rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700"
                            : "rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                    }
                >
                    {isAdmin ? "Administrador" : "Diretoria"}
                </span>
            </td>

            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    {isAdmin ? (
                        <>
                            <button
                                disabled
                                className="rounded-xl p-2 text-slate-300 cursor-not-allowed"
                            >
                                <Lock size={18} />
                            </button>

                            <button
                                disabled
                                className="rounded-xl p-2 text-slate-300 cursor-not-allowed"
                            >
                                <Lock size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onEdit(user)}
                                className="
                                    rounded-xl
                                    p-2
                                    text-slate-500
                                    transition
                                    hover:bg-violet-100
                                    hover:text-violet-700
                                    cursor-pointer
                                "
                            >
                                <Pencil size={18} />
                            </button>

                            <button
                                onClick={() => onDelete(user)}
                                className="
                                    rounded-xl
                                    p-2
                                    text-slate-500
                                    transition
                                    hover:bg-red-100
                                    hover:text-red-600
                                    cursor-pointer
                                "
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}