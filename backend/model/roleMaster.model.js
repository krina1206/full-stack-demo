import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RoleMaster = sequelize.define('rolemaster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
});

export default RoleMaster;