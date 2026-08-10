import MenuComponent from "./_components/MenuComponent";

import "./page.css"

export default async function Page({ searchParams }) {
    return <MenuComponent searchParams={searchParams} />
}