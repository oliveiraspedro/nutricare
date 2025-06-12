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

async function assignExistingPatientToNutricionista(email, medicoId){
    try {
        let paciente = await pacienteRepository.findPacienteByEmail(email);

        if (!paciente) {
            const error = new Error('Paciente com este email não encontrado.');
            error.statusCode = 404;
            throw error;
        }

        if (paciente.id_nutricionista !== null) {
            if (paciente.id_nutricionista === medicoId) {
                const error = new Error('Este paciente já está vinculado à sua lista.');
                    error.statusCode = 409; // Conflict
                    throw error;
                } else {
                    const error = new Error('Este paciente já está vinculado a outro nutricionista.');
                    error.statusCode = 409; // Conflict
                    throw error;
                }
            }

        // Atualiza o paciente usando o repositório
        const affectedRows = await pacienteRepository.assignExistingPatientToNutricionista(paciente, medicoId);

        if (affectedRows === 0) {
            const error = new Error('Falha ao atualizar o paciente. Nenhuma linha afetada.');
            error.statusCode = 500;
            throw error;
        }

        // Busca e retorna os dados completos do paciente atualizado
        const updatedPatient = await pacienteRepository.findPacienteByEmail(paciente.email);
        return updatedPatient;

    } catch (error) {
        console.error('Erro em PatientService.assignExistingPatientByEmail:', error);
        throw error;
    }
}

async function deassignPatientFromNutricionista(medicoId) {
    try {
        const affectedRows = await pacienteRepository.deassignPatientFromNutricionista(medicoId);
        return affectedRows;
    } catch (error) {
        console.error('Erro em PatientService.deassignPatientFromNutricionista:', error);
        throw error;
    }
}

module.exports = {
    getPacienteById,
    getPacienteProfile,
    getPacienteByEmail,
    getDietaById,
    assignExistingPatientToNutricionista,
    deassignPatientFromNutricionista
}
