import { Tabs } from 'antd';
const { TabPane } = Tabs;
import Dashboard from './components/Dashboard';
import WorkoutManager from './components/WorkoutManager';
import HealthManager from './components/HealthManager';
import GoalManager from './components/GoalManager';
import ExerciseLibrary from './components/ExerciseLibrary';

export default () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Tổng Quan" key="1"><Dashboard /></TabPane>
      <TabPane tab="Nhật ký tập" key="2"><WorkoutManager /></TabPane>
      <TabPane tab="Sức khỏe" key="3"><HealthManager /></TabPane>
      <TabPane tab="Mục tiêu" key="4"><GoalManager /></TabPane>
      <TabPane tab="Bài tập" key="5"><ExerciseLibrary /></TabPane>
    </Tabs>
  );
};
