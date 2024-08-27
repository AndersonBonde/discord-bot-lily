import { pool } from './pool.js';

async function getAllPowers() {
	const { rows } = await pool.query('SELECT * FROM powers');

	return rows;
};

async function getPower(index) {
	const { rows } = await pool.query('SELECT * FROM power WHERE index = $1', [index]);

	return rows[0];
};

export {
	getAllPowers,
	getPower,
};
