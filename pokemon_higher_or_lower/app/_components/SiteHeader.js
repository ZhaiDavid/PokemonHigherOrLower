// Navigation Bar made using tutorial from blog post https://dev.to/shaikathaque/responsive-navbar-in-react-using-shadcnui-and-tailwind-css-4jc9
"use client";
import { useState } from "react";

import { usePathname } from "next/navigation";

import MainNav from "./MainNav";
import MobileNav from "./MobileNav";

import "./SiteHeader.css"

export default function SiteHeader() {
    const pathName = usePathname()

    return (
        <header className="header w-full">
            <div className="flex h-14 items-center justify-between px-4 bg-[#56579A]">
                <div>
                    <MainNav />
                    <MobileNav />
                </div>
                <h1 className="flex items-center text-white font-bold">{pathName}</h1>
            </div>
        </header>
    )
}