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

async function checkPlanoExistencia(email) {
    try {
        const plano = await pacienteRepository.findPlanoByEmail(email);
        // Não converta para booleano aqui, retorne o objeto diretamente
        return plano; // Ele já será { exists: true } ou { exists: false }
    } catch (error) {
        console.error('Erro no service ao verificar existência do plano:', error);
        throw error;
    }
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

async function addRefeicao(pacienteEmail, newMeal){
    console.log("Email passado no repository: ", pacienteEmail);
    const paciente = await pacienteRepository.findPacienteByEmail(pacienteEmail);
    const meal = await pacienteRepository.addRefeicao(paciente.id, newMeal);

    return {
        id: meal.id,
        tipo: meal.tipo,
        time: meal.time
    };
}

async function addAlimento(refeicaoId, foodToAdd){
    // Não precisamos mais buscar o paciente aqui
    // A validação se a refeição pertence ao paciente certo pode ser feita, mas vamos simplificar por agora

    // O controller já nos dará o ID da refeição correta
    const result = await pacienteRepository.addAlimentoByRefeicaoId(refeicaoId, foodToAdd);
    return result;
}

async function getPlanoAlimentarCompleto(email) {
  try {
    // 1. Busca o paciente pelo email para obter o ID
    const paciente = await pacienteRepository.findPacienteByEmail(email);
    if (!paciente) {
      // Lança um erro que o controller vai capturar como "Não Encontrado" (404)
      const error = new Error('Paciente não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    // 2. Busca o plano alimentar completo usando o ID do paciente
    const plano = await pacienteRepository.getPlanoAlimentarCompleto(paciente.id);
    
    // Retorna o plano (pode ser uma lista vazia, o que é normal)
    // e também os dados do paciente para o frontend usar
    return {
        pacienteInfo: {
            id: paciente.id,
            name: paciente.name,
            email: paciente.email,
            phone: paciente.phone
        },
        meals: plano
    };

  } catch (error) {
    console.error('Erro no service ao buscar plano completo:', error);
    // Relança o erro para o controller lidar com a resposta HTTP
    throw error;
  }
}

async function updateRefeicao(refeicaoId, tipo, horario) {
  const affectedRows = await pacienteRepository.updateRefeicao(refeicaoId, tipo, horario);
  if (affectedRows === 0) {
    throw new Error('Refeição não encontrada ou nenhum dado foi alterado.');
  }
  return { message: 'Refeição atualizada com sucesso.' };
}

async function removeAlimento(alimentoId) {
  const affectedRows = await pacienteRepository.removeAlimentoById(alimentoId);
  if (affectedRows === 0) {
    throw new Error('Alimento não encontrado.');
  }
  return { message: 'Alimento removido com sucesso.' };
}

module.exports = {
    getPacienteById,
    getPacienteProfile,
    getPacienteByEmail,
    getDietaById,
    assignExistingPatientToNutricionista,
    deassignPatientFromNutricionista,
    addRefeicao,
    addAlimento,
    checkPlanoExistencia,
    getPlanoAlimentarCompleto,
    updateRefeicao,
    removeAlimento
}
