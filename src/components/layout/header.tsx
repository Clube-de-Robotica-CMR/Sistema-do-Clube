import { HomeModule } from "@/lib/home";

interface HeaderProps {
    activeModule: HomeModule;
}

const titles: Record<HomeModule, string> = {
    students: "Alunos",
    groups: "Grupos",
    meetings: "Encontros",
    bonus: "Bônus (GIP)",
    competitions: "Competições",
    ranking: "Ascensão de Nível",
    inventory: "Inventário",
    users: "Usuários",
};

export default function Header({
    activeModule,
}: HeaderProps) {
    return (
        <header className="border-b border-slate-200 bg-white px-10 py-6 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">
                {titles[activeModule]}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
                Sistema de Gestão do Clube de Robótica
            </p>
        </header>
    );
}