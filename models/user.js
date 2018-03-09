module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      user: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      }
    });
    // User.associate = function(models) {
    //   // Associating Author with Posts
    //   // When an Author is deleted, also delete any associated Posts
    //   User.hasMany(models.Folder, {
    //     onDelete: "cascade"
    //   });
    //   User.hasMany(models.Bookmark, {
    //     onDelete: "cascade"
    //   });
    // };
    
    return User;
};
  