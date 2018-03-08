// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models"); //tyep db.Post when using sequelize. 

// Routes
// =============================================================
module.exports = function(app) {

  // POST route for importing all the users bookmarks into DB
  app.post("/api/posts", function(req, res) {
    var newArr = req.body;
    var UserId = req.body[0]
    for (var i=1; i < newArr.length; i++){
      db.Bookmark.create({
        title: newArr[i].title,
        url: newArr[i].url,
        UserId: UserId
      }).then(function() {
        res.end();
      });
    }
  });

  // Get route for returning posts of a specific category
  app.get("/api/posts/category/:category", function(req, res) {
    // db.Post.findAll({
    //   where: {
    //     category: req.params.category
    //   }
    // }).then(results => res.json(results));
  });

  // Get route for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    // db.Post.findOne({
    //   where: {
    //     category: req.params.id
    //   }
    // }).then(results => res.json(results));
  });

  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    // console.log(req.body);
    // db.Post.create({
      
    // })
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    // Add sequelize code to delete a post where the id is equal to req.params.id, 
    // then return the result to the user using res.json
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    // Add code here to update a post using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
  });
};
