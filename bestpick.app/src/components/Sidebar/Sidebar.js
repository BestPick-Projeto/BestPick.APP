import style from './Sidebar.module.css';
import logoPreta from "../../assets/imagemLogo.png"
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { MdHome, MdDashboard, MdFavorite, MdHistory } from "react-icons/md";
import { Link } from 'react-router-dom';

export function Sidebar({ children }) {
    return (
        <div>
            <div className={style.sidebar_conteudo}>

                <div className={style.sidebar_header}>
                    <Link to='/home'>
                        <img src={logoPreta} alt="Logo BestPick" className={style.logo} />
                    </Link>

                    <hr className={style.linha} />
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Home" link="/home" logo={<MdHome />} />
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Dashboard" link="/dashboard" logo={<MdDashboard />} />
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Favoritos" link="/favoritos" logo={<MdFavorite />} />
                </div>

                <div className={style.sidebar_corpo}>
                    <SidebarItem texto="Histórico" link="/historico" logo={<MdHistory />} />
                </div>

            </div>

            <div className={style.pagina_conteudo}>
                {children}
            </div>
        </div>
    )
}