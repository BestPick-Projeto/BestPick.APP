import style from './SidebarItem.module.css';
import { NavLink } from 'react-router-dom';

export function SidebarItem({ texto, link, logo }) {
    return (
        <NavLink
            to={link}
            aria-label={texto}
            title={texto}
            className={({ isActive }) =>
                `${style.sidebar_item} ${isActive ? style.ativo : ''}`
            }
        >
            {logo}
            <h3 className={style.texto_link}>{texto}</h3>
        </NavLink>
    );
}
