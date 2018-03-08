module.exports = function(sequelize, DataTypes) {
    var Bookmark = sequelize.define("Bookmark", {
      name: {
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
          foreignKey: {
            allowNull: false
          }
        });
        Bookmark.belongsTo(models.Folder, {
            foreignKey: {
            allowNull: false
            }
        });
    };
    
    return Bookmark;
};
  