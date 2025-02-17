import React from "react";

const InputWithBorder=({type,label, value, onChange}:{type: string, label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void})=>{
    const name = label.toLowerCase().replace(' ', '_');
    const id = label.replace(' ', '_');
    return(
        <div className={`col-span-6 `}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        </label>

        <input
    type={type}
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    className="mt-1 p-2 w-full  rounded-md border-2 border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
        />
        </div>)
}

export default InputWithBorder;