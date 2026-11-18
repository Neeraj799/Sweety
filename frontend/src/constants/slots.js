export const SLOTS = [
    { value: 'morning_fasting', label: 'Morning (fasting)' },
    { value: 'after_breakfast', label: 'After breakfast' },
    { value: 'after_lunch', label: 'After lunch' },
    { value: 'after_dinner', label: 'After dinner' },
];

export const getSlotLabel = (value) => SLOTS.find((slot) => slot.value === value)?.label;
