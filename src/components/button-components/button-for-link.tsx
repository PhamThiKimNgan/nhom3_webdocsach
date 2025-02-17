import Link from "next/link";

const ButtonForLink = ({content, href}:{content:string, href:string})=>{
    return(
            <Link href={href}
                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            >
                {content}
            </Link>
    )
}
export {ButtonForLink}; 