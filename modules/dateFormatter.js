export function today() {
    const now = new Date()
    const dateFormatter = new Intl.DateTimeFormat("PL", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
    })
    const formattedDate = dateFormatter.format(now)
    return formattedDate
}

// maybe I will add other dates here so the app looks better for now I don't want to do that.