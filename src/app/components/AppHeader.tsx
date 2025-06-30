import Link from "next/link";

const AppHeader = () => {
    return (
        <header className="app-header">
            <div className="app-header-content">
                <div className="app-header-left" style={{ height: "60px" }}>
                    <Link href={"/"} style={{ textDecoration: "none", color: "inherit" }}>
                        <h2 className="app-page-title">Nexus</h2>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default AppHeader;