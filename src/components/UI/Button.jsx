import React from 'react'

const Button = ({text, onClick, disabled}) => {
    return (
        <>
            <button
                type="submit"
                onClick={onClick}
                disabled={disabled}
                className="flex-none rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                {text}
            </button>
        </>
    )
}

export default Button
