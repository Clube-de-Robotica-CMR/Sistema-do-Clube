import Card from "@/components/ui/card";

export default function GroupsLoading() {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card
                    key={index}
                    className="p-6"
                >
                    <div className="mb-5 h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-200" />

                    <div className="mt-6 h-4 w-24 animate-pulse rounded bg-slate-200" />
                </Card>
            ))}
        </div>
    );
}