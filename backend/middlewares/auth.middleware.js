const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Nenhum token fornecido. Autorização negada.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token malformatado.' });
    }
    const token = parts[1];

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        
        // Lógica que verifica se o token é de um paciente OU de um médico
        if (decoded.paciente) {
            req.user = { paciente: decoded.paciente };
            console.log('Token de PACIENTE verificado com sucesso. ID:', req.user.paciente.id);
        } else if (decoded.medico) {
            req.user = { medico: decoded.medico };
            console.log('Token de MÉDICO verificado com sucesso. ID:', req.user.medico.id);
        } else {
            return res.status(403).json({ message: 'Token com formato de payload inválido.' });
        }
        
        next();

    } catch (error) {
        console.error('Erro na verificação do token:', error.name);
        return res.status(401).json({ message: 'Token inválido ou expirado. Autorização negada.' });
    }
};

module.exports = authMiddleware;
