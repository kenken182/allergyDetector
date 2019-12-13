const functions = require('firebase-functions');
const express = require('express');
const listFunctions = require('./routes/List.js');
const cameraFunctions = require('./routes/Camera.js');
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use('/analyzeFood/:id', cameraFunctions.analyzeFood)

app.get('/getList/:id', listFunctions.getList)

app.post('/addList/:id/:allergy/:foodtype', listFunctions.addList)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


exports.app = functions.https.onRequest(app)
