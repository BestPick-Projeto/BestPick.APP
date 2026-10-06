import style from "./Historico.module.css";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { MdDelete, MdHistory, MdKeyboardArrowDown, MdSearch } from "react-icons/md";
import { Fragment, useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { VerHistorico } from "../VerHistorico/VerHistorico";
import historicoAPI from "../../services/historicoAPI";
import produtoAPI from "../../services/produtoAPI";

export function Historico() {

    const [historicos, setHistoricos] = useState([]);
    const [busca, setBusca] = useState("");
    const [historicoAberto, setHistoricoAberto] = useState(null);
    const [historicoSelecionado, setHistoricoSelecionado] = useState(null);
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        historicoAPI.listarAsync()
            .then(setHistoricos)
            .catch(error => console.error("Erro ao carregar histórico:", error));
    }, []);

    const historicosFiltrados = historicos.filter(historico =>
        historico.produtoNome?.toLowerCase().includes(busca.trim().toLowerCase())
    );

    const handleExpandir = async historicoId => {
        if (historicoAberto === historicoId) {
            setHistoricoAberto(null);
            return;
        }

        try {
            setHistoricoAberto(historicoId);
            setProdutos([]);
            setProdutos(await produtoAPI.buscarPorHistoricoAsync(historicoId));
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    };

    const handleDeletar = async () => {
        try {
            await historicoAPI.removerAsync(historicoSelecionado.id);

            setHistoricos(atuais =>
                atuais.filter(historico => historico.id !== historicoSelecionado.id)
            );

            if (historicoAberto === historicoSelecionado.id)
                setHistoricoAberto(null);

            setHistoricoSelecionado(null);
        } catch (error) {
            console.error("Erro ao remover histórico:", error);
        }
    };

    const formatarValor = valor =>
        Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const formatarData = data =>
        new Date(data).toLocaleDateString("pt-BR");

    return (
        <Sidebar>
            <Topbar titulo="Histórico" />

            <div className={style.pagina}>

                <div className={style.cabecalho}>
                    <div>
                        <h1>Histórico de buscas</h1>
                        <p>Consulte as buscas que você já realizou no BestPick.</p>
                    </div>

                    <div className={style.total}>
                        <MdHistory />
                        <strong>{historicos.length}</strong>
                        <span>
                            {historicos.length === 1 ? "busca realizada" : "buscas realizadas"}
                        </span>
                    </div>
                </div>

                <div className={style.busca}>
                    <MdSearch />
                    <input
                        type="text"
                        placeholder="Buscar pelo nome da busca..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                    />
                </div>

                <div className={style.tabela}>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Valor máximo</th>
                                <th>Motivo</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {historicosFiltrados.length ? (
                                historicosFiltrados.map(historico => (
                                    <Fragment key={historico.id}>

                                        <tr
                                            className={style.linha}
                                            onClick={() => handleExpandir(historico.id)}
                                        >
                                            <td className={style.produto}>{historico.produtoNome}</td>
                                            <td className={style.valor}>{formatarValor(historico.valorCompra)}</td>
                                            <td>{historico.motivoCompra}</td>
                                            <td>{formatarData(historico.dataBusca)}</td>

                                            <td className={style.acoes}>
                                                <button
                                                    className={style.deletar}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setHistoricoSelecionado(historico);
                                                    }}
                                                    title="Excluir"
                                                >
                                                    <MdDelete />
                                                </button>

                                                <MdKeyboardArrowDown
                                                    className={`${style.seta} ${historicoAberto === historico.id ? style.setaAberta : ""
                                                        }`}
                                                />
                                            </td>
                                        </tr>

                                        {historicoAberto === historico.id && (
                                            <tr className={style.linhaExpandida}>
                                                <td colSpan="5">
                                                    <VerHistorico produtos={produtos} />
                                                </td>
                                            </tr>
                                        )}

                                    </Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className={style.vazio}>
                                        {busca ? "Nenhuma busca encontrada." : "Nenhum histórico encontrado."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

            </div>

            <Modal
                show={!!historicoSelecionado}
                onHide={() => setHistoricoSelecionado(null)}
                centered
                contentClassName={style.modal}
            >
                <Modal.Header closeButton closeVariant="white" className={style.modalHeader}>
                    <Modal.Title>Excluir histórico</Modal.Title>
                </Modal.Header>

                <Modal.Body className={style.modalBody}>
                    Tem certeza que deseja excluir a busca por{" "}
                    <strong>{historicoSelecionado?.produtoNome}</strong>?
                </Modal.Body>

                <Modal.Footer className={style.modalFooter}>
                    <Button variant="secondary" onClick={() => setHistoricoSelecionado(null)}>
                        Cancelar
                    </Button>

                    <Button variant="danger" onClick={handleDeletar}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Sidebar>
    );
}