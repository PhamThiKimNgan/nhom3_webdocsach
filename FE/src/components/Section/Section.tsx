import React from 'react'
import './Section.scss'
const Section = (props:{children:React.ReactNode}) => {
    return (
        <div className="section">
            {props.children}
        </div>
    )
}

export const SectionHeading = (props:{children:React.ReactNode}) => {
    return (
        <div className="section__heading">
            {props.children}
        </div>
    )
}

export const SectionBody = (props:{children:React.ReactNode}) => {
    return (
        <div className="section__body">
            {props.children}
        </div>
    )
}

export default Section