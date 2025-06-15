const pool = require('../config/dbconfig');

async function findPacienteById(id) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone FROM paciente WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    } finally {
        if (connection) connection.release();
    }
}

async function findPacienteByEmail(email) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone, pwd, id_nutricionista FROM paciente WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    } finally {
        if (connection) connection.release();
    }
}

async function createPaciente(newPaciente) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO paciente (name, email, phone, pwd, id_nutricionista) VALUES (?, ?, ?, ?, NULL)',
            [newPaciente.name, newPaciente.email, newPaciente.phone, newPaciente.pwd]
        );
        return {
            id: result.insertId,
            name: newPaciente.name,
            email: newPaciente.email,
            phone: newPaciente.phone
        };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Este email já está registrado.');
        }
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function assignPatientToNutricionista(pacienteId, medicoId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE paciente SET id_nutricionista = ? WHERE id = ?',
            [medicoId, pacienteId]
        );
        return result.affectedRows;
    } finally {
        if (connection) connection.release();
    }
}

async function deassignPatientFromNutricionista(pacienteId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE paciente SET id_nutricionista = NULL WHERE id = ?',
            [pacienteId]
        );
        return result.affectedRows;
    } finally {
        if (connection) connection.release();
    }
}

async function findPlanoByEmail(email) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [pacienteRows] = await connection.execute('SELECT id FROM paciente WHERE email = ?', [email]);
        if (!pacienteRows[0]) {
            return { exists: false };
        }
        const [refeicaoRows] = await connection.execute(
            'SELECT COUNT(*) as totalRefeicoes FROM refeicao WHERE id_paciente = ?',
            [pacienteRows[0].id]
        );
        return { exists: refeicaoRows[0].totalRefeicoes > 0 };
    } finally {
        if (connection) connection.release();
    }
}

async function getPlanoAlimentarCompleto(pacienteId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
            SELECT 
                r.id as refeicao_id, r.tipo, r.horario_sugerido,
                a.id as alimento_id, a.name_alimento, a.quantidade, 
                a.descricao_porcao, a.calorias, a.proteinas, a.carboidratos, a.gorduras,
                CASE WHEN d.id IS NOT NULL THEN true ELSE false END as concluida
            FROM refeicao r
            LEFT JOIN alimento a ON r.id = a.id_refeicao
            LEFT JOIN diario_refeicao d ON r.id = d.id_refeicao AND d.id_paciente = ? AND d.data_conclusao = CURDATE()
            WHERE r.id_paciente = ?
            ORDER BY r.horario_sugerido, r.id;
        `;
        const [rows] = await connection.execute(query, [pacienteId, pacienteId]);

        const mealsMap = new Map();
        for (const row of rows) {
            if (!mealsMap.has(row.refeicao_id)) {
                mealsMap.set(row.refeicao_id, {
                    id: row.refeicao_id,
                    tipo: row.tipo,
                    horario_sugerido: row.horario_sugerido,
                    concluida: !!row.concluida,
                    foods: []
                });
            }
            if (row.alimento_id) {
                mealsMap.get(row.refeicao_id).foods.push({
                    id: row.alimento_id.toString(),
                    name_alimento: row.name_alimento,
                    quantity: row.quantidade,
                    chosen_serving: { serving_description: row.descricao_porcao },
                    calculated_nutrition: {
                        calories: row.calorias,
                        protein: row.proteinas,
                        carbohydrate: row.carboidratos,
                        fat: row.gorduras
                    }
                });
            }
        }
        return Array.from(mealsMap.values());
    } finally {
        if (connection) connection.release();
    }
}

async function addRefeicao(pacienteId, newMeal) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO refeicao (tipo, horario_sugerido, id_paciente) VALUES (?, ?, ?)',
            [newMeal.food, newMeal.time, pacienteId]
        );
        return { id: result.insertId, tipo: newMeal.food, time: newMeal.time };
    } finally {
        if (connection) connection.release();
    }
}

async function updateRefeicao(refeicaoId, tipo, horario) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE refeicao SET tipo = ?, horario_sugerido = ? WHERE id = ?',
            [tipo, horario, refeicaoId]
        );
        return result.affectedRows;
    } finally {
        if (connection) connection.release();
    }
}

async function removeRefeicaoById(refeicaoId) {
    let connection;
    try {
        connection = await pool.getConnection();
        // Deletar em cascata no banco de dados é uma opção melhor, mas por segurança, deletamos os alimentos primeiro.
        await connection.execute('DELETE FROM alimento WHERE id_refeicao = ?', [refeicaoId]);
        const [result] = await connection.execute('DELETE FROM refeicao WHERE id = ?', [refeicaoId]);
        return result.affectedRows;
    } finally {
        if (connection) connection.release();
    }
}

async function addAlimentoByRefeicaoId(refeicaoId, foodToAdd) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO alimento (api_food_id, name_alimento, quantidade, descricao_porcao, calorias, proteinas, carboidratos, gorduras, id_refeicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                foodToAdd.api_food_id,
                foodToAdd.name_alimento,
                foodToAdd.quantity,
                foodToAdd.chosen_serving.serving_description,
                foodToAdd.calculated_nutrition.calories,
                foodToAdd.calculated_nutrition.protein,
                foodToAdd.calculated_nutrition.carbohydrate,
                foodToAdd.calculated_nutrition.fat,
                refeicaoId
            ]
        );
        return result;
    } finally {
        if (connection) connection.release();
    }
}

async function removeAlimentoById(alimentoId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute('DELETE FROM alimento WHERE id = ?', [alimentoId]);
        return result.affectedRows;
    } finally {
        if (connection) connection.release();
    }
}

async function findAvaliacaoRecenteByPacienteId(pacienteId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            `SELECT peso, altura, circunferencia, data_avaliacao as dataAvaliacao, observacoes 
             FROM avaliacao WHERE id_paciente = ? ORDER BY data_avaliacao DESC LIMIT 1`,
            [pacienteId]
        );
        return rows[0] || null;
    } finally {
        if (connection) connection.release();
    }
}

async function criarRegistroDiario(pacienteId, refeicaoId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT IGNORE INTO diario_refeicao (id_paciente, id_refeicao, data_conclusao) VALUES (?, ?, CURDATE())',
            [pacienteId, refeicaoId]
        );
        return result.insertId;
    } finally {
        if (connection) connection.release();
    }
}

async function salvarAvaliacao(pacienteId, dados) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            'SELECT id FROM avaliacao WHERE id_paciente = ? AND data_avaliacao = ?',
            [pacienteId, dados.dataAvaliacao]
        );

        if (rows.length > 0) {
            await connection.execute(
                'UPDATE avaliacao SET peso = ?, altura = ?, circunferencia = ?, observacoes = ? WHERE id = ?',
                [dados.peso || null, dados.altura || null, dados.circunferencia || null, dados.observacoes || '', rows[0].id]
            );
        } else {
            await connection.execute(
                'INSERT INTO avaliacao (id_paciente, data_avaliacao, peso, altura, circunferencia, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
                [pacienteId, dados.dataAvaliacao, dados.peso || null, dados.altura || null, dados.circunferencia || null, dados.observacoes || '']
            );
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    findPacienteById,
    findPacienteByEmail,
    createPaciente,
    assignPatientToNutricionista,
    deassignPatientFromNutricionista,
    findPlanoByEmail,
    getPlanoAlimentarCompleto,
    addRefeicao,
    updateRefeicao,
    removeRefeicaoById,
    addAlimentoByRefeicaoId,
    removeAlimentoById,
    findAvaliacaoRecenteByPacienteId,
    criarRegistroDiario,
    salvarAvaliacao,
};