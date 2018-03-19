// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models from our DB
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
        FolderId: 0
      }).then(function () {
        res.end();
      });
  });

  // POST route for adding folders on table in DB
  app.post("/api/folders", function (req, res) {
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
          id: req.body.id
        }
      }).then(function () {
        res.end();
      });
  });

  // Get route for returning all users
  app.get("/api/users", function (req, res) {
    db.User.findAll({}).then(function (results, err) {
      if(err){console.log(err)}
      res.json(results);
    });
  });

  app.get("/api/bookmarks/:id", function(req, res) {
    db.Bookmark.findAll({
      where: {
        UserId: req.params.id
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/bookmarks/:UserId/:FolderId", function(req, res) {
    console.log("in sort api", req.params.UserId, req.params.FolderId);
    db.Bookmark.findAll({
      where: {
        UserId: req.params.UserId,
        FolderId: req.params.FolderId
      }
    }).then(function(results) {
      res.json(results);
    });
  });


  app.get("/api/folders/:id", function(req, res) {
    db.Folder.findAll({
      where: {
        UserId: req.params.id
      }
    }).then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/folders", function (req, res) {
    db.Folder.findAll({}).then(function (results, err) {
      // results are available to us inside the .then
      if(err){console.log(err)}
      res.json(results);
    });
  });

  // DELETE route for deleting users
  app.delete("/api/users", function (req, res) {
    db.User.destroy({
      where: {
        id: req.param.userID
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.delete("/api/bookmarks/:id", function (req, res) {
    db.Bookmark.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbBookmark) {
      res.json(dbBookmark);
    });
  });

  app.delete("/api/folders/:id", function (req, res) {
    db.Bookmark.destroy({
      where: {
        FolderId: req.params.id
      }
    }).then(function(dbBookmark) {
      res.json(dbBookmark);
    });

    db.Folder.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbFolder) {
      res.json(dbFolder);
    });
  });

};
