import style from "./Home.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { useState } from "react";
import { MdSend } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

export function Home() {

    const [mensagem, setMensagem] = useState("");
    const token = localStorage.getItem("token");

    let nomeUsuario = "Usuário";

    if (token) {
        const dadosUsuario = jwtDecode(token);

        nomeUsuario =
            dadosUsuario["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            "Usuário";
    }

    function handleEnviar(e) {
        e.preventDefault();

        if (!mensagem.trim())
            return;

        const novaMensagem = {
            tipo: "usuario",
            texto: mensagem
        };

        setMensagem("");
    }

    return (
        <Sidebar>

            <Topbar titulo="Home" />

            <div className={style.home}>

                <div className={style.chat}>

                    <div className={style.apresentacao}>

                        <h1>
                            Olá, {nomeUsuario}!
                        </h1>

                        <p className={style.descricao}>
                            Me conte o produto que você procura. Quanto mais detalhes
                            você fornecer, melhor será a recomendação.
                        </p>

                    </div>

                    <form
                        className={style.areaMensagem}
                        onSubmit={handleEnviar}
                    >

                        <textarea
                            placeholder="Pergunte ao BestPick..."
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            rows="1"
                        />

                        <button
                            type="submit"
                            aria-label="Enviar mensagem"
                        >
                            <MdSend />
                        </button>

                    </form>

                    <p className={style.aviso}>
                        O BestPick pode cometer erros. Confira os detalhes antes de realizar uma compra.
                    </p>

                </div>

            </div>

        </Sidebar>
    );
}