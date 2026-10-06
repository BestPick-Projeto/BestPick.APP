import style from "./VerHistorico.module.css";
import { MdOpenInNew } from "react-icons/md";

export function VerHistorico({ produtos }) {

    const formatarValor = valor =>
        Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    return (
        <div className={style.produtos}>

            {produtos.length ? (

                produtos.map(produto => (

                    <div
                        className={style.cardProduto}
                        key={produto.id}
                    >

                        <div className={style.imagem}>

                            {produto.imgUrl ? (

                                <img
                                    src={produto.imgUrl}
                                    alt={produto.nome}
                                />

                            ) : (

                                <span>Sem imagem</span>

                            )}

                        </div>

                        <div className={style.infoProduto}>

                            <h3>{produto.nome}</h3>

                            <strong className={style.preco}>
                                {formatarValor(produto.preco)}
                            </strong>

                            {produto.url && (

                                <a
                                    href={produto.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={e => e.stopPropagation()}
                                >
                                    Ver produto
                                    <MdOpenInNew />
                                </a>

                            )}

                        </div>

                    </div>

                ))

            ) : (

                <div className={style.semProdutos}>
                    Nenhum produto encontrado para esta busca.
                </div>

            )}

        </div>
    );
}