import type {
    User,
} from "@/core/entities/user.entity";

import CreateUserDialog from "./create_user_dialog";
import EditUserDialog from "./edit_user_dialog";

interface UserFormDialogProps {
    open: boolean;

    mode: "create" | "edit";

    user?: User;

    onClose(): void;

    onSaved(): void;
}

export default function UserFormDialog({
    open,
    mode,
    user,
    onClose,
    onSaved,
}: UserFormDialogProps) {
    if (mode === "create") {
        return (
            <CreateUserDialog
                open={open}
                onClose={onClose}
                onCreated={onSaved}
            />
        );
    }

    if (!user) return null;

    return (
        <EditUserDialog
            open={open}
            user={user}
            onClose={onClose}
            onUpdated={onSaved}
        />
    );
}