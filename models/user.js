module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      user: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
    });
    
    return User;
  };
  