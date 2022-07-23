const express = require ('express')
const server = express()

// Practica_3
const fs = require('fs')

// midleware
server.use(express.json())

// Traer koders.json con una funcion
function getKodersFile(){
  const content = fs.readFileSync( 'koders.json', 'utf8' )
  return json = JSON.parse(content)
}




server.get('/hola', (request, response) => {
  response.write('GET /Hola respondiendo')
  response.end()
})

server.post('/hola', (request, response) => {
    response.write(' Este es un POST a /Hola')
    response.end()
  })



  server.get('/koders', (request, response) => {
    response.write('Aqui estan todos los koders')
    response.end()
  })

  server.post('/koders', (request, response) => {
    response.write('Aqui puedes crear koders')
    response.end()
  })

  server.put('/koders', (request, response) => {
    response.write('Aqui puedes sustituir un koders')
    response.end()
  })

  server.get('/json', (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    const json = { massage: 'Aqui esta la lista de koders'}
    const jsonString = JSON.stringify(json)

    response.write(jsonString)
    response.end()
  })


// Este metodo solo funciona en express
  server.get('/jsonexpress', (request, response) => {
    response.status(401)  
    response.json({ massage: 'Aqui esta la lista de koders/express'})
  })



server.listen(8080, () => {
  console.log(`Server listering in port 8080`)
})

//ejercicio 3
//GET /koders -> Aqui estan todos los koders
//POST /koders -> Aqui puedes crear koders
//PUT /koders -> Aqui puedes sustituir un koders


//como recibir informacion
server.post('/koder', (request, response) => {
    const cuerpo = request.body
    console.log('body: ', cuerpo)
    console.log('name: ', cuerpo.name)
    console.log('generation: ', cuerpo.generation)
    response.json({
        message: 'ok'
    })
  })




// Practica_3
/*server.get('/Coders', (request, response) => {


//Metodo Syncrono
    const json = fs.readFileSync('koders.json', 'utf8')
    console.log('json: ', json)
    const jsonParsed = JSON.parse(json)
//    response.json(jsonParsed)
    response.json(jsonParsed.koders)


//Metodo Asyncrono
    fs.promises.readFile('koders.json', 'utf8')
     .then( (data) => {
       const jsonParsed = JSON.parse(data)
       response.json(jsonParsed.koders)
     } )
     .catch( () => {} )
  })*/


// con Async and Await
  server.get('/Coders', async (request, response) => {
    const json2 = await fs.promises.readFile('koders.json', 'utf8')
    const jsonParsed = JSON.parse(json2)
    response.json(jsonParsed.koders)
  })

  // practica fs + express

  /*
crear un end point
GET /koders -> regresa un json con una lista de koders
la lista de koders viene de un archivo koders.json

{
    "koders": [
        {
            "name": "Beto",
            "gender": "m"
        },
        {
            "name": "Walter",
            "gender": "m"
        },
        {
            "name": "Mariana",
            "gender": "f"
        },
        {
            "name": "Damian",
            "gender": "m"
        },
        {
            "name": "Silvi",
            "gender": "f",
        }
    ]
}

*/

// Mandando una respuesta y modificando la data


server.post('/Coders', (request, response) => {
  const name = request.body.name
  const gender = request.body.gender


  const newCoder = { name, gender }

  //const content = fs.readFileSync( 'koders.json', 'utf8' )
  //const json = JSON.parse(content)
  
  const json = getKodersFile()
  
  console.log( 'json: ', json)

  json.koders.push(newCoder)
  console.log( 'json: ', json)


fs.writeFileSync('koders.json', JSON.stringify(json, null, 2),'utf8' )
response.json({ success: true })

})

// /recurso/identificador   placeHolders
// /Coders/1
// /Coders/100
// /Coders/abc
server.patch( '/Coders/:id', (request, response) => {
 const id = parseInt(request.params.id) // lo pasamos de string a numero con parseInt
 const name = request.body.name

//const content = fs.readFileSync('koders.json', 'utf8')
//const json = JSON.parse(content)

const json = getKodersFile()

 // forEach, find, filter, map, -reduce
//json.koders.reduce((accum, current) => {}, [])
 const newKoders = json.koders.reduce((koders, koderActual) => {
    if ( id === koderActual.id){
      koderActual.name = name
    }
    return [ ...koders, koderActual ]
  }, []) 

  json.koders = newKoders

  fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')

  response.json({success: true})

})

// ejercicio 4
/*practica
Crear un endPoint para borrar
DELETE /Coders/:id
GET /Coders/:id
*/




server.get( '/Coders/:id ', (request, response) => {
  const id = request.params.id

  console.log( 'query: ', request.query)

//const content = fs.readFileSync('koders.json', 'utf8')
//const json = JSON.parse(content)

  const json = getKodersFile()

  const koderFound = json.koders.find( koder => koder.id == id )

  if(!koderFound){
    response.status(404)
    response.json({
      success: false,
      message: 'koder no found :c'
    })
    return
  }

  response.json({
    success: true,
    message: 'koder found :)',
    data: {
      koder: koderFound
    }
  })

})

server.delete( '/Coders/:id', (request, response) => {
  const id = request.params.id

//const content = fs.readFileSync('koders.json', 'utf8')
//const json = JSON.parse(content)

  const json = getKodersFile()
  
  const newKoders = json.koders.filter( koder => koder.id != id)

  json.koders = newKoders

  fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')

  response.json({
    success: true
  })

})



server.get('/Cod', async (request, response) => {
  const genderFilter = request.query.gender
  const nameFilter = request.query.name
  const countFilter = parseInt(request.query.count || 0)
  const jsonParsed = getKodersFile()

  let kodersData = null

  if(genderFilter) {
    kodersData = jsonParsed.koders.filter(koder => koder.gender === genderFilter)
  }

  if(nameFilter){
    const dataToFilter = kodersData || jsonParsed.koders
    kodersData = dataToFilter.filter(koder => koder.name === nameFilter)
  }

  if(countFilter) {
    const dataToFilter = kodersData || jsonParsed.koders
    kodersData = dataToFilter.splice(0, countFilter)
  }

  jsonParsed.koders = koderData || jsonParsed.koders
  response.json(jsonParsed.koders) 
})