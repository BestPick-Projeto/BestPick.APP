import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cadastro.module.css";
import usuarioAPI from "../../services/usuarioAPI";
import imagemTelaLogin from "../../assets/imagemTelaLogin.png";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export function Cadastro() {

    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleCadastrar = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            await usuarioAPI.criarAsync(nome, email, senha);

            await new Promise(resolve => setTimeout(resolve, 750));

            navigate('/');

        } catch (error) {
            console.error(error);
            setErro(error.response?.data?.message || error.response?.data || "Não foi possível criar sua conta.");
        }
        finally {
            setCarregando(false);
        }

    };


    return (
        <div
            className={styles.pagina} style={{ backgroundImage: `url(${imagemTelaLogin})` }}>

            <div className={styles.conteudo}>

                <div className={styles.marca}>
                    <h1>Best<span>Pick</span></h1>
                    <p>Escolhas melhores, resultados reais.</p>
                </div>

                <form className={styles.formulario} onSubmit={handleCadastrar}>

                    <h2>Crie sua conta</h2>

                    <p className={styles.eyebrow}>Preencha seus dados para continuar</p>


                    {erro && <p className={styles.mensagemErro}>{erro}</p>}

                    <div className={styles.form}>

                        <div className={styles.campo}>

                            <input
                                minLength={2}
                                maxLength={50}
                                id="nome"
                                type="text"
                                placeholder="Nome"
                                className={styles.input}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                autoComplete="name"
                                required
                            />

                        </div>

                        <div className={styles.campo}>

                            <input
                                maxLength={50}
                                id="email"
                                type="email"
                                placeholder="E-mail"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                required
                            />

                        </div>

                        <div className={styles.campo}>

                            <input
                                minLength={6}
                                maxLength={20}
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Senha"
                                className={`${styles.input} ${styles.inputSenha}`}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                className={styles.botaoOlho}
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {mostrarSenha ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>

                        </div>

                        <button
                            type="submit"
                            className={styles.botaoEntrar}
                            disabled={carregando}
                        >
                            {carregando ? (
                                <div className={styles.entrando}>
                                    <span>Criando conta</span>
                                    <span className={styles.loaderBotao}></span>
                                </div>
                            ) : (
                                "Criar conta"
                            )}
                        </button>

                    </div>

                    <div className={styles.criarConta}>
                        <p>Já tem uma conta?</p>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                        >
                            Entrar
                        </button>
                    </div>

                </form>

                <p className={styles.rodape}>© 2026 BestPick. Todos os direitos reservados.</p>

            </div>

        </div>

    );
}