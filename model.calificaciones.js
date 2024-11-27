import Database from "better-sqlite3";
export function getAllCalificaciones(mydb){
    const db = new Database(mydb)
    const query = "select * from calificaciones;"
    const calificaciones = db.prepare(query).all()
    db.close()
    return (calificaciones)
}

export function buscarCalificacion(mydb, id) {
    const db = new Database(mydb);
    const query = "SELECT * FROM calificaciones WHERE id = ?;";
    const calificacion = db.prepare(query).get([id]);
    db.close();
    return calificacion;
  }

  export function buscarPorMatricula(mydb, matricula) {
    const db = new Database(mydb);
    const query = "SELECT * FROM calificaciones WHERE matricula = ?;";
    const calificaciones = db.prepare(query).all(matricula); // Devuelve todos los registros
    db.close();
    return calificaciones;
  }
/**
 * 
 * @param {*} mydb nombre del archivo de base de datos sqlite3
 * @param {*} datos
 * @returns 
 */
export function insertCalificaciones(mydb,datos){
    const sql=`
    INSERT INTO calificaciones(matricula,materia_id,calificacion) 
    VALUES(@matricula,@materia_id,@calificacion)
    `;
    const db = new Database(mydb)
    const insertData=db.prepare(sql)
    const resp=insertData.run(datos)
    db.close()
    return resp
}

export function deleteCalificacion(mydb, id) {
    const db = new Database(mydb);
    try {
      const query = "DELETE FROM calificaciones WHERE id = ?;";
      const result = db.prepare(query).run(id);
      db.close();
      return result.changes > 0; // Devuelve true si se eliminó al menos un registro
    } catch (error) {
      db.close();
      throw error;
    }
  }

export function updateCalificacion(mydb, id, datos) {
    const db = new Database(mydb);
    try {
      const query = `
              UPDATE calificaciones 
              SET matricula = @matricula, materia_id = @materia_id, calificacion = @calificacion
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