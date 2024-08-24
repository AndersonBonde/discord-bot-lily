import 'dotenv/config';

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
	connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?ssl=true`,
});

export {
	pool,
};
