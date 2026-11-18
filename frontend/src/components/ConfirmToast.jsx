const ConfirmToast = ({ message, onConfirm, closeToast }) => {
    const handleConfirm = () => {
        closeToast();
        onConfirm();
    };

    return (
        <div>
            <p className="mb-3 text-gray-800">{message}</p>

            <div className="flex gap-2">
                <button
                    onClick={handleConfirm}
                    className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                    Delete
                </button>
                <button
                    onClick={closeToast}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmToast;
