import style from './SidebarItem.module.css';
import { NavLink } from 'react-router-dom';

export function SidebarItem({ texto, link, logo, retraida }) {
    return (
        <NavLink to={link} title={retraida ? texto : ""}
            className={({ isActive }) =>
                `${style.sidebar_item} 
                ${isActive ? style.ativo : ''}`}>
            {logo}
            {!retraida && <h3 className={style.texto_link}>{texto}</h3>}
        </NavLink>
    );
}