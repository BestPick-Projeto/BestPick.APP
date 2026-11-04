import { useState } from 'react';
import style from './Sidebar.module.css';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { MdDashboard, MdFavorite, MdHistory } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import { Link } from 'react-router-dom';

export function Sidebar({ children }) {
    const [retraida] = useState(
        () => localStorage.getItem("sidebarRetraida") === "true"
    );

    return (
        <div
            className={style.layout}
        >
            <div className={style.sidebar_conteudo}>
                <div className={style.sidebar_header}>
                    <Link to="/dashboard">
                        <span className={style.logo}>Best<span>Pick</span></span>
                    </Link>
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Dashboard" link="/dashboard" logo={<MdDashboard />} retraida={retraida} />

                    <SidebarItem texto="Favoritos" link="/favoritos" logo={<MdFavorite />} retraida={retraida} />

                    <SidebarItem texto="Chat" link="/chat" logo={<IoChatboxEllipses />} retraida={retraida} />

                    <SidebarItem texto="Histórico" link="/historico" logo={<MdHistory />} retraida={retraida} />
                </div>

            </div>

            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    );
}
