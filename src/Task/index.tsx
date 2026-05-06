import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskTable from './components/TaskTable';
import TaskForm from './components/TaskForm';
import moment from 'moment';

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: Status;
  tags: string[];
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (values: any) => {
    const newTask: Task = {
      ...values,
      id: editingTask ? editingTask.id : Date.now().toString(),
      status: editingTask ? editingTask.status : 'todo',
      deadline: values.deadline.format('YYYY-MM-DD'),
    };

    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? newTask : t)));
      message.success('Cập nhật công việc thành công');
    } else {
      setTasks([...tasks, newTask]);
      message.success('Thêm công việc thành công');
    }
    setIsModalVisible(false);
    setEditingTask(undefined);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    message.success('Xóa công việc thành công');
  };

  const handleUpdateStatus = (id: string, status: Status) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const showEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  return (
    <PageContainer
      header={{
        extra: [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTask(undefined);
              setIsModalVisible(true);
            }}
          >
            Thêm công việc
          </Button>,
        ],
      }}
    >
      <Tabs defaultActiveKey="kanban">
        <Tabs.TabPane tab="Dashboard" key="dashboard">
          <Dashboard tasks={tasks} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Kanban Board" key="kanban">
          <KanbanBoard tasks={tasks} onUpdateStatus={handleUpdateStatus} onEdit={showEditModal} onDelete={handleDeleteTask} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Danh sách task" key="table">
          <TaskTable tasks={tasks} onEdit={showEditModal} onDelete={handleDeleteTask} />
        </Tabs.TabPane>
      </Tabs>

      <TaskForm
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTask(undefined);
        }}
        onFinish={handleAddTask}
        initialValues={editingTask ? { ...editingTask, deadline: moment(editingTask.deadline) } : undefined}
      />
    </PageContainer>
  );
};

export default TaskPage;