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
  app.get("/api/folders", function(req, res) {
    db.Folders.findAll({})
    .then(function(dbFolders) {
      res.json(dbFolders);
    });
  });


  // POST route for saving a new post
  app.post("/api/folders", function(req, res) {
    db.Folders.create({
      id: req.body.id,
      folder: req.body.folder,
      
    }).then(function(dbFolders) {
      res.json(dbFolders);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/folders/:id", function(req, res) {
    db.Folders.destroy({
      where: {
        folder: req.params.folder
      }
    }).then(function(dbFolders) {
      res.json(dbFolders);
    });
  });

  // PUT route for updating posts
  app.put("/api/folders", function(req, res) {
    db.Folders.update(
      req.body,
      {
        where: {
          folder: req.body.folder
        }
      }).then(function(dbPost) {
        res.json(dbPost);
      });
  });
};