export const getToday = () => new Date().toLocaleDateString('en-CA');

export const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
