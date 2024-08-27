import { pool } from './pool.js';

async function getAllPowers() {
	const { rows } = await pool.query('SELECT * FROM powers');

	return rows;
};

async function getPowerByName(name) {
	const { rows } = await pool.query('SELECT * FROM power WHERE name = $1', [name]);

	return rows[0];
};

export {
	getAllPowers,
	getPowerByName,
};
