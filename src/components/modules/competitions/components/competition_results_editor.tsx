import type {
    CompetitionResult,
} from "@/core/entities/competition.entity";

import PodiumSection from "./podium_section";

interface CompetitionResultsEditorProps {
    results: CompetitionResult[];

    onChange(
        results: CompetitionResult[]
    ): void;
}

export default function CompetitionResultsEditor({
    results,
    onChange,
}: CompetitionResultsEditorProps) {
    function updatePlacement(
        placement: "1°" | "2°" | "3°",
        placementResults: CompetitionResult[]
    ) {
        const others = results.filter(
            (result) =>
                result.placement !==
                placement
        );

        onChange([
            ...others,
            ...placementResults,
        ]);
    }

    return (
        <div className="max-h-[40vh] space-y-3 overflow-y-auto pr-2">
            <PodiumSection
                title="1°"
                results={results.filter(
                    (result) =>
                        result.placement ===
                        "1°"
                )}
                onChange={(value) =>
                    updatePlacement(
                        "1°",
                        value
                    )
                }
            />

            <PodiumSection
                title="2°"
                results={results.filter(
                    (result) =>
                        result.placement ===
                        "2°"
                )}
                onChange={(value) =>
                    updatePlacement(
                        "2°",
                        value
                    )
                }
            />

            <PodiumSection
                title="3°"
                results={results.filter(
                    (result) =>
                        result.placement ===
                        "3°"
                )}
                onChange={(value) =>
                    updatePlacement(
                        "3°",
                        value
                    )
                }
            />
        </div>
    );
}