import { Route, Routes } from 'react-router-dom';
import Main from '@/pages/main/MainPage';
import SignupStartPage from './pages/signup/SignupStartPage';
import CompanyRegisterPage from './pages/signup/CompanyRegisterPage';
import CompanyRegisterSecondPage from './pages/signup/CompanyRegisterSecondPage';
import EmployeeRegisterPage from './pages/signup/EmployeeRegisterPage';
import EmployeeRegisterSecondPage from './pages/signup/EmployeeRegisterSecondPage';
import EmployeeRegisterFourthPage from './pages/signup/EmployeeRegisterFourthPage';
import SignupSuccessPage from './pages/signup/SignupSuccesspage';
import SignupFailurePage from './pages/signup/SignupFailurePage';
import TestPage from './pages/test/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/login/LoginPage';
import Sidebartest from './pages/test/sidebartest';
import ProjectManagementListPage from './pages/management-service/project/ProjectManagementListPage';
import ProjectCreatePage from './pages/management-service/project/ProjectCreatePage';
import InboundTaskListPage from './pages/management-service/inbound/InboundTaskListPage';
import InboundTaskDetailPage from './pages/management-service/inbound/InboundTaskDetailPage';
import ProjectEditPage from './pages/management-service/project/ProjectEditPage';
import OutBoundTaskListPage from './pages/management-service/outbound/OutBoundTaskListPage';
import InventoryInboundTaskListPage from './pages/inventory-service/inventory-inbound/InventoryInboundTaskListPage';
import LogisticsOutboundTaskListPage from './pages/logistics-service/logistics-outbound/LogisticsOutboundTaskListPage';
import InventoryStockListPage from './pages/inventory-service/inventory-stock/InventoryStockListPage';
import HRManagementPage from './pages/management-service/HRM/HRManagementPage';
import OutboundTaskDetailPage from './pages/management-service/outbound/OutBoundTaskDetailPage';
import InventoryInboundTaskDetailPage from './pages/inventory-service/inventory-inbound/inventoryInboundTaskDetailPage';
import InventoryDetailPage from './pages/inventory-service/inventory-inbound/inventoryStockDetailPage';
import LogisticsOutboundTaskDetailPage from './pages/logistics-service/logistics-outbound/LogisticsOutboundTaskDetailPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="signup" element={<SignupStartPage />} />
        <Route path="companysignup" element={<CompanyRegisterPage />} />
        <Route path="companysignup/step2" element={<CompanyRegisterSecondPage />} />
        <Route path="employeesignup" element={<EmployeeRegisterPage />} />
        <Route path="employeesignup/step2" element={<EmployeeRegisterSecondPage />} />
        <Route path="employeesignup/step4" element={<EmployeeRegisterFourthPage />} />
        <Route path="signupsuccess" element={<SignupSuccessPage />} />
        <Route path="signupfailure" element={<SignupFailurePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="sidebartest" element={<Sidebartest />} />
        <Route path="/project-management" element={<ProjectManagementListPage />} />
        <Route path="/project-create" element={<ProjectCreatePage />} />
        <Route path="/project/:id" element={<ProjectEditPage />} />
        <Route path="/inbound-task" element={<InboundTaskListPage />} />
        <Route path="/inbound-task/:inventoryId" element={<InboundTaskDetailPage />} />
        <Route path="/outbound-task" element={<OutBoundTaskListPage />} />
        <Route path="/outbound-task/:logisticsId" element={<OutboundTaskDetailPage />} />
        <Route path="/inventory-inbound-task" element={<InventoryInboundTaskListPage />} />
        <Route
          path="/inventory-inbound-task/:projectNumber"
          element={<InventoryInboundTaskDetailPage />}
        />
        <Route path="/logistics-outbound-task" element={<LogisticsOutboundTaskListPage />} />
        <Route path="/logistics-outbound-task/:id" element={<LogisticsOutboundTaskDetailPage />} />
        <Route path="inventory-stock" element={<InventoryStockListPage />} />
        <Route path="/inventory-stock/:inventoryNumber" element={<InventoryDetailPage />} />

        <Route path="hrmanagement" element={<HRManagementPage />} />

        <Route path="test" element={<TestPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
