module.exports = function(sequelize, DataTypes) {
    var Folder = sequelize.define("Folder", {
      folder: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
    });
    
    return Folder;
  };
  