module.exports = function(sequelize, DataTypes) {
    var Bookmark = sequelize.define("Bookmark", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      }
    });

    Bookmark.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Bookmark.belongsTo(models.User, {
          constraints: false
        });
        Bookmark.belongsTo(models.Folder, {
            constraints: false
        });
    };
    
    return Bookmark;
};
  