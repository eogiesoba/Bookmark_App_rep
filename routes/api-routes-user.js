// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/users", function(req, res) {
    db.Users.findAll({})
    .then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // POST route for saving a new post
  app.post("/api/users", function(req, res) {
    db.Users.create({
      id: req.body.id,
      name: req.body.name,
      
    }).then(function(dbUser) {
      res.json(dbUsers);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/users/:id", function(req, res) {
    db.Users.destroy({
      where: {
        folder: req.params.id
      }
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // PUT route for updating posts
  app.put("/api/users", function(req, res) {
    db.Users.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbUsers) {
        res.json(dbUsers);
      });
  });
};