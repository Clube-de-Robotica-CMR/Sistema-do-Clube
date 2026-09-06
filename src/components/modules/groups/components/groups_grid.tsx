import type {
    GroupWithMembers,
} from "@/core/entities/member.entity";

import GroupCard from "./group_card";

interface GroupsGridProps {
    groups: GroupWithMembers[];

    onView(group: GroupWithMembers): void;
    onEdit(group: GroupWithMembers): void;
    onDelete(group: GroupWithMembers): void;
}

export default function GroupsGrid({
    groups,
    onView,
    onEdit,
    onDelete,
}: GroupsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
                <GroupCard
                    key={group.id}
                    group={group}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}