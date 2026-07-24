import Card from "@/components/ui/card";

export default function CompetitionsLoading() {
    return (
        <div
            className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
            "
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <Card
                    key={index}
                    className="animate-pulse rounded-3xl p-6"
                >
                    <div className="h-6 w-2/3 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
                </Card>
            ))}
        </div>
    );
}