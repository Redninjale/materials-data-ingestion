const db = require('./db');
const sql = db.sql;

async function insertAlloy(name) {
    return await sql`INSERT INTO Alloys (alloyName) VALUES (${name}) RETURNING *`;
}

async function updateAlloy(id, name) {
    return await sql`UPDATE Alloys SET alloyName = ${name} WHERE id = ${id}`;
}

async function deleteAlloy(id) {
    return await sql`DELETE FROM Alloys WHERE id = ${id}`;
}

async function searchAlloysByName(name) {
    return await sql`SELECT * FROM Alloys WHERE alloyName ILIKE ${'%' + name + '%'}`;
}

async function getAlloys() {
    return await sql`SELECT alloyname FROM Alloys`;
}

async function postAlloy(req, res) {
    try {
        const result = await alloy.insertAlloy(req.query.name);
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    insertAlloy,
    updateAlloy,
    deleteAlloy,
    searchAlloysByName,
    getAlloys,
    postAlloy
};
