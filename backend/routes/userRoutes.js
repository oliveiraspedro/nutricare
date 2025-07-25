const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const medicoController = require('../controllers/medicoController')
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth.middleware');

const fatsecretController = require('../controllers/fatsecretController');

// Auth
router.post('/login/medico', authController.medicoLogin);
router.post('/login/paciente', authController.pacienteLogin);
router.post('/register/medico', authController.medicoRegister);
router.post('/register/paciente', authController.pacienteRegister);

//router.post('/fatsecret/token', fatsecretController.getFatSecretToken);
router.post('/fatsecret/search', fatsecretController.searchFoods);
router.post('/fatsecret/getFoodDetails', fatsecretController.getFoodDetails);

//router.post('/forgot-password', authController.forgotPassword);
//router.post('/reset-password', authController.resetPassword);
//router.put('/change-password', authMiddleware, authController.changePassword);
//router.post('/auth/logout', authMiddleware, authController.logout);


// -------- GET --------S
router.get('/medico/profile', authMiddleware, medicoController.getMedicoProfile);
router.get('/medico/pacientes/:medicoId', authMiddleware, medicoController.getAllPacientesAssignWithMedico);

router.get('/paciente/profile', authMiddleware, pacienteController.getPacienteProfile);
// router.get('/paciente/:id', authMiddleware, pacienteController.findPacienteById);
// router.get('/paciente/:id/plano', authMiddleware, pacienteController.findPlanoByPaciente);

router.get('/paciente/meu-plano', authMiddleware, pacienteController.getMeuPlanoAlimentar);
router.get('/paciente/minha-avaliacao-recente', authMiddleware, pacienteController.getMinhaAvaliacaoRecente);
router.get('/pacientes/:email/plano-alimentar', authMiddleware, pacienteController.getPlanoAlimentar);
router.get('/pacientes/:email/plano-existe', authMiddleware, pacienteController.checkPlanoExistencia);

router.get('/avaliacoes/:pacienteId', authMiddleware, pacienteController.getAvaliacaoRecentePorMedico);

// FatSecret Token
router.get('/fatsecret/token', fatsecretController.getFatSecretToken);

// -------- POST --------
router.post('/medico/pacientes/addRefeicao', authMiddleware, pacienteController.addRefeicao);
router.post('/medico/plano-alimentar', authMiddleware, pacienteController.addAlimento);

router.post('/paciente/diario/concluir', authMiddleware, pacienteController.marcarRefeicaoComoConcluida);

// -------- PUT --------
router.put('/medico/pacientes/assignPaciente', authMiddleware, pacienteController.assignExistingPatientToNutricionista);
router.put('/medico/pacientes/deassignPaciente', authMiddleware, pacienteController.deassignPatientFromNutricionista);
// router.put('/medico/:pacienteId/plano', authMiddleware, medicoController.updatePlanoAlimentar);

router.put('/avaliacoes/:pacienteId', authMiddleware, pacienteController.salvarAvaliacao);

router.put('/refeicoes/:refeicaoId', authMiddleware, pacienteController.updateRefeicao);

// -------- DELETE --------
router.delete('/medico/pacientes/removeRefeicao', authMiddleware, medicoController.removeRefeicaoById);

router.delete('/alimentos/:alimentoId', authMiddleware, pacienteController.removeAlimento);


module.exports = router;