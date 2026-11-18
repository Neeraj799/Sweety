const FormSelect = ({ label, options, ...selectProps }) => {
    return (
        <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <select
                {...selectProps}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default FormSelect;
