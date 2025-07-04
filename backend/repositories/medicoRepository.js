const pool = require('../config/dbconfig')

async function findMedicoById(id){
    let connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone, crm FROM nutricionista WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    }catch (error) {
        console.error('Erro no medicoRepository.findMedicoById (via pool):', error);
        throw error;
    }  finally {
        if (connection) {
            connection.release();
        }
    }
}

async function findMedicoByCrm(crm){
    let connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT id, name, email, phone, crm, pwd FROM nutricionista WHERE crm = ?',
            [crm]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Erro no medicoRepository.findMedicoByCrm (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function createMedico(newMedico) {
    let connection = await pool.getConnection();
    try {
        
        const [result] = await connection.execute(
            'INSERT INTO nutricionista (name, email, phone, crm, pwd) VALUES (?, ?, ?, ?, ?)',
            [newMedico.name, newMedico.email, newMedico.phone, newMedico.crm, newMedico.pwd]
        );

        return {
            id: result.insertId,
            name: newMedico.name,
            email: newMedico.email,
            phone: newMedico.phone,
            crm: newMedico.crm
        }
        
        } catch (error) {
            // Verifica se o erro é de chave duplicada (crm único)
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este CRM já está registrado.');
            }
            console.error('Erro no medicoRepository.createMedico (via pool):', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
}

async function removeRefeicaoById(id){
    let connection = await pool.getConnection();
    try {
        const [affectedRows] = await connection.execute(
            'DELETE FROM refeicao WHERE id=?',
            [id]
        );

        return affectedRows;
        
    } catch (error) {
        console.error('Erro no medicoRepository.createMedico (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function getAllPacientesAssignWithMedico(medicoId){
    let connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            'SELECT * FROM paciente WHERE id_nutricionista=?',
            [medicoId]
        );

        return result;
        
    } catch (error) {
        console.error('Erro no medicoRepository.createMedico (via pool):', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    findMedicoById,
    findMedicoByCrm,
    createMedico,
    removeRefeicaoById,
    getAllPacientesAssignWithMedico
}