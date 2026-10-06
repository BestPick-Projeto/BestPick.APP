import { HTTPClient } from "./client";

const favoritoAPI = {

    async adicionarAsync(produtoId) {
        try {
            const response = await HTTPClient.post(`/Favorito`, {
                ProdutoId: produtoId
            });

            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar favorito:", error);
            throw error;
        }
    },

    async listarAsync() {
        try {
            const response = await HTTPClient.get(`/Favorito`);

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
            throw error;
        }
    },

    async atualizarStatusAsync(favoritoId, novoStatus) {
        try {
            const status = {
                FavoritoId: favoritoId,
                novoStatus: parseInt(novoStatus)
            }
            const response = await HTTPClient.put(`/Favorito`, status);

            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar favorito:", error);
            throw error;
        }
    },

    async removerAsync(id) {
        try {
            const response = await HTTPClient.delete(`/Favorito/${id}`);

            return response.data;
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
            throw error;
        }
    }

}

export default favoritoAPI;