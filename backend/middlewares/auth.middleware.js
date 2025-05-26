const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const authMiddleware = (req, res, next) => {
    
    // Obter o token do cabeçalho de autorização
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido. Autorização negada' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Formato do token inválido. Autorização negada' });
    }

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, jwtConfig.secret);
        
        // Adicionar os dados do usuário decodificado ao objeto de solicitação
        req.user = decoded;

        console.log('Token verifiicado com sucesso. Usuário:', req.user.name);
        next(); // Chamar o próximo middleware ou rota
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return res.status(401).json({ message: 'Token inválido. Autorização negada' });
    }
}

module.exports = authMiddleware;