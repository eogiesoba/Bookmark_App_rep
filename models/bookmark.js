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

    Post.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Post.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    
    Post.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
        Post.belongsTo(models.Folder, {
            foreignKey: {
            allowNull: false
            }
        });
    };
    
    return Bookmark;
};
  