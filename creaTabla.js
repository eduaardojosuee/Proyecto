import Database from "better-sqlite3";
const db = new Database('mydb.sqlite3');

const query = `
CREATE TABLE alumnos (
    matricula INTEGER PRIMARY KEY,
    nombre STRING NOT NULL,
    apellido STRING NOT NULL,
    semestre INTEGER NOT NULL,
    carrera_id INTEGER NOT NULL,
    FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);

CREATE TABLE carreras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre STRING NOT NULL UNIQUE
);

CREATE TABLE materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre STRING NOT NULL UNIQUE,
    profesor STRING NOT NULL
);

CREATE TABLE calificaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    calificacion INTEGER NOT NULL,
    FOREIGN KEY (matricula) REFERENCES alumnos(matricula),
    FOREIGN KEY (materia_id) REFERENCES materias(id)
);
`;

db.exec(query);
db.close();
