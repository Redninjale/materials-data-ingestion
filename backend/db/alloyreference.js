const db = require('./db');
const sql = db.sql;

const createAlloyReference = async (alloyId, referenceId, properties) => {
    try {
        await sql`
            INSERT INTO AlloyReference (alloyId, referenceId, properties)
            VALUES (${alloyId}, ${referenceId}, ${properties})
        `;
    } catch (error) {
        console.error('Error creating alloy reference:', error);
    }
};

const getAlloyReference = async (alloyId, referenceId) => {
    try {
        const result = await sql`
            SELECT * FROM AlloyReference
            WHERE alloyId = ${alloyId} AND referenceId = ${referenceId}
        `;
        return result;
    } catch (error) {
        console.error('Error fetching alloy reference:', error);
    }
};

const updateAlloyReference = async (alloyId, referenceId, properties) => {
    try {
        await sql`
            UPDATE AlloyReference
            SET properties = ${properties}
            WHERE alloyId = ${alloyId} AND referenceId = ${referenceId}
        `;
    } catch (error) {
        console.error('Error updating alloy reference:', error);
    }
};

const deleteAlloyReference = async (alloyId, referenceId) => {
    try {
        await sql`
            DELETE FROM AlloyReference
            WHERE alloyId = ${alloyId} AND referenceId = ${referenceId}
        `;
    } catch (error) {
        console.error('Error deleting alloy reference:', error);
    }
};

module.exports = {
    createAlloyReference,
    getAlloyReference,
    updateAlloyReference,
    deleteAlloyReference
};
