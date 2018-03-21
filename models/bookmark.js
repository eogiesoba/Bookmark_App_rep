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
        Bookmark.belongsTo(models.User, {
          constraints: false
        });
        Bookmark.belongsTo(models.Folder, {
            constraints: false
        });
    };
    
    return Bookmark;
};
  