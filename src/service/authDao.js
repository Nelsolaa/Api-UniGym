const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Aluno } = require('../model/Alunos');
const { Professor } = require('../model/Professores');

const SECRET_KEY = process.env.JWT_SECRET; // Garanta que está configurado no .env

const AuthService = {

    async login(email, password) {
        // 1. Tenta encontrar como Aluno
        let user = await Aluno.findOne({ where: { email } });
        let userType = 'aluno';

        // 2. Se não achou como Aluno, tenta como Professor
        if (!user) {
            user = await Professor.findOne({ where: { email } });
            userType = 'professor';
        }

        // 3. Se não achou em nenhuma das duas, retorna erro
        if (!user) {
            // Usar mensagem genérica é mais seguro!
            throw new Error('Email ou senha inválida');
        }

        // 4. Se achou, compara a senha
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Email ou senha inválida');
        }

        // 5. Se a senha bateu, gera o token
        const token = jwt.sign(
            { id: user.id, email: user.email, type: userType }, // Adiciona o tipo ao token!
            SECRET_KEY,
            { expiresIn: '1h' } // Tempo de expiração do token
        );

        return { user: userResponse, token, type: userType }; // Retorna usuário, token e tipo
    },
};

module.exports = { AuthService };