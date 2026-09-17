import style from "./Historico.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { useEffect, useState } from "react";
import { MdVisibility, MdDelete, MdHistory } from "react-icons/md";
import historicoAPI from "../../services/historicoAPI";

export function Historico() {

    const [historicos, setHistoricos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {

        carregarHistoricos();

    }, []);

    const carregarHistoricos = async () => {

        try {
            setCarregando(true);
            setErro("");

            const resposta = await historicoAPI.listarAsync();

            setHistoricos(resposta);

        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar o histórico.");
        }
        finally {
            setCarregando(false);
        }

    };

    const removerHistorico = async (historicoId) => {

        const confirmar = window.confirm(
            "Deseja realmente remover este histórico?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await historicoAPI.removerAsync(historicoId);

            setHistoricos(
                historicos.filter(
                    historico => historico.id !== historicoId
                )
            );

        } catch (error) {
            console.error(error);
            setErro("Não foi possível remover o histórico.");
        }

    };

    const verHistorico = (historicoId) => {

        console.log("Visualizar histórico:", historicoId);

    };

    const formatarValor = (valor) => {

        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    };

    const formatarData = (data) => {

        return new Date(data).toLocaleDateString("pt-BR");

    };

    return (
        <Sidebar>

            <Topbar titulo="Histórico" />

            <div className={style.pagina}>

                <div className={style.cabecalho}>

                    <div>
                        <h1>Histórico de buscas</h1>
                        <p>
                            Consulte as buscas que você já realizou no BestPick.
                        </p>
                    </div>

                    <div className={style.total}>
                        <MdHistory />

                        <span>
                            {historicos.length} {historicos.length === 1 ? "busca" : "buscas"}
                        </span>
                    </div>

                </div>

                {erro && (
                    <div className={style.erro}>
                        {erro}
                    </div>
                )}

                <div className={style.conteudo}>

                    {carregando ? (

                        <div className={style.carregando}>

                            <div className={style.loader}></div>

                            <p>Carregando histórico...</p>

                        </div>

                    ) : historicos.length === 0 ? (

                        <div className={style.vazio}>

                            <MdHistory />

                            <h2>Nenhuma busca encontrada</h2>

                            <p>
                                Suas buscas realizadas aparecerão aqui.
                            </p>

                        </div>

                    ) : (

                        <div className={style.tabelaContainer}>

                            <table className={style.tabela}>

                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Valor máximo</th>
                                        <th>Motivo</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {historicos.map((historico) => (

                                        <tr key={historico.id}>

                                            <td>
                                                <div className={style.produto}>
                                                    {historico.produtoNome}
                                                </div>
                                            </td>

                                            <td>
                                                <span className={style.valor}>
                                                    {formatarValor(historico.valorCompra)}
                                                </span>
                                            </td>

                                            <td>
                                                {historico.motivoCompra}
                                            </td>

                                            <td>
                                                {formatarData(historico.dataBusca)}
                                            </td>

                                            <td>

                                                <div className={style.acoes}>

                                                    <button
                                                        type="button"
                                                        className={style.botaoVer}
                                                        onClick={() => verHistorico(historico.id)}
                                                        title="Visualizar"
                                                    >
                                                        <MdVisibility />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={style.botaoExcluir}
                                                        onClick={() => removerHistorico(historico.id)}
                                                        title="Excluir"
                                                    >
                                                        <MdDelete />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </Sidebar>
    );
}