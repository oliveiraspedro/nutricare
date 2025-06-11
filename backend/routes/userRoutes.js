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

router.post('/fatsecret/token', fatsecretController.getFatSecretToken);
router.post('/fatsecret/search', fatsecretController.searchFoods);

//router.post('/forgot-password', authController.forgotPassword);
//router.post('/reset-password', authController.resetPassword);
//router.put('/change-password', authMiddleware, authController.changePassword);
//router.post('/auth/logout', authMiddleware, authController.logout);


// -------- GET --------S
router.get('/medico/profile', authMiddleware, medicoController.getMedicoProfile);
//router.get('/medico/pacientes', authMiddleware, medicoController.findAllPacientes);
//router.get('/medico/pacientes/:pacienteId/plano', authMiddleware, medicoController.getPlanoByPaciente);

router.get('/paciente/profile', authMiddleware, pacienteController.getPacienteProfile);
// router.get('/paciente/:id', authMiddleware, pacienteController.findPacienteById);
// router.get('/paciente/:id/plano', authMiddleware, pacienteController.findPlanoByPaciente);

// FatSecret Token
router.get('/fatsecret/token', fatsecretController.getFatSecretToken);

// -------- POST --------
// router.post('/medico/:pacienteId/plano', authMiddleware, medicoController.createPlanoAlimentar);
// router.post('/medico/adicionar-paciente', authMiddleware, medicoController.adicionarPaciente);

// -------- PUT --------
router.put('/medico/pacientes/:email', authMiddleware, pacienteController.assignExistingPatientToNutricionista);
// router.put('/medico/:pacienteId/plano', authMiddleware, medicoController.updatePlanoAlimentar);


// -------- DELETE --------
// router.delete('/medico/plano/:planoId', authMiddleware, medicoController.deletePlanoAlimentar);
// router.delete('/medico/:id', authMiddleware, medicoController.removePacienteById);



module.exports = router;