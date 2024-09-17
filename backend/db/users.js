const db = require('./db');
const sql = db.sql;

// Create a new user
const createUser = async (name) => {
    try {
        const result = await sql`
            INSERT INTO users (name)
            VALUES (${name})
            RETURNING *;
        `;
        return result[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Read a user by ID
const getUserById = async (id) => {
    try {
        const result = await sql`
            SELECT * FROM users
            WHERE id = ${id};
        `;
        return result[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Get the first user
const getFirstUser = async () => {
    try {
        const result = await sql`
            SELECT * FROM users
            ORDER BY id
            LIMIT 1;
        `;
        return result[0];
    } catch (error) {
        console.error('Error fetching first user:', error);
        throw error;
    }
};

// Update a user by ID
const updateUserById = async (id, name) => {
    try {
        const result = await sql`
            UPDATE users
            SET name = ${name}
            WHERE id = ${id}
            RETURNING *;
        `;
        return result[0];
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete a user by ID
const deleteUserById = async (id) => {
    try {
        const result = await sql`
            DELETE FROM users
            WHERE id = ${id}
            RETURNING *;
        `;
        return result[0];
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

module.exports = {
    getFirstUser,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
};