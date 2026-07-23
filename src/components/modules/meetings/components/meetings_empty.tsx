import Button from "@/components/ui/button";

interface MeetingsEmptyProps {
    onCreate(): void;
}

export default function MeetingsEmpty({
    onCreate,
}: MeetingsEmptyProps) {
    return (
        <div
            className="
                flex
                h-80
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
            "
        >
            <h2 className="text-xl font-semibold">
                Nenhum encontro encontrado
            </h2>

            <p className="mt-2 text-slate-500">
                Crie o primeiro encontro do clube.
            </p>

            <Button
                className="mt-6"
                onClick={onCreate}
            >
                Novo encontro
            </Button>
        </div>
    );
}