"use client";
import { X, Users, FileText, Calendar, AlertTriangle, User, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const Sidebar = (props: { currentUser: { name: string; email: string; } }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser } = props;

    return (
        <div>
            <div
                className={`overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            {!sidebarOpen && <button
                onClick={() => setSidebarOpen(true)}
                className="menu-btn"
            >
                <Menu className="icon-sm" />
            </button>}

            <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-title">Nexus</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-close-btn"
                    >
                        <X className="icon-sm" />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <a href="#" className="nav-item nav-item-active">
                            <Users className="nav-icon" />
                            Dashboard
                        </a>
                        <a href="#" className="nav-item">
                            <FileText className="nav-icon" />
                            Observations
                        </a>
                        <a href="#" className="nav-item">
                            <Calendar className="nav-icon" />
                            Feedback
                        </a>
                        <a href="#" className="nav-item">
                            <AlertTriangle className="nav-icon" />
                            Notices
                        </a>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <User className="icon-sm" />
                        </div>
                        <div className="user-info">
                            <p className="user-name">{currentUser.name}</p>
                            <p className="user-email">{currentUser.email}</p>
                        </div>
                    </div>
                    <div className="footer-actions">
                        <button className="footer-btn">
                            <Settings className="icon-xs" />
                            Settings
                        </button>
                        <button className="footer-btn">
                            <LogOut className="icon-xs" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
