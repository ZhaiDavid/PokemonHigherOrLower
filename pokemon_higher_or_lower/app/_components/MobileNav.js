// Navigation Bar made using tutorial from blog post https://dev.to/shaikathaque/responsive-navbar-in-react-using-shadcnui-and-tailwind-css-4jc9
//TODO: Fix the navbar to correct structure

"use client";
import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetTitle, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {Menu as MenuIcon} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mobileItems = ['Leaderboard', 'Usage Stats', 'Meta Trends']

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
                        <SheetTitle className="text-white">Menu</SheetTitle>
                        {/* Testing Dropdown Menu*/}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="link" className="text-white font-sans">Game</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link href="/singlePlayer/menu">
                                            Single-player
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Multi-player</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <Link href="/multiplayer/matchmaking">
                                            Find Match
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/multiplayer/form">
                                            Form
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

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

