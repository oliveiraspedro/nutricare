const { json } = require('express');
const medicoService = require('../services/medicoService')

async function findMedicoByCrm(req, res){
    try {
        const crm = req.body;
        const medico = await medicoService.findMedicoByCrm(crm);
        
        if (!medico){
            res.status(404).json({message: 'Médico não encontrado'})
        }
        res.status(200).json({message: 'Médico encontrado. CRM: ', crm});
    }catch (error){
        console.error('Erro no controller ao buscar médico por CRM', error.message)
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function getMedicoProfile(req, res){
    try {
        // LÓGICA CORRETA: Este controller SÓ se importa com o ID do médico.
        const id = req.user?.medico?.id;

        // Se não houver um ID de médico no token, o acesso é não autorizado.
        if (!id) {
            return res.status(401).json({ error: 'Acesso negado. Token de médico inválido.' });
        }

        const medicoProfile = await medicoService.getMedicoProfile(id); // Supondo que você tenha essa função no service

        if (!medicoProfile){
            return res.status(404).json({error: 'Médico não encontrado'});
        }
        
        // Retorna os dados do perfil do médico
        res.status(200).json({ profile: medicoProfile });

    } catch (error){
        console.error('Erro no controller ao buscar perfil do médico:', error.message);
        res.status(500).json({error: 'Erro interno no servidor', message: error.message});
    }
}

async function getMedicoById(req, res){
    try {
        const { id } = req.body;
        const medico = await medicoService.getMedicoById(id);

        if (!medico){
            res.status(404).json({error: 'Médico não encontrado'});
        }

        res.status(200).json({message: 'Médico encontrado: ', medico})
    } catch(error){
        console.error('Erro no controller ao buscar médico por ID. ', error);
        res.status(500).json({error: 'Erro interno no servidor', error: message});
    }
}

async function getAllPacientes(req, res){
    try {

        const pacientes = await medicoService.getAllPacientes();
        if (!pacientes){
            res.status(404).json({message: "Nenhum paciente foi encontrado"});
        }

        res.status(200).json({messagem: "Foram encontrados " + pacientes.length() + "pacientes"});
    }catch (error){
        console.error({error: 'Erro no controller ao tentar buscar todos os pacientes', error});
        res.status(500).json({error: 'Erro interno no servidor', error});
    }
}

async function createMedico(req, res){
    try {
        const userData = req.body;
        const newMedico = await medicoService.createMedico(userData);

        res.status(201).json({message: 'Novo médico criado: ' + newMedico.name})
    }catch (error){
        console.error({ error: 'Erro no controller ao tentar criar médico: ', error});
        res.status(500).json({error: 'Erro interno no servido', error});
    }
}

async function removeRefeicaoById(req, res){
    try{
        const id = req.body.refeicaoId;
        const affectedRows = await medicoService.removeRefeicaoById(id);

        if(affectedRows == 0){
            res.status(404).json({message: 'Nenhuma refeição com esse id encontrada: ', id: id})
        }

        res.status(200).json({message: 'Refeição deleteda com sucesso!'})
    }catch(error){
        console.error({ error: 'Erro no controller ao tentar excluir uma refeição: ', error});
        res.status(500).json({error: 'Erro interno no servido', error});
    }
}

async function getAllPacientesAssignWithMedico(req, res){
    try{
        const medicoId = req.params.medicoId;
        const pacientes = await medicoService.getAllPacientesAssignWithMedico(medicoId);
        console.log("medicoId passado para o controller: ", medicoId)

        if (pacientes != null){
            console.log("Pacientes encontrados:")
            pacientes.forEach(paciente => {
                console.log("Paciente ", paciente.name);
            })
        }

        res.status(200).json({messag: 'Usuários encontrados: ', pacientes: pacientes})
    }catch(error){
        console.error({ error: 'Erro no controller ao tentar buscar os pacientes associados ao medico: ', error});
        res.status(500).json({error: 'Erro interno no servido', error});
    }
}

module.exports = {
    findMedicoByCrm,
    getMedicoProfile,
    getAllPacientes,
    createMedico,
    removeRefeicaoById,
    getAllPacientesAssignWithMedico
}
