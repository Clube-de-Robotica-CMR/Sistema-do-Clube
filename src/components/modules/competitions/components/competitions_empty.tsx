import { Trophy } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface CompetitionsEmptyProps {
    onCreate(): void;
}

export default function CompetitionsEmpty({
    onCreate,
}: CompetitionsEmptyProps) {
    return (
        <Card className="rounded-3xl py-20">
            <div
                className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                "
            >
                <div
                    className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-violet-100
                        text-violet-600
                    "
                >
                    <Trophy size={36} />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                    Nenhuma competição encontrada
                </h2>

                <p className="mt-3 max-w-md text-slate-500">
                    Crie a primeira competição para começar a registrar os
                    resultados e acompanhar o desempenho dos alunos.
                </p>

                <Button
                    className="mt-8"
                    onClick={onCreate}
                >
                    Criar competição
                </Button>
            </div>
        </Card>
    );
}