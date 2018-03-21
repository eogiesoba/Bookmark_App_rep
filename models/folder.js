module.exports = function(sequelize, DataTypes) {
    var Folder = sequelize.define("Folder", {
      folder: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      }
    });

    Folder.associate = function(models) {
       
        Folder.belongsTo(models.User, {
          constraints: false
        });
    };
    
    return Folder;
};
  