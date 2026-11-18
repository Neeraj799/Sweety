const FormInput = ({ label, ...inputProps }) => {
    return (
        <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <input
                {...inputProps}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
        </label>
    );
};

export default FormInput;
