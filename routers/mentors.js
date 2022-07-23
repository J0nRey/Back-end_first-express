/********* LIBRERIAS ************************************************/

const express = require('express')
const fs = require('fs')

/********* ROUTER ************************************************/

const router = express.Router()

/********* koder.json ************************************************/

function getMentorsFile(){
    const content = fs.readFileSync( 'koders.json', 'utf8' )
    return JSON.parse(content)
  }
  
/********* GET´S ************************************************/

//GET /?module=Back
//GET /?module=Back&count=5&name=Charles
//GET /?count=5

router.get('/', async (request, response) => {
  const moduleFilter = request.query.module
  const countFilter = parseInt(request.query.count || 0)
  const nameFilter = request.query.name

  const jsonParsed = getMentorsFile()

  let mentorsData = null

  if(moduleFilter) {
    mentorsData = jsonParsed.mentors.filter(mentor => mentor.module === moduleFilter)
  }

  if(nameFilter){
    const dataToFilter = mentorsData || jsonParsed.mentors
    mentorsData = dataToFilter.filter(mentor => mentor.name === nameFilter)
  }

  if(countFilter) {
    const dataToFilter = mentorsData || jsonParsed.mentors
    mentorsData = dataToFilter.splice(0, countFilter)
  }

  jsonParsed.mentors = mentorsData || jsonParsed.mentors
  response.json(jsonParsed.mentors) 
})


router.get('/:id', async (request, response) => {
  const id = request.params.id
  console.log( 'query: ', request.query)
  const json = getMentorsFile()
  const mentorFound = json.mentors.find( mentor => mentor.id == id )
  if(!mentorFound){
    response.status(404)
    response.json({
      success: false,
      message: 'Mentor no found :c'
    })
    return
  }
  response.json({
    success: true,
    message: 'Mentor found :)',
    data: {
      Mentor: mentorFound
    }
  })
})

/********* POST ************************************************/
  
router.post('/', (request, response) => {
  const name = request.body.name
  const module = request.body.module
  const newMentor = { name, module }
  const json = getMentorsFile()
  json.mentors.push(newMentor)
fs.writeFileSync('koders.json', JSON.stringify(json, null, 2),'utf8' )
response.json({ success: true })
})

/********* PATCH ************************************************/

router.patch( '/:id', (request, response) => {
 const id = parseInt(request.params.id)
 const name = request.body.name
 const json = getMentorsFile()
 const newMentors = json.mentors.reduce((mentors, mentorActual) => {
    if ( id === mentorActual.id){
      mentorActual.name = name
    }
    return [ ...mentors, mentorActual ]
  }, []) 
  json.mentors = newMentors
  fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')
  response.json({success: true})
})

/********* DELETE ************************************************/

router.delete( '/:id', (request, response) => {
  const id = request.params.id
  const json = getMentorsFile()
  const newMentors = json.mentors.filter( mentor => mentor.id != id)
  json.mentors = newMentors
  fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')
  response.json({
    success: true
  })
})

/********* Export routers ************************************************/
  
    module.exports = router