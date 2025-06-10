const pacienteService= require('../services/pacienteService');

async function getPacienteById(req, res){
    try {
        const { id } = req.body;
        const paciente = await pacienteService.getPacienteById(id);

        if (!paciente){
            res.status(404).json({error: 'Paciente não encontrado'});
        }

        res.status(200).json({message: 'Paciente encontrado: ', paciente})
    } catch(error){
        console.error('Erro no controller ao buscar paciente por ID. ', error);
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function getPacienteProfile(req, res){
    try {
        const { id } = req.user.paciente.id;
        const pacienteProfile = await pacienteService.getPacienteProfile(id);

        if (!pacienteProfile){
            res.status(404).json({error: 'Paciente não encontrado'});
        }
        res.status(200).json({message: 'Perfil do paciente encontrado: ', pacienteProfile: pacienteProfile});
    } catch (error){
        console.error('Erro no controller ao buscar perfil do paciente', error.message);
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function getPacienteByEmail(req, res){
    try {
        const { email } = req.body;
        const paciente = await pacienteService.getPacienteByEmail(email);
        
        if (!paciente){
            res.status(404).json({message: 'Paciente não encontrado'})
        }
        res.status(200).json({message: 'Paciente encontrado. Email: ', email});
    }catch (error){
        console.error('Erro no controller ao buscar paciente por email', error.message)
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function getDietaById(req, res){
    try{
        const { dietaId } = req.body;
        const dieta = await pacienteService.getDietaById(dietaId);

        if (!dieta){
            res.status(404).json({message: 'Dieta não encontrada'})
        }
        res.status(200).json({message: 'Dieta encontrada. Dieta: ', dieta});
    }catch (error){
        console.error('Erro no controller ao buscar dieta por ID', error.message)
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function createPaciente(req, res){
    const userData = req.body;
    try {
        const newPaciente = await pacienteService.createPaciente(userData);
        res.status(201).json('Novo paciente criado: ' + newPaciente.name);
    }catch (error){
        console.error({ error: 'Erro ao criar paciente: ', error});
        res.status(500).json('Erro ao criar paciente: ', error);
    }
}

module.exports = {
    getPacienteById,
    getPacienteProfile,
    getPacienteByEmail,
    getDietaById,
    createPaciente
}