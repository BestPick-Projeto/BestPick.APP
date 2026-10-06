import style from "./Favorito.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { CardFavorito } from "../../components/CardFavorito/CardFavorito";
import { useEffect, useState } from "react";
import favoritoAPI from "../../services/favoritoAPI";

export function Favorito() {

    const [favoritos, setFavoritos] = useState([]);
    const [aba, setAba] = useState("Favoritado");
    const [carregando, setCarregando] = useState(true);

    async function carregarFavoritos() {
        try {
            setFavoritos(await favoritoAPI.listarAsync());
        } catch {
            setFavoritos([]);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarFavoritos();
    }, []);

    async function alterarStatus(favorito) {
        await favoritoAPI.atualizarStatusAsync(
            favorito.id,
            aba === "Favoritado" ? 2 : 1
        );

        carregarFavoritos();
    }
    async function remover(id) {
        await favoritoAPI.removerAsync(id);

        setFavoritos(atuais =>
            atuais.filter(favorito =>
                favorito.id !== id
            )
        );
    }

    const produtos = favoritos.filter(
        favorito => favorito.status === aba
    );

    return (
        <Sidebar>

            <Topbar titulo="Favoritos" />

            <div className={style.pagina}>

                <div className={style.cabecalho}>

                    <div>
                        <h1>Meus produtos</h1>
                        <p>
                            Acompanhe seus produtos favoritos e adquiridos.
                        </p>
                    </div>

                    <div className={style.abas}>

                        <button
                            className={
                                aba === "Favoritado"
                                    ? style.ativa
                                    : ""
                            }
                            onClick={() =>
                                setAba("Favoritado")
                            }
                        >
                            Favoritos
                        </button>

                        <button
                            className={
                                aba === "Adquirido"
                                    ? style.ativa
                                    : ""
                            }
                            onClick={() =>
                                setAba("Adquirido")
                            }
                        >
                            Adquiridos
                        </button>

                    </div>

                </div>

                {carregando ? (
                    <p className={style.vazio}>
                        Carregando...
                    </p>
                ) : produtos.length === 0 ? (
                    <p className={style.vazio}>
                        Nenhum produto nesta categoria.
                    </p>
                ) : (
                    <div className={style.produtos}>

                        {produtos.map(favorito => (
                            <CardFavorito
                                key={favorito.id}
                                favorito={favorito}
                                adquirido={aba === "Adquirido"}
                                onAlterarStatus={alterarStatus}
                                onRemover={remover}
                            />
                        ))}

                    </div>
                )}

            </div>

        </Sidebar>
    );
}