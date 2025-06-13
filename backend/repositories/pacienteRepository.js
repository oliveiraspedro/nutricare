const pool = require('../config/dbconfig')

async function findPacienteById(id){
    let connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone FROM paciente WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    } catch (error) {
        console.error('Erro no pacienteRepository.findPacienteById (via pool):', error);
        throw error;
    }
}

async function findPacienteByEmail(email){
    let connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone, pwd, id_nutricionista FROM paciente WHERE email = ?',
            [email]
        );

        return rows[0] || null;
    } catch (error) {
        console.error('Erro no pacienteRepository.findPacienteByEmail (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function createPaciente(newPaciente) {
    let connection = await pool.getConnection();
    try {
        
        const [result] = await connection.execute(
            'INSERT INTO paciente (name, email, phone, pwd, id_nutricionista) VALUES (?, ?, ?, ?, NULL)',
            [newPaciente.name, newPaciente.email, newPaciente.phone, newPaciente.pwd]
        );

        return {
            id: result.insertId,
            name: newPaciente.name,
            email: newPaciente.email,
            phone: newPaciente.phone
        }
        
    } catch (error) {
        // Verifica se o erro é de chave duplicada (email único)
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Este email já está registrado.');
        }
        console.error('Erro no pacienteRepository.createPaciente (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function assignExistingPatientToNutricionista(paciente, medicoId) {
    let connection = await pool.getConnection();
    try{
        const updateQuery = `
                UPDATE paciente
                SET id_nutricionista = ?
                WHERE id = ?
            `;
            const [result] = await connection.execute(updateQuery, [medicoId, paciente.id]);

            if (result.affectedRows === 0) {
                // Isso seria um caso raro aqui, pois já verificamos se o paciente existe
                const error = new Error('Falha ao atualizar o paciente. Nenhuma linha afetada.');
                error.statusCode = 500;
                throw error;
            }

            // 4. Buscar e retornar os dados completos do paciente atualizado
            const [updatedPatient] = await connection.execute('SELECT name, email, phone FROM paciente WHERE id = ?', [paciente.id]);
            return updatedPatient[0];
    } catch (error) {
        console.error('Erro no pacienteRepository.assignExistingPatientToNutricionista (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function deassignPatientFromNutricionista(medicoId) {
    let connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'UPDATE paciente SET id_nutricionista = NULL WHERE id_nutricionista = ?',
            [medicoId]
        );
        if (result.affectedRows === 0) {
            const error = new Error('Nenhum paciente encontrado ou já desvinculado.');
            error.statusCode = 404;
            throw error;
        }
        return result.affectedRows;
    } catch (error) {
        console.error('Erro no pacienteRepository.assignExistingPatientToNutricionista (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function addRefeicao(pacienteId, newMeal){
    let connection = await pool.getConnection();
    try {
        
        const [result] = await connection.execute(
            'INSERT INTO refeicao (tipo, horario_sugerido, id_paciente) VALUES (?, ?, ?)',
            [newMeal.food, newMeal.time, pacienteId]
        );

        return {
            id: result.insertId,
            tipo: newMeal.food,
            time: newMeal.time,
        }
        
        } catch (error) {
            // Verifica se o erro é de chave duplicada (email único)
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este email já está registrado.');
            }
            console.error('Erro no pacienteRepository.createPaciente (via pool):', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
}

async function addAlimentoByRefeicaoId(refeicaoId, foodToAdd){
    let connection = await pool.getConnection();
    try{
        console.log("------------------------------------------");
        console.log("Valores para INSERT:");
        console.log("  api_food_id:", foodToAdd.api_food_id, typeof foodToAdd.api_food_id);
        console.log("  name_alimento:", foodToAdd.name_alimento, typeof foodToAdd.name_alimento);
        console.log("  quantidade:", foodToAdd.quantity, typeof foodToAdd.quantity);
        console.log("  descricao_porcao:", foodToAdd.chosen_serving.measurement_description, typeof foodToAdd.chosen_serving.measurement_description);
        console.log("  calorias:", foodToAdd.calculated_nutrition?.calories, typeof foodToAdd.calculated_nutrition?.calories); // Use optional chaining para seguranca
        console.log("  proteinas:", foodToAdd.calculated_nutrition?.protein, typeof foodToAdd.calculated_nutrition?.protein);
        console.log("  carboidratos:", foodToAdd.calculated_nutrition?.carbohydrate, typeof foodToAdd.calculated_nutrition?.carbohydrate);
        console.log("  gorduras:", foodToAdd.calculated_nutrition?.fat, typeof foodToAdd.calculated_nutrition?.fat);
        console.log("  id_refeicao (FK):", refeicaoId, typeof refeicaoId);
        console.log("------------------------------------------");
        console.log("Inserindo alimento")
        
        const [result] = await connection.execute(
            'INSERT INTO alimento (api_food_id, name_alimento, quantidade, descricao_porcao, calorias, proteinas, carboidratos, gorduras, id_refeicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [foodToAdd.api_food_id, 
            foodToAdd.name_alimento, 
            foodToAdd.quantity, 
            foodToAdd.chosen_serving, 
            foodToAdd.calculated_nutrition.calories, 
            foodToAdd.calculated_nutrition.protein, 
            foodToAdd.calculated_nutrition.carbohydrate, 
            foodToAdd.calculated_nutrition.fat,
            refeicaoId]
        );

        console.log()

        console.log("Alimento adicionado!", result);
        return result;
    } catch (error) {
        console.error('Erro no pacienteRepository.createPaciente (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    findPacienteById,
    findPacienteByEmail,
    createPaciente,
    assignExistingPatientToNutricionista,
    deassignPatientFromNutricionista,
    addRefeicao,
    addAlimentoByRefeicaoId
}