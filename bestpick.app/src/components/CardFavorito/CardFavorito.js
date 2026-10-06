import style from "./CardFavorito.module.css";
import { FaCheck, FaUndo, FaTrash } from "react-icons/fa";

export function CardFavorito({
    favorito,
    adquirido,
    onAlterarStatus,
    onRemover
}) {

    return (
        <div className={style.card}>

            <div className={style.imagem}>
                <img
                    src={favorito.imgUrl}
                    alt={favorito.nomeProduto}
                />
            </div>

            <div className={style.conteudo}>

                <h3>{favorito.nomeProduto}</h3>

                <span className={style.preco}>
                    {favorito.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </span>

                {favorito.beneficios?.length > 0 && (
                    <ul>
                        {favorito.beneficios.map((beneficio, index) => (
                            <li key={index}>
                                {beneficio}
                            </li>
                        ))}
                    </ul>
                )}

                <div className={style.acoes}>

                    <a
                        href={favorito.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ver produto
                    </a>

                    <button
                        className={style.status}
                        onClick={() => onAlterarStatus(favorito)}
                    >
                        {adquirido ? <FaUndo /> : <FaCheck />}

                        {adquirido
                            ? "Voltar para favoritos"
                            : "Marcar como adquirido"}
                    </button>

                    <button
                        className={style.remover}
                        onClick={() => onRemover(favorito.id)}
                        aria-label="Remover"
                    >
                        <FaTrash />
                    </button>

                </div>

            </div>

        </div>
    );
}