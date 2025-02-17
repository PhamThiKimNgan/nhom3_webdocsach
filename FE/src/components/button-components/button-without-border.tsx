import React from "react";

const ButtonWithoutBorder = ({content}:{content:string})=>{
    return(
            <button
                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            >
                {content}
            </button>
    )
}

export default ButtonWithoutBorder;