const pacienteRepository = require('../repositories/pacienteRepository')

async function getPacienteById(id){
    const paciente = await pacienteRepository.getPacienteById(id);
    return paciente;
}

async function getPacienteByEmail(email){
    const paciente = await pacienteRepository.getPacienteByEmail(email);
    return paciente;
}

async function getPacienteProfile(id){
    const pacienteProfile = await pacienteRepository.findPacienteById(id);

    if (!pacienteProfile){
        throw new Error('Paciente não encontrado');
    }

    return pacienteProfile;
}

async function getDietaById(dietaId){
    const dieta = await pacienteRepository.getDietaById(dietaId);
    return dieta;
}

async function createPaciente(userData){
    const { name, email, phone, password } = userData;
    const newPaciente = await pacienteRepository.createPaciente(name, email, phone, password);
    return newPaciente;
}

module.exports = {
    getPacienteById,
    getPacienteProfile,
    getPacienteByEmail,
    getDietaById,
    createPaciente
}
