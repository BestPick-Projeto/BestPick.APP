import style from "./Dashboard.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdFavorite, MdShoppingBag } from "react-icons/md";
import dashboardAPI from "../../services/dashboardAPI";

export function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        async function carregarDashboard() {

            try {
                const resposta = await dashboardAPI.obterAsync();

                setDashboard(resposta);
            } catch (error) {
                console.error(error);
                setErro("Não foi possível carregar a dashboard.");
            }
            finally {
                setCarregando(false);
            }

        }

        carregarDashboard();

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

    if (erro) {
        return (
            <Sidebar>

                <Topbar titulo="Dashboard" />

                <div className={style.dashboard}>

                    <div className={style.erro}>
                        {erro}
                    </div>

                </div>

            </Sidebar>
        );
    }

    const maiorQuantidade = Math.max(
        ...dashboard.buscasPorMes.map(item => item.quantidade),
        1
    );

    const totalProdutos =
        dashboard.totalFavoritados +
        dashboard.totalAdquiridos;

    const porcentagemFavoritados =
        totalProdutos > 0
            ? (dashboard.totalFavoritados / totalProdutos) * 100
            : 0;

    const porcentagemAdquiridos =
        totalProdutos > 0
            ? (dashboard.totalAdquiridos / totalProdutos) * 100
            : 0;

    return (
        <Sidebar>

            <Topbar titulo="Dashboard" />

            <div className={style.dashboard}>

                <div className={style.cabecalho}>
                    <h1>Visão geral</h1>
                    <p>Acompanhe sua atividade no BestPick.</p>
                </div>

                <div className={style.cards}>

                    <div
                        className={style.card}
                        onClick={() => navigate('/historico')}
                    >

                        <div className={style.cardIcone}>
                            <MdSearch />
                        </div>

                        <div>
                            <p>Buscas realizadas</p>
                            <h2>{dashboard.totalBuscas}</h2>
                        </div>

                    </div>

                    <div
                        className={style.card}
                        onClick={() => navigate('/favoritos')}
                    >

                        <div className={style.cardIcone}>
                            <MdFavorite />
                        </div>

                        <div>
                            <p>Favoritados</p>
                            <h2>{dashboard.totalFavoritados}</h2>
                        </div>

                    </div>

                    <div
                        className={style.card}
                        onClick={() => navigate('/favoritos')}
                    >

                        <div className={style.cardIcone}>
                            <MdShoppingBag />
                        </div>

                        <div>
                            <p>Adquiridos</p>
                            <h2>{dashboard.totalAdquiridos}</h2>
                        </div>

                    </div>

                </div>

                <div className={style.graficos}>

                    <div className={style.graficoCard}>

                        <div className={style.tituloGrafico}>
                            <h2>Atividade de buscas</h2>
                            <p>Quantidade de buscas realizadas por mês</p>
                        </div>

                        {dashboard.buscasPorMes.length > 0 ? (

                            <div className={style.graficoBarras}>

                                {dashboard.buscasPorMes.map((item, index) => (

                                    <div
                                        className={style.coluna}
                                        key={index}
                                    >

                                        <div className={style.valorBarra}>
                                            {item.quantidade}
                                        </div>

                                        <div className={style.areaBarra}>

                                            <div
                                                className={style.barra}
                                                style={{
                                                    height: `${(item.quantidade / maiorQuantidade) * 100}%`
                                                }}
                                            ></div>

                                        </div>

                                        <span className={style.mes}>
                                            {item.mes}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className={style.semDados}>
                                Nenhuma busca realizada ainda.
                            </div>

                        )}

                    </div>

                    <div className={style.graficoCard}>

                        <div className={style.tituloGrafico}>
                            <h2>Produtos salvos</h2>
                            <p>Resumo dos seus produtos</p>
                        </div>

                        <div className={style.resumoProdutos}>

                            <div className={style.itemProduto}>

                                <div className={style.produtoTopo}>
                                    <span>Favoritados</span>
                                    <strong>
                                        {dashboard.totalFavoritados}
                                    </strong>
                                </div>

                                <div className={style.barraFundo}>
                                    <div
                                        className={style.barraProgresso}
                                        style={{
                                            width: `${porcentagemFavoritados}%`
                                        }}
                                    ></div>
                                </div>

                            </div>

                            <div className={style.itemProduto}>

                                <div className={style.produtoTopo}>
                                    <span>Adquiridos</span>
                                    <strong>
                                        {dashboard.totalAdquiridos}
                                    </strong>
                                </div>

                                <div className={style.barraFundo}>
                                    <div
                                        className={style.barraProgresso}
                                        style={{
                                            width: `${porcentagemAdquiridos}%`
                                        }}
                                    ></div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </Sidebar>
    );
}