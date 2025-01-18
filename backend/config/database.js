import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Path to your SQLite database file
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

export default sequelize;