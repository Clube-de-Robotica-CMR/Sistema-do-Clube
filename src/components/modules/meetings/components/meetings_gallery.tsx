import type { Meeting } from "@/core/entities/meeting.entity";

import MeetingCard from "./meeting_card";

interface MeetingsGalleryProps {
    meetings: Meeting[];

    onOpen(meeting: Meeting): void;

    onDelete(meeting: Meeting): void;
}

export default function MeetingsGallery({
    meetings,
    onOpen,
    onDelete,
}: MeetingsGalleryProps) {
    return (
        <div
            className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
            "
        >
            {meetings.map((meeting) => (
                <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onOpen={onOpen}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}