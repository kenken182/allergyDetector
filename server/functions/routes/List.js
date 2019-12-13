var express = require('express')
var app = express()
const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

const getList = (req, res, next) => { // Gets the ingredients from the Firestore which is passed to client
  let user = req.params.id
  const callback = db.collection("users").doc(user).get().then(
    (doc) => {
      if (doc.exists) {
          res.send(doc.data())
          return doc.data()
      } else {
          return "No such document!"
      }
    },
    (error) => {
        return error
    }
  )
}

const addList = (req, res, next) => {
  let user = req.params.id
  let data = {
    Allergy: req.params.allergy,
    FoodType: req.params.foodtype
  }
  let ref = db.collection("users").doc(user)
  ref.update({Food: admin.firestore.FieldValue.arrayUnion(data)}).catch(error => error) // Updates the Firestore allergy list when a new allergy is added
  res.send("Successfully added to database!")
}

module.exports = {
  getList: getList,
  addList: addList
}
