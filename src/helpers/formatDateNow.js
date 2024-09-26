
export const formatDateNow = (date) => {
    const currentDate = new Date(date);
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Місяці в JavaScript індексуються з 0
    const year = currentDate.getFullYear();

    const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;

    return formattedDate;
}