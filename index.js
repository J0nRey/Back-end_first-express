/********* LIBRERIAS ************************************************/

const express = require ('express')

/********* IMPORTAR koders ************************************************/

const kodersRouter = require('./routers/koders')
const mentorsRouter = require('./routers/mentors')

/********* SERVIDOR ************************************************/

const server = express()

/********* MIDDLEWARE ************************************************/

server.use(express.json())

/********* MONTAR EL ROUTER EN EL SERVIDOR **********************************************/

server.use('/koders', kodersRouter )
server.use('/mentors', mentorsRouter )

/********* GET ************************************************/

server.get('/', (request, response) => {
  response.json({
    success: true,
    message: '11G APIv1'
  })
})

/********* ESCUCHA DEL SERVIDOR ***********************************/

server.listen(8080, () => {
  console.log(`Server listering in port 8080`)
})

/*
practica 5

crear un router para mentores
GET /mentores
GET /mentores/:id
POST /mentores
PATCH /mentores/:id
DELETE /mentores/:id

*/