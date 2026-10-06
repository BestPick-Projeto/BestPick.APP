import { HTTPClient } from "./client";

const historicoAPI = {

    async adicionarAsync(produtoNome, valorCompra, motivoCompra) {
        try {
            const response = await HTTPClient.post(`/Historico`, {
                ProdutoNome: produtoNome,
                ValorCompra: valorCompra,
                MotivoCompra: motivoCompra
            });

            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar histórico:", error);
            throw error;
        }
    },

    async listarAsync() {
        try {
            const response = await HTTPClient.get(`/Historico`);

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
            throw error;
        }
    },

    async obterPorIdAsync(id) {
        try {
            const response = await HTTPClient.get(`/Historico/${id}`);

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
            throw error;
        }
    },

    async removerAsync(historicoId) {
        try {
            const response = await HTTPClient.delete(`/Historico/${historicoId}`);

            return response.data;
        } catch (error) {
            console.error("Erro ao remover histórico:", error);
            throw error;
        }
    },

}

export default historicoAPI;