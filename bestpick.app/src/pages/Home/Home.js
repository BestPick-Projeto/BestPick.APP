import style from "./Home.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { CardProduto } from "../../components/CardProduto/CardProduto";
import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import chatAPI from "../../services/chatAPI";
import historicoAPI from "../../services/historicoAPI";
import produtoAPI from "../../services/produtoAPI";
import favoritoAPI from "../../services/favoritoAPI";

export function Home() {

    const [mensagem, setMensagem] = useState("");
    const [mensagens, setMensagens] = useState([]);
    const [produto, setProduto] = useState(null);
    const [valorCompra, setValorCompra] = useState(null);
    const [motivoCompra, setMotivoCompra] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [buscaCompleta, setBuscaCompleta] = useState(false);
    const [aguardandoNovaBusca, setAguardandoNovaBusca] = useState(false);
    const [favoritos, setFavoritos] = useState({});

    const finalMensagensRef = useRef(null);
    const textareaRef = useRef(null);

    const token = localStorage.getItem("token");

    const nomeUsuario = token
        ? jwtDecode(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Usuário"
        : "Usuário";

    useEffect(() => {
        finalMensagensRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [mensagens, carregando]);

    function adicionarMensagem(tipo, texto, produtos = []) {
        setMensagens(atuais => [
            ...atuais,
            { tipo, texto, produtos }
        ]);
    }

    function handleAlterarMensagem(e) {
        setMensagem(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height =
            Math.min(e.target.scrollHeight, 130) + "px";
    }

    async function salvarBusca(resposta) {
        const historico = await historicoAPI.adicionarAsync(
            resposta.produto,
            resposta.valorCompra,
            resposta.motivoCompra
        );

        return Promise.all(
            resposta.produtos.map(async produto => {
                const salvo = await produtoAPI.adicionarAsync(
                    produto,
                    historico.id
                );

                return {
                    ...produto,
                    id: salvo.id
                };
            })
        );
    }

    async function handleEnviar(e) {
        e.preventDefault();

        if (!mensagem.trim() || carregando || buscaCompleta)
            return;

        const texto = mensagem.trim();

        adicionarMensagem("usuario", texto);
        setMensagem("");
        setCarregando(true);

        if (textareaRef.current)
            textareaRef.current.style.height = "auto";

        try {
            const resposta = await chatAPI.enviarMensagemAsync(
                texto,
                produto,
                valorCompra,
                motivoCompra
            );

            setProduto(resposta.produto);
            setValorCompra(resposta.valorCompra);
            setMotivoCompra(resposta.motivoCompra);

            let produtos = resposta.produtos || [];

            if (resposta.completo && produtos.length > 0)
                produtos = await salvarBusca(resposta);

            adicionarMensagem(
                "bestpick",
                resposta.mensagem,
                produtos
            );

            if (resposta.completo) {
                setBuscaCompleta(true);
                setAguardandoNovaBusca(true);

                setTimeout(() => {
                    setAguardandoNovaBusca(false);
                }, 5000);
            }

        } catch (error) {
            console.error(error);

            adicionarMensagem(
                "bestpick",
                "Não foi possível enviar sua mensagem. Tente novamente."
            );
        } finally {
            setCarregando(false);
        }
    }

    async function handleFavoritar(produto) {
        try {
            const favorito = favoritos[produto.id];

            if (favorito) {
                await favoritoAPI.removerAsync(favorito.id);

                setFavoritos(atuais => {
                    const novos = { ...atuais };
                    delete novos[produto.id];
                    return novos;
                });

                return;
            }

            const salvo =
                await favoritoAPI.adicionarAsync(produto.id);

            setFavoritos(atuais => ({
                ...atuais,
                [produto.id]: salvo
            }));

        } catch (error) {
            console.error(
                "Erro ao favoritar produto:",
                error
            );
        }
    }

    function handleNovaBusca() {
        if (aguardandoNovaBusca)
            return;

        setMensagem("");
        setMensagens([]);
        setProduto(null);
        setValorCompra(null);
        setMotivoCompra(null);
        setBuscaCompleta(false);
        setFavoritos({});

        if (textareaRef.current)
            textareaRef.current.style.height = "auto";
    }

    return (
        <Sidebar>

            <Topbar titulo="Chat" />

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

                    <div className={style.mensagens}>

                        {mensagens.map((item, index) => (
                            <div
                                key={index}
                                className={
                                    item.tipo === "usuario"
                                        ? style.mensagemUsuario
                                        : item.produtos?.length
                                            ? style.respostaProdutos
                                            : style.mensagemBestPick
                                }
                            >

                                {item.texto && (
                                    <div className={
                                        item.produtos?.length
                                            ? style.mensagemBestPick
                                            : ""
                                    }>
                                        {item.texto}
                                    </div>
                                )}

                                {item.produtos?.length > 0 && (
                                    <div className={style.produtos}>

                                        {item.produtos.map((produto, produtoIndex) => (
                                            <CardProduto
                                                key={produto.id || produtoIndex}
                                                produto={produto}
                                                favorito={!!favoritos[produto.id]}
                                                onFavoritar={handleFavoritar}
                                            />
                                        ))}

                                    </div>
                                )}

                            </div>
                        ))}

                        {carregando && (
                            <div className={style.mensagemBestPick}>
                                <div className={style.pensando}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={finalMensagensRef}></div>

                    </div>

                    {buscaCompleta && (
                        <button
                            type="button"
                            className={style.novaBusca}
                            onClick={handleNovaBusca}
                            disabled={aguardandoNovaBusca}
                        >
                            {aguardandoNovaBusca
                                ? "Aguarde para iniciar uma nova busca..."
                                : "Nova busca"}
                        </button>
                    )}

                    <form
                        className={style.areaMensagem}
                        onSubmit={handleEnviar}
                    >

                        <textarea
                            ref={textareaRef}
                            placeholder={
                                buscaCompleta
                                    ? "Inicie uma nova busca..."
                                    : "Ex: Quero um celular para trabalho de até 2000 reais..."
                            }
                            value={mensagem}
                            onChange={handleAlterarMensagem}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();

                                    if (!carregando && !buscaCompleta && mensagem.trim())
                                        e.currentTarget.form.requestSubmit();
                                }
                            }}
                            rows="1"
                            disabled={carregando || buscaCompleta}
                        />

                        <button
                            type="submit"
                            aria-label="Enviar mensagem"
                            disabled={carregando || buscaCompleta}
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