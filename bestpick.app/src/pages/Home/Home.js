import style from "./Home.module.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import chatAPI from "../../services/chatAPI";

export function Home() {

    const [mensagem, setMensagem] = useState("");
    const [mensagens, setMensagens] = useState([]);
    const [produto, setProduto] = useState(null);
    const [valorCompra, setValorCompra] = useState(null);
    const [motivoCompra, setMotivoCompra] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [buscaCompleta, setBuscaCompleta] = useState(false);

    const finalMensagensRef = useRef(null);
    const textareaRef = useRef(null);

    const token = localStorage.getItem("token");

    let nomeUsuario = "Usuário";

    if (token) {
        const dadosUsuario = jwtDecode(token);

        nomeUsuario =
            dadosUsuario["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            "Usuário";
    }

    useEffect(() => {
        finalMensagensRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [mensagens, carregando]);

    function handleAlterarMensagem(e) {
        setMensagem(e.target.value);

        e.target.style.height = "auto";

        e.target.style.height =
            Math.min(e.target.scrollHeight, 130) + "px";
    }

    async function handleEnviar(e) {
        e.preventDefault();

        if (!mensagem.trim() || carregando || buscaCompleta)
            return;

        const mensagemEnviada = mensagem;

        const novaMensagem = {
            tipo: "usuario",
            texto: mensagemEnviada
        };

        setMensagens(mensagensAtuais => [
            ...mensagensAtuais,
            novaMensagem
        ]);

        setMensagem("");
        setCarregando(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        try {
            const resposta = await chatAPI.enviarMensagemAsync(
                mensagemEnviada,
                produto,
                valorCompra,
                motivoCompra
            );

            setProduto(resposta.produto);
            setValorCompra(resposta.valorCompra);
            setMotivoCompra(resposta.motivoCompra);

            const mensagemBestPick = {
                tipo: "bestpick",
                texto: resposta.mensagem
            };

            setMensagens(mensagensAtuais => [
                ...mensagensAtuais,
                mensagemBestPick
            ]);

            if (resposta.completo) {
                setBuscaCompleta(true);

                const mensagemBuscando = {
                    tipo: "bestpick",
                    texto: "Buscando as melhores opções para você..."
                };

                setMensagens(mensagensAtuais => [
                    ...mensagensAtuais,
                    mensagemBuscando
                ]);
            }
        } catch (error) {
            const mensagemErro = {
                tipo: "bestpick",
                texto: "Não foi possível enviar sua mensagem. Tente novamente."
            };

            setMensagens(mensagensAtuais => [
                ...mensagensAtuais,
                mensagemErro
            ]);
        } finally {
            setCarregando(false);
        }
    }

    function handleNovaBusca() {
        setMensagem("");
        setMensagens([]);
        setProduto(null);
        setValorCompra(null);
        setMotivoCompra(null);
        setCarregando(false);
        setBuscaCompleta(false);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
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

                    <div className={style.mensagens}>

                        {mensagens.map((item, index) => (
                            <div
                                key={index}
                                className={
                                    item.tipo === "usuario"
                                        ? style.mensagemUsuario
                                        : style.mensagemBestPick
                                }
                            >
                                {item.texto}
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
                        >
                            Nova busca
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

                                    if (!carregando && !buscaCompleta && mensagem.trim()) {
                                        e.currentTarget.form.requestSubmit();
                                    }
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