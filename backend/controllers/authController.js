const authService = require('../services/authService');

async function medicoRegister(req, res){
    const { name, email, phone, crm, password } = req.body;

    if (!name || !email || !phone || !crm || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const newMedico = await authService.medicoRegister(name, email, phone, crm, password);
        res.status(201).json({ message: 'Médico registrado com sucesso!', user: newMedico });
    } catch (error) {
        console.error('Erro no AuthController.medicoRegister:', error);
        res.status(400).json({ message: error.message || 'Erro ao registrar médico.' });
    }
}

async function pacienteRegister(req, res){
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const newPaciente = await authService.medicoRegister(name, email, phone, password);
        res.status(201).json({ message: 'Paciente registrado com sucesso!', user: newPaciente });
    } catch (error) {
        console.error('Erro no AuthController.pacienteRegister:', error);
        res.status(400).json({ message: error.message || 'Erro ao registrar médico.' });
    }
}

async function medicoLogin(req, res){
    try {
        const {crm, password} = req.body;

        if (!crm || !password) {
            return res.status(400).json({ message: 'CRM e senha são obrigatórios.' });
        }
        
        const token = await authService.medicoLogin(crm, password);
        if (!token) {
            return res.status(401).json({ message: 'CRM ou senha inválidos.' });
        }
        res.status(200).json({message: 'Login bem-sucedido!', token: token});
    }catch (error){
        console.error('Erro no AuthController.login', error.message)
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function pacienteLogin(req, res){
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }
        
        const token = await authService.pacienteLogin(email, password);
        if (!token) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
        res.status(200).json({message: 'Login bem-sucedido!', token: token});
    }catch (error){
        console.error('Erro no AuthController.login', error.message)
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

module.exports = {
    medicoRegister,
    pacienteRegister,
    medicoLogin,
    pacienteLogin,
}