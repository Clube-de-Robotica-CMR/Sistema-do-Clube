import { Plus } from "lucide-react";

import Button from "@/components/ui/button";

interface GroupsToolbarProps {
    onCreate(): void;
}

export default function GroupsToolbar({
    onCreate,
}: GroupsToolbarProps) {
    return (
        <div className="flex justify-end">
            <Button
                className="h-12 w-auto px-5"
                onClick={onCreate}
            >
                <Plus size={18} />
                <span>Novo grupo</span>
            </Button>
        </div>
    );
}