export function formatDuration(seconds: number) {
    let result = seconds >= 3600 ?
        `${Math.floor(seconds / 3600)}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
        : `${Math.floor(seconds / 60) % 60}:${String(seconds % 60).padStart(2, '0')}`
    return result;
}
export function formatTime(seconds: number) {
    let dateObj = new Date(seconds * 1000);
    let result = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} \
${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
    return result;
}
export function formatStatistic(num: number) {
    let result = num > 10000 ? `${Math.floor(num / 1000) / 10}万` : String(num);
    return result;
}