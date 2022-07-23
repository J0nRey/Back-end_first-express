/********* LIBRERIAS ************************************************/

const express = require('express')
const fs = require('fs')

/********* ROUTER ************************************************/

const router = express.Router()

/********* koder.json ************************************************/

function getKodersFile(){
    const content = fs.readFileSync( 'koders.json', 'utf8' )
    return JSON.parse(content)
  }
  
/********* GET´S ************************************************/

//GET /?gender=f
//GET /?gender=f&count=5&name=jonathan
//GET /?count=5

router.get('/', async (request, response) => {
  const genderFilter = request.query.gender
  const countFilter = parseInt(request.query.count || 0)
  const nameFilter = request.query.name

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

  jsonParsed.koders = kodersData || jsonParsed.koders
  response.json(jsonParsed.koders) 
})


router.get('/:id', async (request, response) => {
  const id = request.params.id
  console.log( 'query: ', request.query)
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

/********* POST ************************************************/
  
router.post('/', (request, response) => {
  const name = request.body.name
  const gender = request.body.gender
  const newCoder = { name, gender }
  const json = getKodersFile()
  json.koders.push(newCoder)
fs.writeFileSync('koders.json', JSON.stringify(json, null, 2),'utf8' )
response.json({ success: true })
})

/********* PATCH ************************************************/

router.patch( '/:id', (request, response) => {
 const id = parseInt(request.params.id)
 const name = request.body.name
 const json = getKodersFile()
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

/********* DELETE ************************************************/

router.delete( '/:id', (request, response) => {
  const id = request.params.id
  const json = getKodersFile()
  const newKoders = json.koders.filter( koder => koder.id != id)
  json.koders = newKoders
  fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')
  response.json({
    success: true
  })
})

/********* Export routers ************************************************/
  
    module.exports = router