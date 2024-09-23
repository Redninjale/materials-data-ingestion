const db = require('./db');
const sql = db.sql;

const createAlloyReference = async (alloyId, referenceId, properties) => {
    try {
        await sql`
            INSERT INTO AlloyReference (alloyId, referenceId, properties)
            VALUES (${alloyId}, ${referenceId}, ${properties})
            RETURNING *;
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

const getAlloyPropertiesByNames = async (alloyNames) => {
    const formattedAlloyNames = alloyNames.map(name => name.replace(/"/g, ''));
    try {
        const result = await sql`
            SELECT a.alloyName as name, ar.properties
            FROM Alloys a
            JOIN AlloyReference ar ON a.id = ar.alloyId
            WHERE a.alloyName = ANY(${alloyNames})
        `;
        return result;
    } catch (error) {
        console.error('Error fetching alloy properties by names:', error);
    }
};

module.exports = {
    getAlloyPropertiesByNames,
    createAlloyReference,
    getAlloyReference,
    updateAlloyReference,
    deleteAlloyReference
};
