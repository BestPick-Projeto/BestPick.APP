import { useState } from 'react';
import style from './Sidebar.module.css';
import logoPreta from "../../assets/ImagemSide.png";
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { MdDashboard, MdFavorite, MdHistory, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';

export function Sidebar({ children }) {
    const [retraida, setRetraida] = useState(
        () => localStorage.getItem("sidebarRetraida") === "true"
    );

    function alternarSidebar() {
        const novoEstado = !retraida;
        setRetraida(novoEstado);
        localStorage.setItem("sidebarRetraida", novoEstado);
    }
    return (
        <div
            className={style.layout}
        >
            <div className={style.sidebar_conteudo}>
                <div className={style.sidebar_header}>
                    <Link to="/dashboard">
                        <img src={logoPreta} alt="Logo BestPick" className={style.logo} />
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