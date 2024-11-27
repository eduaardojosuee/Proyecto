import Database from "better-sqlite3";
export function getAllAlumnos(mydb){
    const db = new Database(mydb)
    const query = "select * from alumnos;"
    const alumnos = db.prepare(query).all()
    db.close()
    return (alumnos)
}

export function buscarAlumno(mydb,matricula){
    const db = new Database(mydb)
    const query = "select * from alumnos where matricula=?;"
    const alumnos = db.prepare(query).get([matricula])
    db.close()
    return(alumnos)
}
/**
 * 
 * @param {*} mydb nombre del archivo de base de datos sqlite3
 * @param {*} datos
 * @returns 
 */
export function insertAlumnos(mydb,datos){
    const sql=`
    insert into alumnos(matricula,nombre,apellido,semestre,carrera_id) 
    values(@matricula,@nombre,@apellido,@semestre,@carrera_id)
    `
    const db = new Database(mydb)
    const insertData=db.prepare(sql)
    const resp=insertData.run(datos)
    db.close()
    return resp
}

export function deleteAlumno(mydb, matricula) {
    const db = new Database(mydb);
    try {
        // Elimina las calificaciones asociadas y luego el alumno
        const queryCalificaciones = "DELETE FROM calificaciones WHERE matricula = ?;";
        db.prepare(queryCalificaciones).run(matricula);

        const queryAlumno = "DELETE FROM alumnos WHERE matricula = ?;";
        const result = db.prepare(queryAlumno).run(matricula);

        db.close();
        return result.changes > 0; // Devuelve true si se eliminó al menos un registro
    } catch (error) {
        db.close();
        throw error;
    }
}

export function updateAlumno(mydb, matriculaOriginal, datos) {
    const db = new Database(mydb);
    try {
        const query = `
            UPDATE alumnos 
            SET matricula = @matricula, nombre = @nombre, apellido = @apellido, semestre = @semestre, carrera_id = @carrera_id
            WHERE matricula = @matriculaOriginal;
        `;

        const update = db.prepare(query);
        const result = update.run({
            ...datos,
            matriculaOriginal,
        });

        db.close();
        return result.changes > 0;
    } catch (error) {
        db.close();
        throw error;
    }
}
