const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Product = require("./Product");

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "category",
  }
);

// Associations
Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});

module.exports = Category;
