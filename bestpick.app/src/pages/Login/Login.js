import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import usuarioAPI from "../../services/usuarioAPI";
import imagemTelaLogin from "../../assets/imagemTelaLogin.png";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleEntrar = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const resposta = await usuarioAPI.loginAsync(email, senha);

            localStorage.setItem("token", resposta.token);

            navigate('/home');

        } catch (error) {
            console.error(error);
            setErro('E-mail ou senha inválidos');
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

                <form className={styles.formulario} onSubmit={handleEntrar}>

                    <h2>Acesse sua conta</h2>

                    <p className={styles.eyebrow}>Entre para continuar</p>


                    {erro && <p className={styles.mensagemErro}>{erro}</p>}

                    <div className={styles.form}>
                        <div className={styles.campo}>

                            <input
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
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Senha"
                                className={`${styles.input} ${styles.inputSenha}`}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="current-password"
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
                                    <span>Entrando</span>
                                    <span className={styles.loaderBotao}></span>
                                </div>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </div>

                    <div className={styles.criarConta}>
                        <p>Ainda não tem uma conta?</p>
                        <button type="button">Criar conta</button>
                    </div>

                </form>

                <p className={styles.rodape}>© 2026 BestPick. Todos os direitos reservados.</p>

            </div>

        </div>

    );
}