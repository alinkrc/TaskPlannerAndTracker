import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'user'),
        allowNull: false
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User', // Note: Using string reference here
            key: 'id'
        },
        validate: {
            isValidManagerId(value) {
                if (this.role === 'user' && !value) {
                    throw new Error('A simple user must have a manager assigned.');
                }
            }
        }
    }
});



export default User;

