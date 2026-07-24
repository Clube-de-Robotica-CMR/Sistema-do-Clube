import type { Competition } from "@/core/entities/competition.entity";

import CompetitionCard from "./competition_card";

interface CompetitionsGalleryProps {
    competitions: Competition[];

    onOpen(
        competition: Competition
    ): void;

    onDelete(
        competition: Competition
    ): void;
}

export default function CompetitionsGallery({
    competitions,
    onOpen,
    onDelete,
}: CompetitionsGalleryProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {competitions.map(
                (competition) => (
                    <CompetitionCard
                        key={competition.id}
                        competition={
                            competition
                        }
                        onOpen={() =>
                            onOpen(
                                competition
                            )
                        }
                        onDelete={() =>
                            onDelete(
                                competition
                            )
                        }
                    />
                )
            )}
        </div>
    );
}