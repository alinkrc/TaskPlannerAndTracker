import Task from '../models/Task.js';
import User from '../models/User.js';

const getAllTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'manager') {
            // Managers can see all tasks
            tasks = await Task.findAll({
                include: [
                    {model: User, as: 'assignedUser'},
                    {model: User, as: 'manager'},
                ],
            });
        } else {
            // Simple users can only see tasks assigned to them
            tasks = await Task.findAll({
                where: {
                    assignedUserId: req.user.id,
                },
                include: [
                    {model: User, as: 'assignedUser'},
                    {model: User, as: 'manager'},
                ],
            });
        }
        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({error: 'Failed to fetch tasks'});
    }
};

const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByPk(taskId, {
            include: [
                {model: User, as: 'assignedUser'},
                {model: User, as: 'manager'},
            ],
        });
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        // Check if the user is authorized to view this task
        if (req.user.role !== 'manager' && task.assignedUserId !== req.user.id) {
            return res.status(403).json({error: 'Forbidden'});
        }
        console.log('here');
        return res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({error: 'Failed to fetch task'});
    }
};

const createTask = async (req, res) => {
  try {
    if (req.user.role === 'manager') {
      const { description, assignedUserId } = req.body;
      const managerId = req.user.id;

      // Check if the assigned user exists and has the current manager as their manager
      const assignedUser = await User.findByPk(assignedUserId);
      if (!assignedUser || assignedUser.managerId !== managerId) {
        return res.status(403).json({ error: 'Forbidden: You can only assign tasks to users you manage.' });
      }

      const newTask = await Task.create({
        description,
        assignedUserId,
        managerId,
       
      });
      return res.status(201).json(newTask);
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { description, assignedUserId, state} = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the user is authorized to update this task
    if (req.user.role !== 'manager' && task.assignedUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Only allow updating certain fields based on user role
    if (req.user.role === 'manager') {
      task.description = description || task.description;
     

      // If re-assigning the task, check if the new assigned user is valid
      if (assignedUserId !== undefined) {
        const newAssignedUser = await User.findByPk(assignedUserId);
        if (!newAssignedUser || newAssignedUser.managerId !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden: You can only assign tasks to users you manage.' });
        }
        task.assignedUserId = assignedUserId;
      }

      // Managers can only set the state to CLOSED if it's currently COMPLETED
      if (state === 'CLOSED' && task.state === 'COMPLETED') {
        task.state = state;
        task.closedBy = req.user.id; // Record who closed the task
        task.closedAt = new Date();
      }
    } else if (req.user.role === 'user') {
      // Users can only change the state to COMPLETED
      if (state === 'PENDING' && task.state === 'OPEN') {
        console.log(state);
        console.log(task.state);
        task.state = state;
      }
      if (state === 'COMPLETED' && task.state === 'PENDING') {
        task.state = state;
      }
    }

    await task.save();
    console.log(task);
    return res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Only allow managers to delete tasks
        if (req.user.role !== 'manager') {
            return res.status(403).json({error: 'Forbidden'});
        }

        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        await task.destroy();
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({error: 'Failed to delete task'});
    }
};

const getTaskHistoryForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Only allow managers to access task history for any user,
        // or users to access their own history
        if (req.user.role !== 'manager' && req.user.id !== parseInt(userId, 10)) {
            return res.status(403).json({error: 'Forbidden'});
        }

        const tasks = await Task.findAll({
            where: {
                assignedUserId: userId,
                state: 'CLOSED',
            },
            include: [
                {model: User, as: 'assignedUser'},
            ],
        });

        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching task history:', error);
        return res.status(500).json({error: 'Failed to fetch task history'});
    }
};

export {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskHistoryForUser
};