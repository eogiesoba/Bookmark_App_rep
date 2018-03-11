// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models"); //tyep db.Post when using sequelize. 

// Routes
// =============================================================
module.exports = function (app) {



  // POST route for adding a new user - used with chrome extension as an AJAX request
  app.post("/api/users", function (req, res) {
    db.User.create({
      user: req.body.user
    }).then(function () {
      res.end();
    });
  });

  // POST route for importing all users bookmarks on table in DB - used with chrome extension as an AJAX request
  app.post("/api/bookmarks", function (req, res) {
    console.log("Req.Body: ", req.body);
    var Obj = req.body//Bookmark object
      db.Bookmark.create({
        title: Obj.title,
        url: Obj.url,
        UserId: Obj.userID,
        FolderId: null
      }).then(function () {
        res.end();
      });
  });

  // POST route for adding folders on table in DB
  app.post("/api/folders", function (req, res) {
    console.log("in api/folders route");
    console.log(req.body.userID);
    console.log(req.body.folder);

    db.Folder.create({
      folder: req.body.folder,
      UserId: req.body.userID
    }).then(function () {
      res.end();
    });
  });

  // PUT route will update bookmark's folder
  app.put("/api/bookmarks", function (req, res) {
    db.Bookmark.update(
      req.body,
      {
        where: {
          id: req.body.FolderId
        }
      }).then(function () {
        res.end();
      });
  });

  // Get route for returning all users
  app.get("/api/users", function (req, res) {

    db.User.findAll({}).then(function (results, err) {
      if(err){console.log(err)}
      // console.log(results)
      // results are available to us inside the .then
      res.json(results);
    });

  });

  // Get route for returning all bookmarks
  // app.get("/api/bookmarks", function (req, res) {

  //   db.Bookmark.findAll({}).then(function (results) {
  //     res.json(results);
  //   });

  // });

  app.get("/api/bookmarks/:id", function(req, res) {
    db.Bookmark.findAll({
      where: {
        UserId: req.params.id
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  

  app.get("/api/folders", function (req, res) {
    console.log("We are in GET folders");

    db.Folder.findAll({}).then(function (results, err) {
      // results are available to us inside the .then
      if(err){console.log(err)}
      res.json(results);
    });

  });

  // DELETE route for deleting posts
  app.delete("/api/users", function (req, res) {
    // Add sequelize code to delete a post where the id is equal to req.params.id, 
    // then return the result to the user using res.json
    db.User.destroy({
      where: {
        id: req.param.userID
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.delete("/api/bookmarks", function (req, res) {
    // Add sequelize code to delete a post where the id is equal to req.params.id, 
    // then return the result to the user using res.json
    db.Bookmark.destroy({
      where: {
        id: req.param.userID
      }
    }).then(function(dbBookmark) {
      res.json(dbBookmark);
    });
  });

  app.delete("/api/folders", function (req, res) {
    // Add sequelize code to delete a post where the id is equal to req.params.id, 
    // then return the result to the user using res.json
    db.Folder.destroy({
      where: {
        folder: req.param
      }
    }).then(function(dbFolder) {
      res.json(dbFolder);
    });
  });

};
