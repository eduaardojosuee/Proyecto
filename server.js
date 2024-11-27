import express from "express"
import dotenv from 'dotenv'
import path from "path"
import { getAllAlumnos,insertAlumnos, deleteAlumno, buscarAlumno, updateAlumno } from "./model.alumnos.js";
import { getAllCalificaciones, insertCalificaciones, updateCalificacion, buscarCalificacion, deleteCalificacion, buscarPorMatricula } from "./model.calificaciones.js";
import { getAllMaterias, buscarMateria, insertMateria, deleteMateria, updateMateria, buscarMateriaPorNombre } from "./model.materias.js";
import { insertCarrera, getAllCarreras, updateCarrera, buscarCarrera, buscarCarreraPorNombre, deleteCarrera } from "./model.carrera.js";

dotenv.config() //cargar las variables de entorno del archivo .env en process.env
const PORT=process.env.PORT || 3000 //cargar el numeo de puerto
const mydb=process.env.SQLITE_DB || 'mydb.sqlite3'

const app=express()
//middleware para  procesar parametros url-encode
app.use(express.urlencoded({ extended: true }));
//middleware para  procesar parametros json
app.use(express.json())
//middleware para  procesar parametros text
app.use(express.text())
// Static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Obtener alumnos
app.get("/getAllAlumnos", (req, res) => {
  const resp = getAllAlumnos(mydb);
  res.set({ "content-type": "application/json" });
  res.send(JSON.stringify(resp));
});

// Insertar Alumnos
app.post("/insertAlumnos", (req, res) => {
  console.log(req.body);
  const datos = {
    matricula: req.body.matricula,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    semestre: req.body.semestre,
    carrera_id: req.body.carrera_id,
  };

  const resp = insertAlumnos(mydb, datos);
  const rjson = JSON.stringify(resp);
  console.log(rjson);
  res.set({ "content-type": "text/html; charset=utf-8" });
  res.send(
    `
        <h2>Respuesta de la inserción POST :${rjson}</h2>
        `
  );
});

// Borrar Alumno
app.delete("/deleteAlumno", (req, res) => {
  const matricula = req.query.matricula;
  if (!matricula) {
    res.status(400).send('Falta el parámetro "matricula".');
    return;
  }

  try {
    const result = deleteAlumno(mydb, matricula);
    if (result) {
      res
        .status(200)
        .send(`El alumno con matrícula ${matricula} ha sido eliminado.`);
    } else {
      res
        .status(404)
        .send(`No se encontró el alumno con matrícula ${matricula}.`);
    }
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Buscar Alumno
app.get("/buscarAlumno", (req, res) => {
  const matricula = req.query.matricula;
  if (!matricula) {
    return res.status(400).send('Falta el parámetro "matricula".');
  }

  try {
    const result = buscarAlumno(mydb, matricula);
    if (result) {
      // Si se encuentra el alumno, devolver los datos
      res.status(200).json(result);
    } else {
      // Si no se encuentra el alumno, enviar mensaje de error
      res
        .status(404)
        .send(`No se encontró el alumno con matrícula ${matricula}.`);
    }
  } catch (error) {
    console.error("Error al buscar alumno:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Actualizar Alumno
app.put("/updateAlumno", (req, res) => {
  const { matriculaOriginal, matricula, nombre, apellido, semestre, carrera } =
    req.body;

  if (
    !matriculaOriginal ||
    !matricula ||
    !nombre ||
    !apellido ||
    !semestre ||
    !carrera
  ) {
    res
      .status(400)
      .send(
        "Faltan datos obligatorios (matriculaOriginal, matricula, nombre, apellido, semestre, carrera)."
      );
    return;
  }

  try {
    const datos = {
      matricula,
      nombre,
      apellido,
      semestre,
      carrera_id: carrera,
    };
    const result = updateAlumno(mydb, matriculaOriginal, datos);

    if (result) {
      res
        .status(200)
        .send(
          `El alumno con matrícula ${matriculaOriginal} ha sido actualizado a la nueva matrícula ${matricula}.`
        );
    } else {
      res
        .status(404)
        .send(`No se encontró el alumno con matrícula ${matriculaOriginal}.`);
    }
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Obtener Calificaciones
app.get("/getAllCalificaciones", (req, res) => {
  const resp = getAllCalificaciones(mydb);
  res.set({ "content-type": "application/json" });
  res.send(JSON.stringify(resp));
});

// Insertar Calificaciones
app.post("/insertCalificaciones", (req, res) => {
  console.log(req.body);
  const datos = {
    matricula: req.body.matricula,
    materia_id: req.body.materia_id,
    calificacion: req.body.calificacion
  };

  try {
    const resp = insertCalificaciones(mydb, datos);
    const rjson = JSON.stringify(resp);
    console.log(rjson);
    res.set({ "content-type": "text/html; charset=utf-8" });
    res.send(`<h2>Respuesta de la inserción POST :${rjson}</h2>`);
  } catch (error) {
    console.error("Error al insertar calificacion:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Modificar calificaciones
app.put("/updateCalificacion", (req, res) => {
  const { id, matricula, materia_id, calificacion } = req.body;

  if (!id || !matricula || !materia_id || !calificacion) {
    res.status(400).send("Faltan datos obligatorios (id, nombre, profesor).");
    return;
  }

  try {
    const datos = { matricula, materia_id, calificacion  };
    const result = updateCalificacion(mydb, id, datos);

    if (result) {
      res.status(200).send(`La calificacion con ID ${id} ha sido actualizada.`);
    } else {
      res.status(404).send(`No se encontró la calificacion con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar calificacion:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Buscar calificacion por ID
app.get("/buscarCalificacion", (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('Falta el parámetro "id".');
  }

  try {
    const result = buscarCalificacion(mydb, id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send(`No se encontró la calificacion con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al buscar calificacion:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Buscar calificacion por matrícula
app.get("/buscarPorMatricula", (req, res) => {
  const matricula = req.query.matricula;

  try {
    const resultados = buscarPorMatricula(mydb, matricula);
    if (resultados.length === 0) {
      res.status(404).json({ error: "No se encontraron resultados." });
    } else {
      res.json(resultados); // Devuelve todos los registros como un array
    }
  } catch (error) {
    console.error("Error al buscar por matrícula:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Borra calificacion
app.delete("/deleteCalificacion", (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send('Falta el parámetro "id".');
    return;
  }

  try {
    const result = deleteCalificacion(mydb, id);
    if (result) {
      res.status(200).send(`La calificacion con ID ${id} ha sido eliminada.`);
    } else {
      res.status(404).send(`No se encontró la calificacion con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al eliminar calificacion:", error);
    res.status(500).send("Error interno del servidor.");
  }
});


// Obtener materias
app.get("/getAllMaterias", (req, res) => {
  try {
    const resp = getAllMaterias(mydb);
    res.set({ "content-type": "application/json" });
    res.send(JSON.stringify(resp));
  } catch (error) {
    console.error("Error al obtener las materias:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Insertar Materia
app.post("/insertMateria", (req, res) => {
  console.log(req.body);
  const datos = {
    nombre: req.body.nombre,
    profesor: req.body.profesor,
  };

  try {
    const resp = insertMateria(mydb, datos);
    const rjson = JSON.stringify(resp);
    console.log(rjson);
    res.set({ "content-type": "text/html; charset=utf-8" });
    res.send(`<h2>Respuesta de la inserción POST :${rjson}</h2>`);
  } catch (error) {
    console.error("Error al insertar materia:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Borrar Materia
app.delete("/deleteMateria", (req, res) => {
  const id = req.query.id;
  if (!id) {
    res.status(400).send('Falta el parámetro "id".');
    return;
  }

  try {
    const result = deleteMateria(mydb, id);
    if (result) {
      res.status(200).send(`La materia con ID ${id} ha sido eliminada.`);
    } else {
      res.status(404).send(`No se encontró la materia con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Buscar Materia
app.get("/buscarMateria", (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('Falta el parámetro "id".');
  }

  try {
    const result = buscarMateria(mydb, id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send(`No se encontró la materia con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al buscar materia:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Buscar materia por nombre
app.get("/buscarMateriaPorNombre", (req, res) => {
  const nombreMateria = req.query.nombreMateria;
  if (!nombreMateria) {
    return res.status(400).send('Falta el parámetro "nombreMateria".');
  }

  try {
    const result = buscarMateriaPorNombre(mydb, nombreMateria);
    if (result.length > 0) {
      // Si se encuentra alguna materia, devolver los datos
      res.status(200).json(result);
    } else {
      // Si no se encuentra ninguna materia, enviar mensaje de error
      res.status(404).send(`No se encontró ninguna materia con ese nombre.`);
    }
  } catch (error) {
    console.error("Error al buscar materia:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Actualizar Materia
app.put("/updateMateria", (req, res) => {
  const { id, nombre, profesor } = req.body;

  if (!id || !nombre || !profesor) {
    res.status(400).send("Faltan datos obligatorios (id, nombre, profesor).");
    return;
  }

  try {
    const datos = { nombre, profesor };
    const result = updateMateria(mydb, id, datos);

    if (result) {
      res.status(200).send(`La materia con ID ${id} ha sido actualizada.`);
    } else {
      res.status(404).send(`No se encontró la materia con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar materia:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

// Obtener Carreras
app.get("/getAllCarreras", (req, res) => {
    try {
      const resp = getAllCarreras(mydb);
      res.set({ "content-type": "application/json" });
      res.send(JSON.stringify(resp));
    } catch (error) {
      console.error("Error al obtener las carreras:", error);
      res.status(500).send("Error interno del servidor.");
    }
  });

// Insertar Carrera
app.post("/insertCarrera", (req, res) => {
    console.log(req.body);
    const datos = {
      nombre: req.body.nombre,
    };
  
    try {
      const resp = insertCarrera(mydb, datos);
      const rjson = JSON.stringify(resp);
      console.log(rjson);
      res.set({ "content-type": "text/html; charset=utf-8" });
      res.send(`<h2>Respuesta de la inserción POST :${rjson}</h2>`);
    } catch (error) {
      console.error("Error al insertar carrera:", error);
      res.status(500).send("Error interno del servidor.");
    }
  });

// Actualizar Carrera
app.put("/updateCarrera", (req, res) => {
    const { id, nombre } = req.body;
  
    if (!id || !nombre) {
      res.status(400).send("Faltan datos obligatorios (id, nombre).");
      return;
    }
  
    try {
      const datos = { nombre };
      const result = updateCarrera(mydb, id, datos);
  
      if (result) {
        res.status(200).send(`La carrera con ID ${id} ha sido actualizada.`);
      } else {
        res.status(404).send(`No se encontró la carrera con ID ${id}.`);
      }
    } catch (error) {
      console.error("Error al actualizar carrera:", error);
      res.status(500).send("Error interno del servidor.");
    }
  });

// Buscar Carrera
app.get("/buscarCarrera", (req, res) => {
    const id = req.query.id;
    if (!id) {
      return res.status(400).send('Falta el parámetro "id".');
    }
  
    try {
      const result = buscarCarrera(mydb, id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).send(`No se encontró la carrera con ID ${id}.`);
      }
    } catch (error) {
      console.error("Error al buscar carrera:", error);
      res.status(500).send("Error interno del servidor.");
    }
  });

// Buscar carrera por nombre
app.get("/buscarCarreraPorNombre", (req, res) => {
    const nombreCarrera = req.query.nombreCarrera;
    if (!nombreCarrera) {
      return res.status(400).send('Falta el parámetro "nombreCarrera".');
    }
  
    try {
      const result = buscarCarreraPorNombre(mydb, nombreCarrera);
      if (result.length > 0) {
        // Si se encuentra alguna carrera, devolver los datos
        res.status(200).json(result);
      } else {
        // Si no se encuentra ninguna carrera, enviar mensaje de error
        res.status(404).send(`No se encontró ninguna carrera con ese nombre.`);
      }
    } catch (error) {
      console.error("Error al buscar carrera:", error);
      res.status(500).send("Error interno del servidor.");
    }
  });

// Borrar Carrera
app.delete("/deleteCarrera", (req, res) => {
    const id = req.query.id;
    if (!id) {
      res.status(400).send('Falta el parámetro "id".');
      return;
    }
  
    try {
      const result = deleteCarrera(mydb, id);
      if (result) {
        res.status(200).send(`La carrera con ID ${id} ha sido eliminada.`);
      } else {
        res.status(404).send(`No se encontró la carrera con ID ${id}.`);
      }
    } catch (error) {
      console.error("Error al eliminar carrera:", error);
      res.status(500).send("Error interno del servidor.");
    }
  });

app.listen(PORT, () => {
  console.log(`iniciando express desde: http://localhost:${PORT}/`);
});