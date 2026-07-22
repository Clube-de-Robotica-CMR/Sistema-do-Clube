import { Users } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface StudentsEmptyProps {
    onCreate(): void;
}

export default function StudentsEmpty({
    onCreate,
}: StudentsEmptyProps) {
    return (
        <Card className="flex flex-col items-center justify-center py-24">
            <div className="mb-6 rounded-full bg-violet-100 p-5">
                <Users
                    size={42}
                    className="text-violet-700"
                />
            </div>

            <h2 className="text-2xl font-bold">
                Nenhum aluno encontrado
            </h2>

            <p className="mt-3 max-w-md text-center text-slate-500">
                Ainda não existe nenhum aluno cadastrado
                ou nenhum aluno corresponde aos filtros
                informados.
            </p>

            <Button
                className="mt-8 w-auto px-8"
                onClick={onCreate}
            >
                Novo aluno
            </Button>
        </Card>
    );
}