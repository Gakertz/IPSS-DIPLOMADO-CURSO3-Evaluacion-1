// ─────────────────────────────────────────────────────────────────────────────
// Evaluación 1 · API del Mundial 2026
// Diplomado IPS · Módulo 3 — Backend y APIs REST
//
// Este es tu punto de partida. Los DATOS ya están (datos-mundial.js): el resto
// lo escribes tú.
//
// ANTES DE EMPEZAR — instala lo que necesites. Por ejemplo:
//     npm install express
//     npm install cors
//
// Para levantar el servidor:
//     npm run dev        (se reinicia solo al guardar)
// ─────────────────────────────────────────────────────────────────────────────
// TODO: importa express y crea tu app.
//
    import express from 'express'
    import cors from 'cors'
    import {continentes,grupos,selecciones,partidos} from './datos-mundial.js'
    const app = express()
// Recuerda el middleware que hace falta para leer el cuerpo de los POST,
// y configura CORS (lo vas a necesitar para el video).
    const PORT = 3000
    app.use(cors())
    app.use(express.json())
    function normalizarTexto(texto) {
        return texto
            .toString()
            .toLowerCase()
            .trim()
        }
// ─────────────────────────────────────────────────────────────────────────────
// TUS RUTAS
//
// Este es el mapa de lo que tienes que construir. El detalle completo de cada
// una (qué recibe, qué devuelve, qué status) está en el enunciado: léelo.
//
//   ── Con lógica ⭐ ──────────────────────────────────────────────────────────
//   GET  /api/estadisticas                    resumen del torneo         (vale 2%)
//
//   ── Semifinales y final ⭐ ─────────────────────────────────────────────────
//   POST /api/worldcup/2026/semifinals/:n     registra la semifinal n (1 a 4)
//   GET  /api/worldcup/2026/semifinals/:n     el resultado de la semifinal n
//   GET  /api/worldcup/2026/semifinals        las cuatro
//   POST /api/worldcup/2026/final             registra la final
//   GET  /api/worldcup/2026/final             la final, con su ganador
//
// Ojo: /semifinals/:n es UNA ruta, no cuatro.
// ─────────────────────────────────────────────────────────────────────────────
    app.get('/', (req, res) => {
    res.status(200).json({
        nombre: 'API Mundial 2026',
        estado: 'activa',
    })
    })
// Ejemplo para que veas el formato. Bórralo o quédatelo, como prefieras:
    app.get('/api/selecciones', (req, res) => {
        const { continente, campeon } = req.query
        let resultado = selecciones
        if (continente) {
            const continenteEncontrado = continentes.find(
            (item) =>
                normalizarTexto(item.nombre) ===
                normalizarTexto(continente),
            )
            if (!continenteEncontrado) {
            return res.status(404).json({
                error: `No existe el continente ${continente}`,
            })
            }
            resultado = resultado.filter(
            (seleccion) =>
                seleccion.continenteId === continenteEncontrado.id,
            )
        }
        if (campeon !== undefined) {
            if (campeon !== 'true' && campeon !== 'false') {
                return res.status(400).json({
                error: 'El parámetro campeon debe ser true o false',
                })
            }
            const esCampeon = campeon === 'true'
            resultado = resultado.filter(
                (seleccion) =>
                (seleccion.copas.length > 0) === esCampeon,
            )
        }
    res.status(200).json(resultado)
    })
// A partir de aquí, es tuyo. 🚀
    app.get('/api/selecciones/:id', (req, res) => {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
            error: 'El id debe ser un número entero positivo',
            })
        }
        const seleccionEncontrada = selecciones.find(
            (seleccion) => seleccion.id === id,
        )
        if (!seleccionEncontrada) {
            return res.status(404).json({
            error: `No existe una selección con el id ${id}`,
            })
        }
        res.status(200).json(seleccionEncontrada)
    })
    app.get('/api/copas', (req, res) => {
        const todasLasCopas = selecciones.flatMap(
            (seleccion) => seleccion.copas,
        )
        res.status(200).json(todasLasCopas)
    })
    app.get('/api/copas/:seleccion', (req, res) => {
        const nombreBuscado = normalizarTexto(
            req.params.seleccion,
        )
        const seleccionEncontrada = selecciones.find(
            (seleccion) =>
            normalizarTexto(seleccion.nombre) === nombreBuscado,
        )
        if (!seleccionEncontrada) {
            return res.status(404).json({
            error: `No existe la selección ${req.params.seleccion}`,
            })
        }
        res.status(200).json(seleccionEncontrada.copas)
    })
    app.post('/api/worldcup/2026/semifinals/:n', (req, res) => {
        const numeroSemifinal = Number(req.params.n)
        const { local, visita } = req.body
        const idLocal = Number(local.seleccionId)
        const idVisita = Number(visita.seleccionId)
        const seleccionLocal = selecciones.find(
            (seleccion) => seleccion.id === idLocal,
        )
        const seleccionVisita = selecciones.find(
            (seleccion) => seleccion.id === idVisita,
        )
        if (!seleccionLocal || !seleccionVisita) {
            return res.status(404).json({
            error: 'Alguna de las seleccione no existe',
            })
        }
        if (idLocal === idVisita) {
            return res.status(400).json({
            error: 'Una selección no puede jugar contra sí misma',
            })
        }
        const nuevaSemifinal = {numero: numeroSemifinal,
            local: {
            seleccionId: idLocal,
            goles: local.goles
            },
            visita: {
            seleccionId: idVisita,
            goles: visita.goles
            },
        }
        const existente = partidos.semifinales.findIndex(
            (semifinal) => semifinal.numero === numeroSemifinal,
        )
        if (existente >= 0) {
            partidos.semifinales[indiceExistente] = nuevaSemifinal
            return res.status(200).json(nuevaSemifinal)
        }
        partidos.semifinales.push(nuevaSemifinal)
        res.status(201).json(nuevaSemifinal)
    })
// TODO: levanta el servidor.
    app.listen(PORT, () => {
    console.log(`⚽ API del Mundial escuchando en http://localhost:${PORT}`)
    })
