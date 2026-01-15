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
import InventoryHome from './pages/inventory-service/InventoryHome';
import LogisticsHome from './pages/logistics-service/LogisticsHome';
import ManagementHome from './pages/management-service/ManagementHome';
import ProtectedRoute from './components/common/ProtectedRoute';

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
        <Route
          path="signupsuccess"
          element={
            <ProtectedRoute>
              <SignupSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="signupfailure"
          element={
            <ProtectedRoute>
              <SignupFailurePage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="sidebartest"
          element={
            <ProtectedRoute>
              <Sidebartest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-management"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <ProjectManagementListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-create"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <ProjectCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbound-task"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <InboundTaskListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbound-task/:inventoryId"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <InboundTaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outbound-task"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <OutBoundTaskListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/outbound-task/:logisticsId"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <OutboundTaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-inbound-task"
          element={
            <ProtectedRoute>
              <InventoryInboundTaskListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-home"
          element={
            <ProtectedRoute>
              <InventoryHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-inbound-task/:projectNumber"
          element={
            <ProtectedRoute>
              <InventoryInboundTaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics-outbound-task"
          element={
            <ProtectedRoute>
              <LogisticsOutboundTaskListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="logistics-home"
          element={
            <ProtectedRoute>
              <LogisticsHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics-outbound-task/:id"
          element={
            <ProtectedRoute>
              <LogisticsOutboundTaskDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="inventory-stock"
          element={
            <ProtectedRoute>
              <InventoryStockListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-stock/:inventoryNumber"
          element={
            <ProtectedRoute>
              <InventoryDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="hrmanagement"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <HRManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="management-home"
          element={
            <ProtectedRoute requiredDepartment="MANAGEMENT">
              <ManagementHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
