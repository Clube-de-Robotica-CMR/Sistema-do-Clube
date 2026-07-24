import { Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import type {
    Placement,
    CompetitionResult,
} from "@/core/entities/competition.entity";
import { placementMedal } from "../utils";

interface PodiumSectionProps {
    title: Placement;
    results: CompetitionResult[];
    onChange(results: CompetitionResult[]): void;
}

export default function PodiumSection({
    title,
    results,
    onChange,
}: PodiumSectionProps) {
    function update(
        index: number,
        field: "member_war_name" | "member_number",
        value: string
    ) {
        const copy = [...results];
        copy[index] = {
            ...copy[index],
            [field]: value,
        };
        onChange(copy);
    }

    function add() {
        onChange([
            ...results,
            {
                id: crypto.randomUUID(),
                competition_id: "",
                placement: title,
                member_number: "",
                member_war_name: "",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    }

    function remove(index: number) {
        const copy = [...results];
        copy.splice(index, 1);
        onChange(copy);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    {placementMedal(title)} {title} Lugar
                </h3>

                {/* Ajustado botão do topo para quadrado perfeito também */}
                <Button
                    type="button"
                    variant="secondary"
                    className="h-10 w-10 p-0 flex items-center justify-center rounded-xl"
                    onClick={add}
                >
                    <Plus size={18} />
                </Button>
            </div>

            {results.map((result, index) => (
                <div
                    key={result.id}
                    className="flex items-center gap-3 w-full"
                >
                    <div className="flex-1">
                        <Input
                            placeholder="Nome de guerra"
                            value={result.member_war_name}
                            onChange={(event) =>
                                update(index, "member_war_name", event.target.value)
                            }
                        />
                    </div>

                    <div className="w-32">
                        <Input
                            placeholder="Número"
                            value={result.member_number}
                            onChange={(event) =>
                                update(index, "member_number", event.target.value)
                            }
                        />
                    </div>

                    {/* Botão de Deletar Totalmente Ajustado */}
                    <Button
                        type="button"
                        variant="danger"
                        onClick={() => remove(index)}
                        className="h-12 w-12 p-0 shrink-0 flex items-center justify-center rounded-xl transition-colors"
                    >
                        <Trash2 size={20} />
                    </Button>
                </div>
            ))}
        </div>
    );
}
