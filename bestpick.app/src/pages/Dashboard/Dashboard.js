import style from "./Dashboard.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdFavorite, MdShoppingBag, MdHistory } from "react-icons/md";
import dashboardAPI from "../../services/dashboardAPI";

export function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        dashboardAPI.obterAsync()
            .then(setDashboard)
            .catch(error => console.error("Erro ao carregar dashboard:", error))
            .finally(() => setCarregando(false));
    }, []);

    if (carregando) {
        return (
            <Sidebar>
                <Topbar titulo="Dashboard" />
                <div className={style.dashboard}>
                    <div className={style.carregando}>
                        <div className={style.loader}></div>
                        <p>Carregando dashboard...</p>
                    </div>
                </div>
            </Sidebar>
        );
    }

    return (
        <Sidebar>
            <Topbar titulo="Dashboard" />

            <div className={style.dashboard}>

                <div className={style.cabecalho}>
                    <h1>Visão geral</h1>
                    <p>Acompanhe sua atividade no BestPick.</p>
                </div>

                <div className={style.cards}>

                    <div className={style.card} onClick={() => navigate("/historico")}>
                        <div className={style.icone}>
                            <MdSearch />
                        </div>

                        <div>
                            <p>Buscas realizadas</p>
                            <h2>{dashboard?.totalBuscas ?? 0}</h2>
                        </div>
                    </div>

                    <div className={style.card} onClick={() => navigate("/favoritos")}>
                        <div className={style.icone}>
                            <MdFavorite />
                        </div>

                        <div>
                            <p>Favoritados</p>
                            <h2>{dashboard?.totalFavoritados ?? 0}</h2>
                        </div>
                    </div>

                    <div className={style.card} onClick={() => navigate("/favoritos")}>
                        <div className={style.icone}>
                            <MdShoppingBag />
                        </div>

                        <div>
                            <p>Adquiridos</p>
                            <h2>{dashboard?.totalAdquiridos ?? 0}</h2>
                        </div>
                    </div>

                </div>

                <div className={style.resumo} onClick={() => navigate("/historico")}>

                    <div className={style.resumoIcone}>
                        <MdHistory />
                    </div>

                    <div className={style.resumoTexto}>
                        <h2>Histórico de buscas</h2>
                        <p>
                            Consulte os produtos que você já pesquisou e as
                            recomendações recebidas.
                        </p>
                    </div>

                    <span>Ver histórico →</span>

                </div>

                <div className={style.distribuicao}>

                    <div className={style.distribuicaoTitulo}>
                        <h2>Distribuição da atividade</h2>
                        <p>Resumo das suas interações no BestPick.</p>
                    </div>

                    <div className={style.porcentagens}>

                        <div className={style.porcentagem}>
                            <span>Buscas</span>
                            <strong>
                                {Math.round(dashboard?.porcentagemBuscas ?? 0)}%
                            </strong>
                        </div>

                        <div className={style.porcentagem}>
                            <span>Adquiridos</span>
                            <strong>
                                {Math.round(dashboard?.porcentagemAdquiridos ?? 0)}%
                            </strong>
                        </div>

                        <div className={style.porcentagem}>
                            <span>Favoritados</span>
                            <strong>
                                {Math.round(dashboard?.porcentagemFavoritados ?? 0)}%
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </Sidebar>
    );
}