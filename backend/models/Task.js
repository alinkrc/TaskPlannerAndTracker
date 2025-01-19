import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js"; // Import User before defining Task

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

   

    state: {
        type: DataTypes.ENUM('OPEN', 'PENDING', 'COMPLETED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'OPEN'
    },

    closedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

    closedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },

    assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },

    managerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});



export default Task;