import { HTTPClient } from "./client";

const chatAPI = {

    async enviarMensagemAsync(mensagem, produto, valorCompra, motivoCompra) {
        try {
            const chat = {
                Mensagem: mensagem,
                Produto: produto,
                ValorCompra: valorCompra,
                MotivoCompra: motivoCompra,
            };
            console.log("DADOS ENVIADOS:", chat);

            const response = await HTTPClient.post(`/Chat/Mensagem`, chat);

            return response.data;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            throw error;
        }
    },

}

export default chatAPI;