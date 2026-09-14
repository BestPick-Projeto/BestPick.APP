import { HTTPClient } from "./client";

const usuarioAPI = {

    async loginAsync(email, senha) {
        try {
            const login = {
                Email: email,
                Senha: senha,
            };

            const response = await HTTPClient.post(`/Usuario/login`, login);

            return response.data;
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            throw error;
        }
    },

    async criarAsync(nome, email, senha) {
        try {
            const usuarioCriar = {
                Nome: nome,
                Email: email,
                Senha: senha,
            };

            const response = await HTTPClient.post(`/Usuario`, usuarioCriar);

            return response.data;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    },

}

export default usuarioAPI;