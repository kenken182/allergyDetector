var express = require('express')
var app = express()
const listFunctions = require('./List.js');
const fetch = require('node-fetch');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const analyzeFood = (req, res, next) => {
  let user = req.params.id // Current user passed through params
  const applicationId = process.env.EDAMAME_APP_ID
  const applicationKey = process.env.EDAMAME_APP_KEY
  const item = req.body.item
  const url = process.env.FIREBASE_PROJECT_ID
  const itemsUrl = `https://api.edamam.com/search?q=${item}&app_id=${applicationId}&app_key=${applicationKey}&from=0&to=1`
  const ingredientsUrl = 'https://' + `${url}` + `.firebaseapp.com/getList/${user}`

  async function ingredients() { // Awaits Firebase ingredients to return
    let ingredientsResponse = await fetch(ingredientsUrl)
    let ingredientsData = ingredientsResponse.json()
    return ingredientsData
  }

  async function recipeItems() { // Awaits Edamame API to respond with list of ingredients
    let itemsResponse = await fetch(itemsUrl)
    let itemsData = itemsResponse.json()
    return itemsData
  }

  const checkInside = (item, array) => { // Function for cross referencing, O(n) time
    for (let i in array) {
      if (array[i].includes(item)) {
        return true
      }
    }
    return false
  }

  recipeItems().then((recipeRes) => { // Function to check every allergen against every ingredient in the recipe. O(n^2)
    ingredients().then(
        (ingredientsRes) => {
          console.log(recipeRes.hits[0].recipe.ingredientLines)
          let ans = false
          for (let i in ingredientsRes.Food) {
            if (checkInside(ingredientsRes.Food[i].Allergy.toLowerCase(), recipeRes.hits[0].recipe.ingredientLines)) {
              ans = true;
              break;
            }
          }
          res.send(ans) // Sends response of true or false
          return ans
        }).catch(
          error => {
            res.send(error) // Error catching
            return error
          })
    return
  }).catch(
    error => {
        res.send(error)
        return error
    })
}


module.exports = {
  analyzeFood: analyzeFood
}
