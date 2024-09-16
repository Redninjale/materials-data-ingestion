import { sql } from 'db';

export const createReference = async (prompt, response, userId) => {
    return await sql`
        INSERT INTO Reference (prompt, response, userId)
        VALUES (${prompt}, ${response}, ${userId})
        RETURNING *;
    `;
};

export const getReferenceById = async (id) => {
    return await sql`
        SELECT * FROM Reference
        WHERE id = ${id};
    `;
};

export const updateReference = async (id, prompt, response) => {
    return await sql`
        UPDATE Reference
        SET prompt = ${prompt}, response = ${response}
        WHERE id = ${id}
        RETURNING *;
    `;
};

export const deleteReference = async (id) => {
    return await sql`
        DELETE FROM Reference
        WHERE id = ${id};
    `;
};

export const getReference = async (req, res) => {
    try {
        const { id } = req.params;
        const reference = await getReferenceById(id);
        if (reference.length === 0) {
            return res.status(404).json({ error: 'Reference not found' });
        }
        res.json(reference[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postReference = async (req, res) => {
    try {
        const { prompt, response, userId } = req.body;
        const newReference = await createReference(prompt, response, userId);
        res.status(201).json(newReference[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};