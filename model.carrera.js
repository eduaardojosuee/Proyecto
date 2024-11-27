import Database from "better-sqlite3";

export function getAllCarreras(mydb) {
  const db = new Database(mydb);
  const query = "SELECT * FROM carreras;";
  const carreras = db.prepare(query).all();
  db.close();
  return carreras;
}

export function buscarCarrera(mydb, id) {
  const db = new Database(mydb);
  const query = "SELECT * FROM carreras WHERE id = ?;";
  const carrera = db.prepare(query).get([id]);
  db.close();
  return carrera;
}

export function buscarCarreraPorNombre(mydb, nombreCarrera) {
  const db = new Database(mydb);
  const query = "SELECT * FROM carreras WHERE nombre LIKE ?;";
  const carreras = db.prepare(query).all([`%${nombreCarrera}%`]); // LIKE para buscar por nombre parcial
  db.close();
  return carreras; // Devuelve todas las carreras que coincidan con el nombre dado
}

/**
 *
 * @param {*} mydb nombre del archivo de base de datos sqlite3
 * @param {*} datos
 * @returns
 */
export function insertCarrera(mydb, datos) {
  const sql = `
    INSERT INTO carreras(nombre) 
    VALUES(@nombre)
    `;
  const db = new Database(mydb);
  const insertData = db.prepare(sql);
  const resp = insertData.run(datos);
  db.close();
  return resp;
}

export function deleteCarrera(mydb, id) {
  const db = new Database(mydb);
  try {
    const query = "DELETE FROM carreras WHERE id = ?;";
    const result = db.prepare(query).run(id);
    db.close();
    return result.changes > 0; // Devuelve true si se eliminó al menos un registro
  } catch (error) {
    db.close();
    throw error;
  }
}

export function updateCarrera(mydb, id, datos) {
  const db = new Database(mydb);
  try {
    const query = `
            UPDATE carreras 
            SET nombre = @nombre
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
