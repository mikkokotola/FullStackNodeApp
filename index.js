const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
//app.use(morgan('tiny'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))
//morgan.token('type', function (req, res) { return req.headers['content-type'] })
app.use(cors())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Home. No content. Try /api/persons.</h1>')
})

app.get('/info', (req, res) => {
    cont = `<p>Puhelinluettelossa ${persons.length} henkilön tiedot.</p>
    <p>${new Date()}</p>`
    res.send(cont)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    do {
        newId = Math.floor(Math.random() * 1000000)
        person = persons.find(person => person.id === newId)
    } while (person)

    return newId
}


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.name === "") {
        response.status(400).json({ error: 'Name missing' })
    }

    if (body.number === undefined || body.number === "") {
        response.status(400).json({ error: 'Number missing' })
    }

    if (persons.find(person => person.name === body.name)) {
        response.status(400).json({ error: 'Name already registered, doubles not allowed' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
