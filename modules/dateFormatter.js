export function getFormattedDate() {

    const date = new Date()

    return {
        year: date.getFullYear(),
        month: date.toLocaleString('en-US', { month: 'short' }),
        day: String(date.getDate()).padStart(2, '0'),
        hour: String(date.getHours()).padStart(2, '0'),
        minutes: String(date.getMinutes()).padStart(2, '0')
    }


}