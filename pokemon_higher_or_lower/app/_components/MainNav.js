// Navigation Bar made using tutorial from blog post https://dev.to/shaikathaque/responsive-navbar-in-react-using-shadcnui-and-tailwind-css-4jc9
//TODO: Fix the navbar to correct structure

import { Button } from "@/components/ui/button";
import Link from "next/link";
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


const mainNavItems = ['Leaderboard', 'Usage Stats', 'Meta Trends']

export default function MainNav() {
    return (
        <>
            <div className="mr-4 hidden gap-2 md:flex">
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

                {mainNavItems.map((item, index) => (
                    <Button key={index} variant="link" className="text-white font-sans">
                        {item}
                    </Button>
                ))}
            </div>
        </>
    )
}