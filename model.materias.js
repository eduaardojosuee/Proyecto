import Database from "better-sqlite3";

export function getAllMaterias(mydb) {
  const db = new Database(mydb);
  const query = "SELECT * FROM materias;";
  const materias = db.prepare(query).all();
  db.close();
  return materias;
}

export function buscarMateria(mydb, id) {
  const db = new Database(mydb);
  const query = "SELECT * FROM materias WHERE id = ?;";
  const materia = db.prepare(query).get([id]);
  db.close();
  return materia;
}

export function buscarMateriaPorNombre(mydb, nombreMateria) {
  const db = new Database(mydb);
  const query = "SELECT * FROM materias WHERE nombre LIKE ?;";
  const materias = db.prepare(query).all([`%${nombreMateria}%`]); // LIKE para buscar por nombre parcial
  db.close();
  return materias; // Devuelve todas las materias que coincidan con el nombre dado
}

/**
 *
 * @param {*} mydb nombre del archivo de base de datos sqlite3
 * @param {*} datos
 * @returns
 */
export function insertMateria(mydb, datos) {
  const sql = `
    INSERT INTO materias(nombre, profesor) 
    VALUES(@nombre, @profesor)
    `;
  const db = new Database(mydb);
  const insertData = db.prepare(sql);
  const resp = insertData.run(datos);
  db.close();
  return resp;
}

export function deleteMateria(mydb, id) {
  const db = new Database(mydb);
  try {
    const query = "DELETE FROM materias WHERE id = ?;";
    const result = db.prepare(query).run(id);
    db.close();
    return result.changes > 0; // Devuelve true si se eliminó al menos un registro
  } catch (error) {
    db.close();
    throw error;
  }
}

export function updateMateria(mydb, id, datos) {
  const db = new Database(mydb);
  try {
    const query = `
            UPDATE materias 
            SET nombre = @nombre, profesor = @profesor
            WHERE id = @id;
        `;
    const update = db.prepare(query);
    const result = update.run({ ...datos, id });
    db.close();
    return result.changes > 0;
  } catch (error) {
    db.close();
    throw error;
  }
}
