import Task from './Task.js'
import User from './User.js'

function config_fk(){
    // Define the relationships
    User.hasMany(Task, { foreignKey: 'assignedUserId', as: 'assignedTasks' });
    User.hasMany(Task, { foreignKey: 'managerId', as: 'createdTasks' });
    User.hasMany(Task, { foreignKey: 'closedBy', as: 'closedTasks' });
    // Define the relationships using the imported User model
    Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
    Task.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });
    Task.belongsTo(User, { foreignKey: 'closedBy', as: 'TaskClosedBy' });
}


export default config_fk;