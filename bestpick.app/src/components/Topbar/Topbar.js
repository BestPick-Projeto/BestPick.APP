import style from "./Topbar.module.css";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

export function Topbar({ titulo }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className={style.topbar_conteudo}>
            <h2>{titulo}</h2>

            <button
                onClick={handleLogout}
                className={style.botao_deslogar}
                aria-label="Sair"
            >
                <MdLogout />
            </button>
        </div>
    );
}