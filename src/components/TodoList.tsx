import { useState, useEffect } from 'react';
import { Plus, Check, X, Calendar, Trash2, ListTodo, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, loadData, saveData, getDateString, getTomorrowString, formatDate } from '@/lib/storage';
import { toast } from 'sonner';

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const today = getDateString();
  const tomorrow = getTomorrowString();

  useEffect(() => {
    const data = loadData();
    
    // Move yesterday's tomorrow tasks to today
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getDateString(yesterday);
    
    const updatedTasks = data.tasks.map(task => {
      if (task.date === yesterdayStr && task.completed === null) {
        // This was a "tomorrow" task from yesterday, but wasn't completed
        // We should have moved it already, so just update date
        return { ...task, date: today };
      }
      return task;
    });

    // Check if we need to move tomorrow's tasks (if day changed)
    if (data.lastActiveDate !== today) {
      updatedTasks.forEach((task, index) => {
        if (task.date === data.lastActiveDate) {
          // Keep as is
        }
        // Move "tomorrow" tasks to "today"
        const taskDateObj = new Date(task.date);
        const todayObj = new Date(today);
        if (task.completed === null && taskDateObj < todayObj) {
          updatedTasks[index] = { ...task, date: today };
        }
      });
      data.lastActiveDate = today;
    }

    setTasks(updatedTasks);
    saveData({ ...data, tasks: updatedTasks, lastActiveDate: today });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: null,
      date: tomorrow,
    };

    const data = loadData();
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveData({ ...data, tasks: updatedTasks });
    setNewTask('');
    toast.success('Task added for tomorrow!');
  };

  const updateTaskStatus = (taskId: string, completed: boolean) => {
    const data = loadData();
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
    saveData({ ...data, tasks: updatedTasks });
    toast.success(completed ? 'Well done! Task completed!' : 'Task marked as skipped');
  };

  const deleteTask = (taskId: string) => {
    const data = loadData();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveData({ ...data, tasks: updatedTasks });
    toast.success('Task deleted');
  };

  const todayTasks = tasks.filter(task => task.date === today);
  const tomorrowTasks = tasks.filter(task => task.date === tomorrow);

  const TaskItem = ({ task, showActions }: { task: Task; showActions: boolean }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
        task.completed === true
          ? 'bg-success/10 border border-success/30'
          : task.completed === false
          ? 'bg-destructive/10 border border-destructive/30 opacity-60'
          : 'bg-muted/50 border border-border hover:bg-muted'
      }`}
    >
      <div className="flex-1">
        <p className={`font-medium ${task.completed !== null ? 'line-through text-muted-foreground' : ''}`}>
          {task.text}
        </p>
      </div>
      {showActions && task.completed === null ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-success/20 hover:text-success"
            onClick={() => updateTaskStatus(task.id, true)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            onClick={() => updateTaskStatus(task.id, false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Today's Tasks */}
      <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg gradient-primary">
              <ListTodo className="h-4 w-4 text-primary-foreground" />
            </div>
            Today's Tasks
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {formatDate(today)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No tasks for today</p>
              <p className="text-sm">Add tasks for tomorrow below</p>
            </div>
          ) : (
            todayTasks.map(task => (
              <TaskItem key={task.id} task={task} showActions={true} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Tomorrow's Tasks */}
      <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg gradient-accent">
              <ArrowRight className="h-4 w-4 text-accent-foreground" />
            </div>
            Tomorrow's Tasks
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {formatDate(tomorrow)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a task for tomorrow..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} size="icon" className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {tomorrowTasks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Plan your tomorrow now!</p>
            </div>
          ) : (
            tomorrowTasks.map(task => (
              <TaskItem key={task.id} task={task} showActions={false} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
