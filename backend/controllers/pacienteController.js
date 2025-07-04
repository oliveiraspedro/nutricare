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

async function getPacienteProfile(req, res) {
    try {
        const id = req.user?.paciente?.id;
        if (!id) {
            return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para pacientes.' });
        }
        const pacienteProfile = await pacienteService.getPacienteProfile(id);
        if (!pacienteProfile) {
            return res.status(404).json({ error: 'Perfil do paciente não encontrado' });
        }
        res.status(200).json({ pacienteProfile: pacienteProfile });
    } catch (error) {
        console.error('Erro no controller ao buscar perfil do paciente:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor', message: error.message });
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

async function assignExistingPatientToNutricionista(req, res){
    try {
        const email = req.body.email;
        const medicoId = req.body.medicoId;
        if (!email || !medicoId) {
            return res.status(400).json({message: 'Email e ID do médico são obrigatórios.'});
        }

        const paciente = await pacienteService.assignExistingPatientToNutricionista(email, medicoId);
        if (!paciente){
             return res.status(404).json({message: 'Paciente não encontrado'});
        }
        res.status(200).json({message: 'Paciente atribuído com sucesso!', paciente: paciente});
    } catch (error) {
        console.error('Erro no controller ao atribuir paciente:', error.message);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({message: error.message || 'Erro interno no servidor.'});
    }
}

async function deassignPatientFromNutricionista(req, res){
    try {
        const medicoId = req.body.medicoId;
        if (!medicoId) {
            return res.status(400).json({error: 'ID do médico é obrigatório.'});
        }
        const result = await pacienteService.deassignPatientFromNutricionista(medicoId);
        res.status(200).json({message: 'Paciente desvinculado com sucesso.', result: result});
    } catch (error) {
        console.error('Erro ao desvincular paciente:', error.message);
        res.status(500).json({error: 'Erro interno no servidor', message: error.message});
    }
}

async function checkPlanoExistencia(req, res){
    const {email} = req.params; // Correto
    
    try{
        const result = await pacienteService.checkPlanoExistencia(email); // Renomeei para 'result' para clareza
        
        // Agora, 'result' é { exists: true } ou { exists: false }
        res.json({ exists : result.exists }); // Acesse a propriedade 'exists' do objeto 'result'
    }catch(error){
        console.error('Erro no controller ao verificar existência do plano:', error);
        res.status(500).json({message: 'Erro interno do servidor ao verificar'})
    }
}

async function addRefeicao(req, res){
    try{
        const { newMeal, pacienteEmail } = req.body;

        // Salva a nova refeição
        const mealInfo = await pacienteService.addRefeicao(pacienteEmail, newMeal);
        
        // DEPOIS de salvar, busca e retorna o plano completo e atualizado
        const planoCompleto = await pacienteService.getPlanoAlimentarCompleto(pacienteEmail);
        
        res.status(201).json(planoCompleto);

    }catch(error){
        console.error({error: 'Erro no controle ao tentar cadastrar refeição: ', error})
        res.status(500).json({error: 'Erro interno no servidor', message: error.message});
    }
}

async function addAlimento(req, res){
    try{
        const { refeicaoId, foodToAdd } = req.body;
        // Precisamos do email do paciente. O ideal é que o frontend envie.
        // Se não, teríamos que buscar a refeição, depois o paciente...
        // Vamos assumir por agora que o frontend enviará o pacienteEmail também.
        const { pacienteEmail } = req.body;

        if (!refeicaoId || !foodToAdd || !pacienteEmail) {
            return res.status(400).json({ message: "ID da refeição, dados do alimento e email do paciente são obrigatórios." });
        }

        // Salva o novo alimento
        await pacienteService.addAlimento(refeicaoId, foodToAdd);

        // DEPOIS de salvar, busca e retorna o plano completo e atualizado
        const planoCompleto = await pacienteService.getPlanoAlimentarCompleto(pacienteEmail);

        res.status(201).json(planoCompleto);

    }catch(error){
        console.error({error: 'Erro no controle ao tentar cadastrar alimento: ', error})
        res.status(500).json({error: 'Erro interno no servidor', message: error.message});
    }
}

async function getPlanoAlimentar(req, res) {
  try {
    const { email } = req.params; // Pega o email da URL
    const planoCompleto = await pacienteService.getPlanoAlimentarCompleto(email);
    
    console.log("DADOS QUE SERÃO ENVIADOS PARA O FRONTEND:", JSON.stringify(planoCompleto, null, 2));

    res.status(200).json(planoCompleto);

  } catch (error) {
    console.error('Erro no controller ao buscar plano alimentar:', error);
    // Se o service lançou um erro com statusCode, usamos ele. Senão, 500.
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || 'Erro interno no servidor.' });
  }
}

async function updateRefeicao(req, res) {
  try {
    const { refeicaoId } = req.params;
    const { tipo, horario } = req.body;

    if (!tipo || !horario) {
      return res.status(400).json({ message: 'Tipo e horário são obrigatórios.' });
    }

    const result = await pacienteService.updateRefeicao(refeicaoId, tipo, horario);
    res.status(200).json(result);

  } catch (error) {
    console.error('Erro no controller ao atualizar refeição:', error);
    res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
  }
}

async function removeAlimento(req, res) {
  try {
    const { alimentoId } = req.params; // Pegamos o ID da URL

    const result = await pacienteService.removeAlimento(alimentoId);
    res.status(200).json(result);

  } catch (error) {
    console.error('Erro no controller ao remover alimento:', error);
    res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
  }
}

async function getMeuPlanoAlimentar(req, res) {
    try {
        const id = req.user?.paciente?.id;
        if (!id) {
            return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para pacientes.' });
        }
        const paciente = await pacienteService.getPacienteById(id);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente não encontrado.' });
        }
        const planoCompleto = await pacienteService.getPlanoAlimentarCompleto(paciente.email);
        res.status(200).json(planoCompleto);
    } catch (error) {
        console.error('Erro no controller ao buscar plano do próprio paciente:', error);
        res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
    }
}

async function getMinhaAvaliacaoRecente(req, res) {
    try {
        const id = req.user?.paciente?.id;
        if (!id) {
            return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para pacientes.' });
        }
        const avaliacao = await pacienteService.getAvaliacaoRecente(id);
        res.status(200).json(avaliacao || {});
    } catch (error) {
        console.error('Erro no controller ao buscar avaliação recente:', error);
        res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
    }
}

async function marcarRefeicaoComoConcluida(req, res) {
    try {
        const pacienteId = req.user?.paciente?.id;
        const { refeicaoId } = req.body;
        if (!pacienteId || !refeicaoId) {
            return res.status(400).json({ message: 'ID do paciente e da refeição são obrigatórios.' });
        }
        await pacienteService.marcarRefeicaoComoConcluida(pacienteId, refeicaoId);
        res.status(200).json({ message: 'Refeição marcada como concluída.' });
    } catch (error) {
        console.error('Erro no controller ao marcar refeição:', error);
        res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
    }
}

async function salvarAvaliacao(req, res) {
    try {
        const { pacienteId } = req.params;
        const dadosAvaliacao = req.body;

        if (!pacienteId || !dadosAvaliacao) {
            return res.status(400).json({ message: 'ID do paciente e dados da avaliação são obrigatórios.' });
        }
        await pacienteService.salvarAvaliacao(pacienteId, dadosAvaliacao);
        res.status(200).json({ message: 'Avaliação guardada com sucesso.' });
    } catch (error) {
        console.error('Erro no controller ao guardar avaliação:', error);
        res.status(500).json({ message: 'Erro interno ao guardar avaliação.', error: error.message });
    }
}

async function getAvaliacaoRecentePorMedico(req, res) {
    try {
        const { pacienteId } = req.params; // O ID do paciente vem da URL

        if (!pacienteId) {
            return res.status(400).json({ message: 'O ID do paciente é obrigatório.' });
        }
        
        const avaliacao = await pacienteService.getAvaliacaoRecente(pacienteId);
        
        // Retorna a avaliação ou um objeto vazio se não houver nenhuma
        res.status(200).json(avaliacao || {});

    } catch (error) {
        console.error('Erro no controller ao buscar avaliação pelo médico:', error);
        res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
    }
}

module.exports = {
    getPacienteById,
    getPacienteProfile,
    getPacienteByEmail,
    getDietaById,
    createPaciente,
    assignExistingPatientToNutricionista,
    deassignPatientFromNutricionista,
    addRefeicao,
    addAlimento,
    checkPlanoExistencia,
    getPlanoAlimentar,
    updateRefeicao,
    removeAlimento,
    getMeuPlanoAlimentar,
    getMinhaAvaliacaoRecente,
    marcarRefeicaoComoConcluida,
    salvarAvaliacao,
    getAvaliacaoRecentePorMedico
}