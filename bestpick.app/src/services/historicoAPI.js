import { HTTPClient } from "./client";

const historicoAPI = {

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