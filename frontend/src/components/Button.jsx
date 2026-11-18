const Button = ({ children, ...buttonProps }) => {
    return (
        <button
            {...buttonProps}
            className="w-full rounded-lg bg-pink-600 py-2 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
        >
            {children}
        </button>
    );
};

export default Button;
