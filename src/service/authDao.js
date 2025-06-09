const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Importe seus modelos. Os nomes dos arquivos devem estar corretos.
const { Aluno } = require('../model/AlunosDb'); 
const { Professor } = require('../model/ProfessoresDb');

const SECRET_KEY = process.env.JWT_SECRET;

const AuthService = {

    async login(email, password) {
        // 1. Procura primeiro na tabela de alunos
        let user = await Aluno.findOne({ where: { email } });

        // 2. Se não achou, procura na tabela de professores
        if (!user) {
            user = await Professor.findOne({ where: { email } });
        }

        // 3. Se não encontrou em nenhuma das duas, o usuário não existe.
        if (!user) {
            throw new Error('Email ou senha inválida');
        }

        // 4. Se encontrou um usuário, compara a senha
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Email ou senha inválida');
        }

        // 5. Se a senha está correta, pega o tipo DELE (que veio do banco)
        const userType = user.tipo; // <<<====== A MÁGICA ACONTECE AQUI!

        // Medida de segurança: se por algum motivo o tipo for nulo no banco
        if (!userType) {
            throw new Error('Tipo de usuário não definido para este usuário.');
        }
        
        // 6. Cria o token usando o tipo que lemos do banco
        const token = jwt.sign(
            { id: user.id, email: user.email, tipo: userType },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // 7. Prepara a resposta, removendo a senha
        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        console.log(userType)
        // 8. Retorna tudo que o Android precisa: o usuário, o token e o tipo no nível principal
        return { user: userResponse, token, tipo: userType };
    },
    async simpleResetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email e nova senha são obrigatórios.' });
        }

        // Tenta achar em Alunos ou Professores
        let user = await Aluno.findOne({ where: { email } }) || await Professor.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário com este email não encontrado.' });
        }

        // Hash da nova senha
        const password_hash = await bcrypt.hash(newPassword, 10);
        
        // Atualiza o usuário encontrado
        await user.update({ password_hash });

        res.status(200).json({ message: 'Senha atualizada com sucesso!' });

    } catch (error) {
        console.error("Erro na redefinição de senha:", error);
        res.status(500).json({ error: 'Erro interno ao atualizar senha.' });
    }
}
}
module.exports = { AuthService };