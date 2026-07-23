export default function MeetingsLoading() {
    return (
        <div
            className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
            "
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="
                        h-36
                        animate-pulse
                        rounded-3xl
                        bg-slate-200
                    "
                />
            ))}
        </div>
    );
}