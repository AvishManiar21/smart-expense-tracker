import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'expense_tracker'
});

try {
  await client.connect();
  console.log('✅ Successfully connected to PostgreSQL!');

  const res = await client.query('SELECT version()');
  console.log('Database version:', res.rows[0].version);

  await client.end();
  process.exit(0);
} catch (err) {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
}
