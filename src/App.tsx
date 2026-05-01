import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { RoleProvider } from "@/contexts/RoleContext";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import StudentList from "@/pages/students/StudentList";
import StudentDetail from "@/pages/students/StudentDetail";
import StudentForm from "@/pages/students/StudentForm";
import StudentPromotion from "@/pages/students/StudentPromotion";
import StudentDocuments from "@/pages/students/StudentDocuments";
import Certificates from "@/pages/students/Certificates";
import StaffList from "@/pages/staff/StaffList";
import StaffDetail from "@/pages/staff/StaffDetail";
import StaffForm from "@/pages/staff/StaffForm";
import StaffAttendance from "@/pages/staff/StaffAttendance";
import LeaveManagement from "@/pages/staff/LeaveManagement";
import Payroll from "@/pages/staff/Payroll";
import FeeCollection from "@/pages/fees/FeeCollection";
import FeeStructure from "@/pages/fees/FeeStructure";
import FeeLedger from "@/pages/fees/FeeLedger";
import PendingDues from "@/pages/fees/PendingDues";
import FeeReports from "@/pages/fees/FeeReports";
import ExpenseManagement from "@/pages/fees/ExpenseManagement";
import Cashbook from "@/pages/fees/Cashbook";
import EnquiryList from "@/pages/admissions/EnquiryList";
import EnquiryDetail from "@/pages/admissions/EnquiryDetail";
import NewEnquiry from "@/pages/admissions/NewEnquiry";
import AdmissionPipeline from "@/pages/admissions/AdmissionPipeline";
import AttendancePage from "@/pages/attendance/AttendancePage";
import ClassesSections from "@/pages/academics/ClassesSections";
import Subjects from "@/pages/academics/Subjects";
import AcademicCalendar from "@/pages/academics/AcademicCalendar";
import TimetablePage from "@/pages/timetable/Timetable";
import ExamSchedule from "@/pages/exams/ExamSchedule";
import MarksEntry from "@/pages/exams/MarksEntry";
import Results from "@/pages/exams/Results";
import ReportCards from "@/pages/exams/ReportCards";
import QuestionBank from "@/pages/exams/QuestionBank";
import TransportRoutes from "@/pages/transport/TransportRoutes";
import Vehicles from "@/pages/transport/Vehicles";
import TransportStudents from "@/pages/transport/TransportStudents";
import LiveTracking from "@/pages/transport/LiveTracking";
import MessagesPage from "@/pages/communication/Messages";
import Announcements from "@/pages/communication/Announcements";
import Templates from "@/pages/communication/Templates";
import LibraryPage from "@/pages/modules/Library";
import InventoryPage from "@/pages/modules/Inventory";
import VisitorsPage from "@/pages/modules/Visitors";
import HelpdeskPage from "@/pages/modules/Helpdesk";
import DocumentsPage from "@/pages/modules/Documents";
import ReportsCenter from "@/pages/reports/ReportsCenter";
import UserRights from "@/pages/settings/UserRights";
import SchoolProfile from "@/pages/settings/SchoolProfile";
import MasterSetup from "@/pages/settings/MasterSetup";
import IntegrationsPage from "@/pages/settings/Integrations";
import AuditLogs from "@/pages/settings/AuditLogs";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              {/* Admissions */}
              <Route path="/admissions/enquiries" element={<EnquiryList />} />
              <Route path="/admissions/enquiries/new" element={<NewEnquiry />} />
              <Route path="/admissions/enquiries/:id" element={<EnquiryDetail />} />
              <Route path="/admissions/pipeline" element={<AdmissionPipeline />} />
              {/* Students */}
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/new" element={<StudentForm mode="create" />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/students/:id/edit" element={<StudentForm mode="edit" />} />
              <Route path="/students/promotion" element={<StudentPromotion />} />
              <Route path="/students/documents" element={<StudentDocuments />} />
              <Route path="/students/certificates" element={<Certificates />} />
              {/* Staff */}
              <Route path="/staff" element={<StaffList />} />
              <Route path="/staff/new" element={<StaffForm mode="create" />} />
              <Route path="/staff/:id" element={<StaffDetail />} />
              <Route path="/staff/:id/edit" element={<StaffForm mode="edit" />} />
              <Route path="/staff/attendance" element={<StaffAttendance />} />
              <Route path="/staff/leaves" element={<LeaveManagement />} />
              <Route path="/staff/payroll" element={<Payroll />} />
              {/* Academics */}
              <Route path="/academics/classes" element={<ClassesSections />} />
              <Route path="/academics/subjects" element={<Subjects />} />
              <Route path="/academics/calendar" element={<AcademicCalendar />} />
              {/* Attendance */}
              <Route path="/attendance" element={<AttendancePage />} />
              {/* Timetable */}
              <Route path="/timetable" element={<TimetablePage />} />
              {/* Fees */}
              <Route path="/fees/structure" element={<FeeStructure />} />
              <Route path="/fees/collect" element={<FeeCollection />} />
              <Route path="/fees/:id" element={<FeeLedger />} />
              <Route path="/fees/pending" element={<PendingDues />} />
              <Route path="/fees/reports" element={<FeeReports />} />
              <Route path="/fees/expenses" element={<ExpenseManagement />} />
              <Route path="/fees/cashbook" element={<Cashbook />} />
              {/* Exams */}
              <Route path="/exams/schedule" element={<ExamSchedule />} />
              <Route path="/exams/marks" element={<MarksEntry />} />
              <Route path="/exams/results" element={<Results />} />
              <Route path="/exams/report-cards" element={<ReportCards />} />
              <Route path="/exams/question-bank" element={<QuestionBank />} />
              {/* Transport */}
              <Route path="/transport/routes" element={<TransportRoutes />} />
              <Route path="/transport/vehicles" element={<Vehicles />} />
              <Route path="/transport/students" element={<TransportStudents />} />
              <Route path="/transport/tracking" element={<LiveTracking />} />
              {/* Communication */}
              <Route path="/communication/messages" element={<MessagesPage />} />
              <Route path="/communication/announcements" element={<Announcements />} />
              <Route path="/communication/templates" element={<Templates />} />
              {/* Other modules */}
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/visitors" element={<VisitorsPage />} />
              <Route path="/helpdesk" element={<HelpdeskPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/reports" element={<ReportsCenter />} />
              <Route path="/user-rights" element={<UserRights />} />
              {/* Settings */}
              <Route path="/settings/school" element={<SchoolProfile />} />
              <Route path="/settings/masters" element={<MasterSetup />} />
              <Route path="/settings/integrations" element={<IntegrationsPage />} />
              <Route path="/settings/audit" element={<AuditLogs />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
