import { Db, MongoClient, OptionalId } from 'mongodb';

const validateMongoDbUri = (uri: string) => {
  const stringForEvaluateUriFound = [
    'localhost',
    '127.0.0.1',
    'mongodb://',
  ].find((string) => uri.includes(string));
  const forbiddenStrings = ['mongodb.net'].find((string) =>
    uri.includes(string),
  );
  if (!stringForEvaluateUriFound || forbiddenStrings) {
    throw new Error(
      `No se pudo ejecutar el prepare de la base de datos. La variable de entorno '${uri}' no está apuntado a un ambiente local!`,
    );
  }
  const validDbConection = ['localhost', '127.0.0.1', '27017'].some((substr) =>
    uri.includes(substr),
  );
  if (!validDbConection) {
    throw new Error('Usa una conexión segura a Mongo para los tests!!!!');
  }
  return 'ok';
};

const updateDatabaseDocuments = async (
  db: Db,
  documents: Record<string, readonly OptionalId<Document>[]>,
) => {
  for (const collectionName of Object.keys(documents)) {
    await db.collection(collectionName).deleteMany({});
    if (documents[collectionName].length > 0) {
      await db.collection(collectionName).insertMany(documents[collectionName]);
    }
  }
};

const run = async (documents: Record<string, any>) => {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb://admin:password123@localhost:27017/airline?authSource=admin';
  validateMongoDbUri(MONGODB_URI);
  console.log(`Conectando a Mongo en ${MONGODB_URI}`);
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db('airline');
  console.log('Cargando documentos');
  await updateDatabaseDocuments(db, documents);
  console.log('Base de datos preparada, cerrando conexión');
  await client.close();
};

export default { run };
