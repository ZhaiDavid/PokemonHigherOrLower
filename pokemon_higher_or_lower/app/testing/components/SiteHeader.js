// Navigation Bar made using tutorial from blog post https://dev.to/shaikathaque/responsive-navbar-in-react-using-shadcnui-and-tailwind-css-4jc9

import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

import "./SiteHeader.css"

export default function SiteHeader() {
    return (
        <header className="header w-full">
            <div className="flex h-14 items-center px-4 bg-[#56579A]">
                <MainNav />
                <MobileNav />
            </div>
        </header>
    )
}