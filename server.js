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
//   GET  /api/worldcup/2026/semifinals/:n     el resultado de la semifinal n
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
        if (
            !Number.isInteger(numeroSemifinal) ||
            numeroSemifinal < 1 || numeroSemifinal > 4
        )
        {  return res.status(400).json({
            error: 'El número de semifinal debe estar entre 1 y 4',
            })
        }
        const { local, visita } = req.body
        if (!local || !visita) {
            return res.status(400).json({
            error: 'Debe ingresar las selecciones según local y visita',
            })
        }
        const idLocal = Number(local.seleccionId)
        const idVisita = Number(visita.seleccionId)
        if (
            !Number.isInteger(idLocal) ||
            !Number.isInteger(idVisita)
        )
        {   return res.status(400).json({
            error: 'Los identificadores de las selecciones deben ser números',
            })
        }
        const Local = selecciones.find(
            (seleccion) => seleccion.id === idLocal,
        )
        const Visita = selecciones.find(
            (seleccion) => seleccion.id === idVisita,
        )
        if (!Local || !Visita) {
            return res.status(404).json({
            error: 'Alguna de las seleccione no existe',
            })
        }
        if (idLocal === idVisita) {
            return res.status(400).json({
            error: 'Una selección no puede jugar contra sí misma',
            })
        }
        if (
            !Number.isInteger(local.goles) ||
            !Number.isInteger(visita.goles) ||
            local.goles < 0 || visita.goles < 0
        )
        {   return res.status(400).json({
            error: 'La cantidad de goles debe ser números iguales o mayores que cero',
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
            partidos.semifinales[existente] = nuevaSemifinal
            return res.status(200).json(nuevaSemifinal)
        }
        partidos.semifinales.push(nuevaSemifinal)
        res.status(201).json(nuevaSemifinal)
    })
    app.get('/api/worldcup/2026/semifinals/:n', (req, res) => {
        const numeroSemifinal = Number(req.params.n)
        if (!Number.isInteger(numeroSemifinal) || numeroSemifinal < 1 || numeroSemifinal > 4) 
        {   return res.status(400).json({
            error: 'El número de semifinal debe estar entre 1 y 4',
            })
        }
        const semifinalEncontrada = partidos.semifinales.find
        ((semifinal) => semifinal.numero === numeroSemifinal)
        if (!semifinalEncontrada) {
            return res.status(404).json({error: 'esta semifinal aún no ha sido registrada'})
        }
        const Local = selecciones.find(
            (seleccion) => seleccion.id === semifinalEncontrada.local.seleccionId
        )
        const Visita = selecciones.find(
            (seleccion) => seleccion.id === semifinalEncontrada.visita.seleccionId
        )
        let ganador
        if (semifinalEncontrada.local.goles > semifinalEncontrada.visita.goles)
        {   ganador = Local.nombre
        }
        else if (semifinalEncontrada.visita.goles > semifinalEncontrada.local.goles)
        {   ganador = Visita.nombre
        }
        else {
            ganador = 'Empate'
        }
        res.status(200).json({
            numero: numeroSemifinal,
            local: 
            {seleccion: Local.nombre,
            goles: semifinalEncontrada.local.goles}
            ,visita: 
            {seleccion: Visita.nombre,
            goles: semifinalEncontrada.visita.goles},
            ganador: ganador
        })
    })
    app.get('/api/worldcup/2026/semifinals', (req, res) => {
        const listaSemifinales = [1, 2, 3, 4].map((numero) => {
            const semifinalEncontrada = partidos.semifinales.find(
                (semifinal) =>
                semifinal.numero === numero
            )
            if (!semifinalEncontrada) {
                return null
            }
            const Local = selecciones.find(
                (seleccion) =>
                seleccion.id === semifinalEncontrada.local.seleccionId
            )
            const Visita = selecciones.find(
                (seleccion) =>
                seleccion.id === semifinalEncontrada.visita.seleccionId
            )
            let ganador
            if (semifinalEncontrada.local.goles > semifinalEncontrada.visita.goles)
            {   ganador = Local.nombre
            }
            else if (semifinalEncontrada.visita.goles > semifinalEncontrada.local.goles)
            {   ganador = Visita.nombre
            }
            else {
                ganador = 'Empate'
            }
            return {
                numero: `semifinal ${numero}`,
                local: {
                seleccion: Local.nombre,
                goles: semifinalEncontrada.local.goles
                },
                visita: {
                seleccion: Visita.nombre,
                goles: semifinalEncontrada.visita.goles
                },
                ganador: ganador
            }
        })
        res.status(200).json(listaSemifinales)
    })
    app.post('/api/worldcup/2026/final', (req, res) => {
        const { local, visita } = req.body
        if (
            !local || !visita ||
            local.seleccionId === undefined ||
            visita.seleccionId === undefined ||
            local.goles === undefined ||
            visita.goles === undefined
        )
        {   return res.status(400).json({
            error: 'Faltan datos para registrar la final'
            })
        }
        const idLocal = Number(local.seleccionId)
        const idVisita = Number(visita.seleccionId)
        const Local = selecciones.find(
            (seleccion) => seleccion.id === idLocal)
        const Visita = selecciones.find(
            (seleccion) => seleccion.id === idVisita)
        if (!Local || !Visita) {
            return res.status(404).json({
            error: 'Alguna de las selecciones no existe'
            })
        }
        if (
            !Number.isInteger(local.goles) || 
            !Number.isInteger(visita.goles) ||
            local.goles < 0 || 
            visita.goles < 0
        )
        {   return res.status(400).json({
            error: 'Los goles deben ser números enteros iguales o mayores que cero'
            })
        }
        const nuevaFinal = {
            local: {
            seleccionId: idLocal,
            goles: local.goles
            },
            visita: {
            seleccionId: idVisita,
            goles: visita.goles
            },
        }
        partidos.final = nuevaFinal
        res.status(201).json(nuevaFinal)
    })
    app.get('/api/worldcup/2026/final', (req, res) => {
        if (!partidos.final) {
            return res.status(404).json({
            error: 'La final aún no ha sido registrada',
            })
        }
        const Local = selecciones.find(
            (seleccion) =>
            seleccion.id === partidos.final.local.seleccionId,
        )
        const Visita = selecciones.find(
            (seleccion) =>
            seleccion.id === partidos.final.visita.seleccionId,
        )
        let ganador
        if (partidos.final.local.goles > partidos.final.visita.goles) 
        {   ganador = Local.nombre
        }
        else if (partidos.final.visita.goles > partidos.final.local.goles) 
        {   ganador = Visita.nombre
        }
        else {ganador = 'Empate'}
        res.status(200).json({
            local: {
            seleccion: Local.nombre,
            goles: partidos.final.local.goles
            },
            visita: {
            seleccion: Visita.nombre,
            goles: partidos.final.visita.goles
            },
            ganador: ganador
        })
    })
    app.get('/api/estadisticas', (req, res) => {
        const totalCopas = selecciones.reduce(
            (contador, seleccion) =>
            contador + seleccion.copas.length,
            0
        )
        const seleccionesPorContinente = selecciones.reduce(
            (contador, seleccion) => {
                const continenteEncontrado = continentes.find(
                    (continente) =>
                    continente.id === seleccion.continenteId
                )
                const nombreContinente = continenteEncontrado.nombre
                contador[nombreContinente] =
                    (contador[nombreContinente] || 0) + 1
                return contador
            }, {}
        )
        const sumaRanking = selecciones.reduce(
            (contador, seleccion) =>
            contador + seleccion.fifaRanking, 0
        )
        const promedioRanking = sumaRanking / selecciones.length
        res.status(200).json({
            totalSelecciones: selecciones.length,
            totalCopas: totalCopas,
            seleccionesPorContinente: seleccionesPorContinente,
            promedioRanking: Number(promedioRanking.toFixed(2))
        })
    })
    app.use((req, res) => {
        res.status(404).json({
            error: 'Ruta no encontrada',
        })
    })
// TODO: levanta el servidor.
    app.listen(PORT, () => {
    console.log(`⚽ API del Mundial escuchando en http://localhost:${PORT}`)
    })
