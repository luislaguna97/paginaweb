const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { usuario, contrasena } = JSON.parse(event.body);
  
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('cluster0');
    const users = database.collection('users');
    const user = await users.findOne({ email:usuario, contrasena });
    if (user) {
      return { statusCode: 200, body:JSON.stringify({ message: 'Inicio de sesión exitoso' }), };
    } else {
      return { statusCode: 401, body: 'Usuario o contraseña incorrectos' };
    }
  } catch (error) {
    return { statusCode: 500, body: `Error: ${error.message}` };
  } finally {
    await client.close();
  }
};
