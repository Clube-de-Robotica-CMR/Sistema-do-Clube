import { Users } from "lucide-react";

import Card from "@/components/ui/card";

export default function UsersEmpty() {
    return (
        <Card className="flex flex-col items-center justify-center rounded-3xl py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Users
                    size={32}
                    className="text-slate-500"
                />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
                Nenhum usuário encontrado
            </h3>

            <p className="mt-2 max-w-md text-slate-500">
                Cadastre um novo usuário para permitir
                acesso ao sistema.
            </p>
        </Card>
    );
}