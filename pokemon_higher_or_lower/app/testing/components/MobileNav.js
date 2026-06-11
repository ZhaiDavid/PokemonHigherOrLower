// Navigation Bar made using tutorial from blog post https://dev.to/shaikathaque/responsive-navbar-in-react-using-shadcnui-and-tailwind-css-4jc9

"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {Menu as MenuIcon} from "lucide-react"

const mobileItems = ['Game', 'Leaderboard', 'Usage Stats', 'Meta Trends']

export default function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden text-white">
                        <MenuIcon />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="text-white">
                    <div className="flex flex-col items-start bg-[#56579A] h-full">
                        {mobileItems.map((item, index) => (
                            <Button key={index} variant="link" className="text-white font-sans" onClick={() => {
                                setOpen(false);
                            }}>
                                {item}
                            </Button>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

