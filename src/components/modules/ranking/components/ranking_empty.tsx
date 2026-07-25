import { Trophy } from "lucide-react";

import Card from "@/components/ui/card";

export default function RankingEmpty() {
    return (
        <Card className="flex flex-col items-center justify-center rounded-3xl py-20">
            <div className="rounded-full bg-violet-100 p-5">
                <Trophy
                    size={34}
                    className="text-violet-600"
                />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
                Nenhum aluno pontuado
            </h2>

            <p className="mt-2 max-w-md text-center text-slate-500">
                O ranking será preenchido
                automaticamente conforme os
                resultados das competições
                forem cadastrados.
            </p>
        </Card>
    );
}