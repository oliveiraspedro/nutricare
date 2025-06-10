const medicoRepository = require('../repositories/medicoRepository')

async function getMedicoById(id){
    const medico = await medicoRepository.getMedicoById(id);
    return medico;
}

async function findMedicoByCrm(crm){
    const medico = await medicoRepository.findMedicoByCrm(crm); 
    return medico;
}

async function getMedicoProfile(id){ 
    const medicoProfile = await medicoRepository.findMedicoById(id);

    if (!medicoProfile){
        throw new Error('Médico não encontrado');
    }

    return medicoProfile;
}

async function getPacienteByEmail(email){
    const paciente = await medicoRepository.getPacienteByEmail(email);

    if (!paciente){
        throw new Error('Paciente não encontrado');
    }

    return paciente;
}

async function createMedico(userData){
    const { name, email, phone, crm, password } = userData;

    if (!name || name !== 'string' || name.trim() ===  ''){
        throw new Error('O nome do usuário é obrigatório e não deve ser uma string vazia.');
    }
    if (!email || email !== 'string' || !email.includes('@') || email.trim() ===  ''){
        throw new Error('O email do usuário é obrigatório e deve ter um formato de email válido.');
    }
    if (phone && (typeof phone !== 'string' || phone.trim().length < 9)){
        throw new Error('O telefone do usuário é obrigatório e deve ter no mínimo 9 dígitos');
    }
    if (crm && (typeof crm !== 'string' || crm.trim().length < 5)){
        throw new Error('O CRM é obrigatório e deve ter no mínimo 5 caracteres.');
    }
    if (!password || typeof password !== 'string' || password.length < 6){
        throw new Error('A senha do usuário é obrigatório e deve ter no mínimo 6 caracteres.');
        // Fazer criptografia da senha
    }
    

    const newMedico = await medicoRepository.createMedico({
        name: name,
        email: email,
        phone: phone,
        crm: crm,
        password: password
    });

    // Retorna o usuário criado sem a senha
    const { password: medicoPassword, ...medicoWithoutPassword } = newMedico;
    return medicoWithoutPassword;
}

async function getAllPacientes(){
    const pacientes = await medicoRepository.getAllPacientes();
    return pacientes;
}

module.exports = {
    findMedicoByCrm,
    getMedicoProfile,
    getPacienteByEmail,
    getAllPacientes,
    createMedico
}