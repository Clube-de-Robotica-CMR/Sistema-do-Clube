import { UsersRound } from "lucide-react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface GroupsEmptyProps {
    onCreate(): void;
}

export default function GroupsEmpty({
    onCreate,
}: GroupsEmptyProps) {
    return (
        <Card className="flex flex-col items-center justify-center py-24">
            <div className="mb-6 rounded-full bg-violet-100 p-5">
                <UsersRound
                    size={42}
                    className="text-violet-700"
                />
            </div>

            <h2 className="text-2xl font-bold">
                Nenhum grupo cadastrado
            </h2>

            <p className="mt-3 max-w-md text-center text-slate-500">
                Crie grupos para organizar os membros
                do Clube de Robótica.
            </p>

            <Button
                className="mt-8 w-auto px-8"
                onClick={onCreate}
            >
                Novo grupo
            </Button>
        </Card>
    );
}