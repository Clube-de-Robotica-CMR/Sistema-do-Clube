import { Plus } from "lucide-react";

import { cn } from "@/lib/cn";

interface UsersToolbarProps {
    onCreate(): void;
}

export default function UsersToolbar({
    onCreate,
}: UsersToolbarProps) {
    return (
        <div className="flex justify-start">
            <button
                onClick={onCreate}
                className={cn(
                    "flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white transition",
                    "hover:border-violet-300 hover:bg-violet-50"
                )}
            >
                <Plus size={20} />
            </button>
        </div>
    );
}