// Navigation Bar made using tutorial from blog post https://dev.to/shaikathaque/responsive-navbar-in-react-using-shadcnui-and-tailwind-css-4jc9

import { Button } from "@/components/ui/button"

const mainNavItems = ['Game', 'Leaderboard', 'Usage Stats', 'Meta Trends']

export default function MainNav() {
    return (
        <>
            <div className="mr-4 hidden gap-2 md:flex">
                {mainNavItems.map((item, index) => (
                    <Button key={index} variant="link" className="text-white font-sans">
                        {item}
                    </Button>
                ))}
            </div>
        </>
    )
}