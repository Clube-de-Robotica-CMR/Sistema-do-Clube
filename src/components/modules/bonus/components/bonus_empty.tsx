import Card from "@/components/ui/card";

export default function BonusEmpty() {
    return (
        <Card className="flex h-80 items-center justify-center rounded-3xl">
            <div className="text-center">
                <h2 className="text-xl font-semibold">
                    Nenhum resultado encontrado
                </h2>

                <p className="mt-2 text-slate-500">
                    Tente alterar a pesquisa ou o trimestre selecionado.
                </p>
            </div>
        </Card>
    );
}