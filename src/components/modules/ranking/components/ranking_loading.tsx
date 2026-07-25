import Card from "@/components/ui/card";

export default function RankingLoading() {
    return (
        <Card className="rounded-3xl p-0 overflow-hidden">
            <div className="animate-pulse">
                {Array.from({ length: 8 }).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-slate-100
                                px-6
                                py-5
                            "
                        >
                            <div className="h-4 w-10 rounded bg-slate-200" />

                            <div className="h-4 w-48 rounded bg-slate-200" />

                            <div className="h-4 w-20 rounded bg-slate-200" />

                            <div className="h-8 w-28 rounded-full bg-slate-200" />
                        </div>
                    )
                )}
            </div>
        </Card>
    );
}