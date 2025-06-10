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
        const { id } = req.user.medico.id;
        const medicoProfile = await medicoService.getMedicoProfile(id);

        if (!medicoProfile){
            res.status(404).json({error: 'Médico não encontrado'});
        }
        res.status(200).json({message: 'Perfil do médico encontrado: ', medicoProfile: medicoProfile});
    } catch (error){
        console.error('Erro no controller ao buscar perfil do médico', error.message);
        res.status(500).json({error: 'Erro interno no servidor', error: message});
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

async function getPacienteByEmail(req, res){
    try {
        const email = req.params.email;
        console.log('Email recebido no controller: ', email);
        const paciente = await medicoService.getPacienteByEmail(email);
        if (!paciente){
            res.status(404).json({message: 'Paciente não encontrado'});
        }
        res.status(200).json({message: 'Paciente encontrado: ', paciente});
    } catch (error) {
        console.error('Erro no controller ao buscar paciente por email', error.message);
        res.status(500).json({error: 'Erro interno no servidor', error: error.message});
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

module.exports = {
    findMedicoByCrm,
    getMedicoProfile,
    getPacienteByEmail,
    getAllPacientes,
    createMedico
}
