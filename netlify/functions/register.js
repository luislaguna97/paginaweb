const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { nombre, email, contrasena } = JSON.parse(event.body);
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('nombre_de_tu_db');
    const users = database.collection('users');
    const newUser = { nombre, email, contrasena };
    await users.insertOne(newUser);
    return { statusCode: 200, body: 'Usuario registrado' };
  } catch (error) {
    return { statusCode: 500, body: `Error: ${error.message}` };
  } finally {
    await client.close();
  }
};
