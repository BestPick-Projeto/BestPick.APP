import { HTTPClient } from "./client";

const dashboardAPI = {

    async obterAsync() {
        try {
            const response = await HTTPClient.get(`/Dashboard`);

            return response.data;
        } catch (error) {
            console.error("Erro ao buscar dados da dashboard:", error);
            throw error;
        }
    },

}

export default dashboardAPI;