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
            'SELECT id, name, email, phone, pwd FROM paciente WHERE email = ?',
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
            'INSERT INTO paciente (name, email, phone, pwd) VALUES (?, ?, ?, ?)',
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
            const [updatedPatient] = await connection.execute('SELECT name, email, phone FROM paciente WHERE id = ?', [patient.id]);
            return updatedPatient[0];
    } catch (error) {
        console.error('Erro no medicoRepository.getPacienteByEmail (via pool):', error);
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
    assignExistingPatientToNutricionista
}