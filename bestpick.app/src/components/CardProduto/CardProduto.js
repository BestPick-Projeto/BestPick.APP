import style from "./CardProduto.module.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export function CardProduto({
    produto,
    favorito = false,
    onFavoritar
}) {

    return (
        <div className={style.card}>

            <div className={style.imagem}>
                <img
                    src={produto.imgUrl}
                    alt={produto.nome}
                />
            </div>

            <div className={style.conteudo}>

                <h3>{produto.nome}</h3>

                <span className={style.preco}>
                    {produto.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </span>

                {produto.beneficios?.length > 0 && (
                    <ul>
                        {produto.beneficios.map((beneficio, index) => (
                            <li key={index}>
                                {beneficio}
                            </li>
                        ))}
                    </ul>
                )}

                <div className={style.acoes}>

                    <a
                        href={produto.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ver produto
                    </a>

                    <button
                        type="button"
                        className={style.favoritar}
                        onClick={() => onFavoritar(produto)}
                        aria-label="Favoritar produto"
                    >
                        {favorito
                            ? <FaHeart />
                            : <FaRegHeart />}
                    </button>

                </div>

            </div>

        </div>
    );
}