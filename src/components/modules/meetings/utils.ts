export function formatMeetingDate(
    date: Date | string
) {
    return new Date(date).toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}
