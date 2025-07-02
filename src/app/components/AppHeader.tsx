"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const BackBtn = dynamic(() => import("./BackBtn"), { ssr: false });

const AppHeader = () => {

    return (
        <header className="app-header">
            <div className="app-header-content">
                <div className="app-header-left" style={{ width: "100vw", display: "flex", justifyContent: "space-between", height: "60px" }}>
                    <div>
                        <Link href={"/"} style={{ textDecoration: "none", color: "inherit" }}>
                            <h2 className="app-page-title">Nexus</h2>
                        </Link>
                    </div>
                    <div style={{ paddingRight: "30px" }}>
                        <BackBtn />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AppHeader;