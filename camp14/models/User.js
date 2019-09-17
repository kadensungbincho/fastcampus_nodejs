const passwordHash = require('../helpers/passwordHash');

module.exports = function(sequelize, DataTypes){
  const User = sequelize.define('User',
      {
          id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
          username : { 
              type: DataTypes.STRING,
              validate : {
                  len : [0, 50]
              },
              allowNull : false
          },
          
          password : { 
              type: DataTypes.STRING,
              validate : {
                  len : [3, 100]
              } ,
              allowNull : false
          },
          
          displayname : { type: DataTypes.STRING }

      },{
          tableName: 'User'
      }
  );

  // product model relationship
  User.associate = (models) => {
      
    // memo model key
    // onDelete option for Cascading
    // as Products (x)
    User.hasMany(
        models.Products,
        {
            as: 'Product',
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        }
    );
  };

  User.beforeCreate((user, _) => {
      user.password = passwordHash(user.password);
  });

  return User;
}