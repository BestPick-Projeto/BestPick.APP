import { HTTPClient } from "./client";

const produtoAPI = {

    async adicionarAsync(produto, historicoBuscaId) {
        try {
            const response = await HTTPClient.post(`/Produto`, {
                HistoricoBuscaId: historicoBuscaId,
                Nome: produto.nome,
                Categoria: produto.categoria,
                Preco: produto.preco,
                ImgUrl: produto.imgUrl,
                Url: produto.url,
                Beneficios: produto.beneficios || []
            });

            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
            throw error;
        }
    },

    async buscarPorHistoricoAsync(historicoBuscaId) {
        try {
            const response = await HTTPClient.get(
                `/Produto/historico/${historicoBuscaId}`
            );

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar produtos do histórico:", error);
            throw error;
        }
    },

    async obterPorIdAsync(id) {
        try {
            const response = await HTTPClient.get(`/Produto/${id}`);

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            throw error;
        }
    },

}

export default produtoAPI;