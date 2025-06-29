import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  MoreVertical,
  Calendar,
  MessageSquare,
  Paperclip,
  Flag,
  Edit2,
  Trash2,
  Users,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sortable Task Component
const SortableTask = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'bg-red-100 text-red-800 hover:bg-red-100',
      medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      low: 'bg-green-100 text-green-800 hover:bg-green-100',
    };
    return variants[priority] || variants.low;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className={`w-1 h-16 ${getPriorityColor(task.priority)} rounded-full absolute left-0 top-4`} />
            <div className="flex-1 ml-3">
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {task.description}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getPriorityBadge(task.priority)}>
                {task.priority}
              </Badge>
              {task.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {task.dueDate}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {task.comments > 0 && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {task.comments}
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Paperclip className="mr-1 h-3 w-3" />
                  {task.attachments}
                </div>
              )}
            </div>
          </div>

          {task.assignees && task.assignees.length > 0 && (
            <div className="flex items-center mt-2">
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={`/api/placeholder/24/24`} alt={assignee} />
                    <AvatarFallback className="text-xs">{assignee.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 bg-gray-200 rounded-full border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Sortable Column Component
const SortableColumn = ({ column, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getColumnColor = (status) => {
    const colors = {
      'todo': 'border-t-blue-500',
      'in-progress': 'border-t-yellow-500',
      'review': 'border-t-purple-500',
      'done': 'border-t-green-500',
    };
    return colors[status] || 'border-t-gray-500';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex-shrink-0 w-80"
    >
      <Card className={`h-full border-t-4 ${getColumnColor(column.id)}`}>
        <CardHeader 
          {...listeners}
          className="cursor-grab active:cursor-grabbing pb-3"
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              {column.title}
              <Badge variant="secondary" className="ml-2">
                {tasks.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 min-h-[400px]">
              {tasks.map((task) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

const Kanban = () => {
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [columns] = useState([
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Design Homepage',
      description: 'Create wireframes and mockups for the new homepage design',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-06-25',
      assignees: ['John', 'Jane'],
      comments: 3,
      attachments: 2,
    },
    {
      id: '2',
      title: 'Implement User Authentication',
      description: 'Add login and registration functionality with JWT',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-06-28',
      assignees: ['Mike'],
      comments: 1,
      attachments: 0,
    },
    {
      id: '3',
      title: 'Write API Documentation',
      description: 'Document all API endpoints and their usage',
      status: 'review',
      priority: 'medium',
      dueDate: '2024-06-30',
      assignees: ['Sarah', 'Tom'],
      comments: 5,
      attachments: 1,
    },
    {
      id: '4',
      title: 'Setup CI/CD Pipeline',
      description: 'Configure automated testing and deployment',
      status: 'done',
      priority: 'medium',
      dueDate: '2024-06-20',
      assignees: ['David'],
      comments: 2,
      attachments: 3,
    },
    {
      id: '5',
      title: 'Mobile Responsive Design',
      description: 'Ensure all pages work perfectly on mobile devices',
      status: 'todo',
      priority: 'low',
      dueDate: '2024-07-05',
      assignees: ['Lisa'],
      comments: 0,
      attachments: 0,
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignees: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Determine the new status
    let newStatus;
    
    // Check if dropped on a column
    const column = columns.find(col => col.id === overId);
    if (column) {
      newStatus = column.id;
    } else {
      // If dropped on another task, get that task's status
      const overTask = tasks.find(task => task.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && activeTask.status !== newStatus) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === activeId
            ? { ...task, status: newStatus }
            : task
        )
      );
    }
  };

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setSelectedTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignees: '',
    });
    setShowTaskDialog(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignees: Array.isArray(task.assignees) ? task.assignees.join(', ') : '',
    });
    setShowTaskDialog(true);
  };

  const handleSaveTask = () => {
    if (selectedTask) {
      // Update existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedTask.id
            ? {
                ...task,
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                assignees: newTask.assignees.split(',').map(a => a.trim()).filter(a => a),
              }
            : task
        )
      );
    } else {
      // Add new task
      const task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: selectedColumn || 'todo',
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assignees: newTask.assignees.split(',').map(a => a.trim()).filter(a => a),
        comments: 0,
        attachments: 0,
      };
      setTasks(prevTasks => [...prevTasks, task]);
    }
    setShowTaskDialog(false);
    setSelectedTask(null);
    setSelectedColumn(null);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
            <p className="text-muted-foreground">Manage tasks with drag and drop</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Team
            </Button>
            <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleAddTask('todo')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedTask ? 'Edit Task' : 'Add New Task'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Task description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignees">Assignees (comma separated)</Label>
                    <Input
                      id="assignees"
                      value={newTask.assignees}
                      onChange={(e) => setNewTask({ ...newTask, assignees: e.target.value })}
                      placeholder="John, Jane, Mike"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTask}>
                      {selectedTask ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            <SortableContext items={columns.map(col => col.id)} strategy={verticalListSortingStrategy}>
              {columns.map((column) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  tasks={getTasksByStatus(column.id)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {/* Add drag overlay if needed */}
          </DragOverlay>
        </DndContext>
      </motion.div>
    </div>
  );
};

export default Kanban;
