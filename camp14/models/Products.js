const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Products = sequelize.define('Products',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      thumbnail: { type: DataTypes.STRING },
      price: { type: DataTypes.INTEGER },
      description: { type: DataTypes.TEXT }
    }
  );

  Products.prototype.dateFormat = (date) => (
    moment(date).format('YYYY-MM-DD')
  );
  
  // Products model relationship
  Products.associate = (models) => {
    // Set foreignKey on Memo model
    // delete all memo(s) on deleting a product by onDelete CASCADE option
    Products.hasMany(models.ProductsMemo, {as: 'Memo', foreignKey: 'product_id', sourceKey: 'id', onDelete: 'CASCADE' })
  }
  return Products;
}
