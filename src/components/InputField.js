import React from 'react';

function InputField({
                        id,
                        label,
                        type = 'text',
                        value,
                        onChange,
                        onBlur,
                        error,
                        placeholder = '',
                        buttonText,
                        onButtonClick,
                        buttonVisible = false,
                        successMessage,
                    }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
                {label}
            </label>
            <div className="mt-2 flex gap-2">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                        error ? 'ring-red-500' : 'ring-gray-300'
                    } ${successMessage ? 'ring-green-500' : 'ring-gray-300'} 
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-400 sm:text-sm/6`}
                />
                {buttonVisible && (
                    <button
                        type="button"
                        onClick={onButtonClick}
                        className="w-1/3 rounded-md bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    >
                        {buttonText}
                    </button>
                )}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {successMessage && (
                <p className="p-2 mb-4 text-sm text-green-600">
                    {successMessage}
                </p>
            )}
        </div>
    );
}

export default InputField;
