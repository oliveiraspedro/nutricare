const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwttConfig = require('../config/jwtConfig');
const medicoRepostory = require('../repositories/medicoRepository');
const pacienteRepostory = require('../repositories/pacienteRepository');

async function medicoRegister(name, email, phone, crm, password){
    // Verificar se o médico existe
    const existingMedico = await medicoRepostory.findMedicoByCrm(crm);
    if (existingMedico){
        throw new Error('Este CRM já está cadastrado!');
    }

    // Criar Hash da senha
    const salt = await bycrypt.genSalt(10)
    const password_hash = await bycrypt.hash(password, salt)

    // Criar médico no banco de dados
    const newMedico = { name, email, phone, crm, password_hash}
    const createMedico = await medicoRepostory.createMedico(newMedico);

    return {
        id: createMedico.id,
        name: createMedico.name,
        email: createMedico.email,
        phone: createMedico.phone,
        crm: createMedico.crm
    }
}

async function pacienteRegister(name, email, phone, password){
    // Verificar se o paciente já existe
    const existingPaciente = await pacienteRepostory.findPacienteByEmail(email);
    if (existingPaciente){
        throw new Error('Este email já está cadastrado!');
    }

    // Criar Hash da senha
    const salt = await bycrypt.genSalt(10)
    const password_hash = await bycrypt.hash(password, salt)

    // Criar paciente no banco de dados
    const newPaciente = { name, email, phone, password_hash}
    const createPaciente = await pacienteRepostory.createPaciente(newPaciente)

    return {
        id: createPaciente.id,
        name: createPaciente.name,
        email: createPaciente.email,
        phone: createPaciente.phone,
    }
}

async function medicoLogin(crm, password){
    const medico = await medicoRepostory.findMedicoByCrm(crm);
    if (!medico){
        throw new Error('CRM ou senha inválidos');
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bycrypt.compare(password, medico.password_hash);
    if (!isPasswordValid){
        throw new Error('CRM ou senha inválidos');
    }

    // Gerar token JWT
    const payload = {
        medico: {
            id: medico.id,
            name: medico.name,
            email: medico.email,
            phone: medico.phone,
            crm: medico.crm
        }
    };

    const token = jwt.sign(
        payload,
        jwttConfig.secret,
        {expiresIn: jwttConfig.expiresIn}
    );

    return token;
}

async function pacienteLogin(email, password){
    const paciente = await pacienteRepostory.findPacienteByEmail(email);    
    if (!paciente){
        throw new Error('Email ou senha inválidos');
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bycrypt.compare(password, paciente.password_hash);
    if (!isPasswordValid){
        throw new Error('Email ou senha inválidos');
    }

    // Gerar token JWT
    const payload = {
        paciente: {
            id: paciente.id,
            name: paciente.name,
            email: paciente.email,
            phone: paciente.phone
        }
    };

    const token = jwt.sign(
        payload,
        jwttConfig.secret,
        {expiresIn: jwttConfig.expiresIn}
    );

    return token;
}

module.exports = {
    medicoRegister,
    pacienteRegister,
    medicoLogin,
    pacienteLogin
}