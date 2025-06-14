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

async function findPlanoByEmail(email) {
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Buscar o ID do paciente pelo email
        const [pacienteRows] = await connection.execute(
            'SELECT id FROM paciente WHERE email = ?',
            [email]
        );

        const paciente = pacienteRows[0];
        if (!paciente) {
            // Se o paciente não for encontrado, não há plano para ele
            return { exists: false }; 
        }
        const pacienteId = paciente.id;

        // 2. Contar as refeições para este paciente
        // COM OS NOMES CONFIRMADOS DO SEU BANCO DE DADOS
        const [refeicaoRows] = await connection.execute(
            'SELECT COUNT(*) as totalRefeicoes FROM refeicao WHERE id_paciente = ?', // <--- Estes nomes estão corretos AGORA
            [pacienteId]
        );

        const totalRefeicoes = refeicaoRows[0].totalRefeicoes;

        return { exists: totalRefeicoes > 0 };

    } catch (error) {
        console.error('Erro no pacienteRepository.findPlanoByEmail (via pool):', error);
        throw error; // É importante relançar o erro
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
            foodToAdd.chosen_serving.serving_description, 
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

async function getPlanoAlimentarCompleto(pacienteId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
            SELECT 
                r.id as refeicao_id, 
                r.tipo, 
                r.horario_sugerido,
                a.id as alimento_id, 
                a.api_food_id, 
                a.name_alimento, 
                a.quantidade, 
                a.descricao_porcao, 
                a.calorias, 
                a.proteinas, 
                a.carboidratos, 
                a.gorduras
            FROM refeicao r
            LEFT JOIN alimento a ON r.id = a.id_refeicao
            WHERE r.id_paciente = ?
            ORDER BY r.horario_sugerido, r.id;
        `;
        const [rows] = await connection.execute(query, [pacienteId]);
        
        // Estrutura os dados para o formato que o frontend espera (Meal[])
        const mealsMap = new Map();

        rows.forEach(row => {
            // Se a refeição ainda não está no nosso mapa, adiciona
            if (!mealsMap.has(row.refeicao_id)) {
                mealsMap.set(row.refeicao_id, {
                    id: row.refeicao_id,
                    time: row.horario_sugerido,
                    food: row.tipo, // O nome da refeição (Café da manhã, etc)
                    additionalAlimentos: "", // Pode ajustar se usar esse campo
                    foods: [] // Inicia a lista de alimentos vazia
                });
            }

            // Se a linha tem um alimento (não é um LEFT JOIN com resultado NULL)
            if (row.alimento_id) {
                const meal = mealsMap.get(row.refeicao_id);
                meal.foods.push({
                    id: row.alimento_id.toString(), // Garante que o ID é string
                    api_food_id: row.api_food_id,
                    name_alimento: row.name_alimento,
                    quantity: row.quantidade,
                    chosen_serving: { // Você precisa recriar essa estrutura
                        serving_id: '', // O ID da porção não está no banco, pode ser um ID genérico
                        serving_description: row.descricao_porcao,
                        metric_serving_unit: '', // não salvo no banco
                        metric_serving_amount: 0, // não salvo no banco
                        // outros campos podem ser deixados vazios ou com valores padrão
                    },
                    calculated_nutrition: {
                        calories: row.calorias,
                        protein: row.proteinas,
                        carbohydrate: row.carboidratos,
                        fat: row.gorduras,
                        fiber: 0 // não salvo no banco
                    }
                });
            }
        });

        // Converte o mapa de volta para um array
        return Array.from(mealsMap.values());

    } catch (error) {
        console.error('Erro no pacienteRepository.getPlanoAlimentarCompleto:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function updateRefeicao(refeicaoId, tipo, horario) {
  const connection = await pool.getConnection();
  try {
    const query = `
      UPDATE refeicao 
      SET tipo = ?, horario_sugerido = ? 
      WHERE id = ?;
    `;
    const [result] = await connection.execute(query, [tipo, horario, refeicaoId]);
    return result.affectedRows;
  } finally {
    if (connection) connection.release();
  }
}

async function removeAlimentoById(alimentoId) {
  const connection = await pool.getConnection();
  try {
    const query = 'DELETE FROM alimento WHERE id = ?';
    const [result] = await connection.execute(query, [alimentoId]);
    return result.affectedRows; // Retorna 1 se deletou, 0 se não encontrou
  } finally {
    if (connection) connection.release();
  }
}


module.exports = {
    findPacienteById,
    findPacienteByEmail,
    createPaciente,
    assignExistingPatientToNutricionista,
    deassignPatientFromNutricionista,
    addRefeicao,
    addAlimentoByRefeicaoId,
    getPlanoAlimentarCompleto,
    updateRefeicao,
    removeAlimentoById
}