# Codebase Index

## Snapshot

This is a Vite + React + TypeScript school ERP/admin interface named `vite_react_shadcn_ts`. The app uses React Router for module routing, TanStack Query for query context, Tailwind CSS for styling, shadcn/Radix UI primitives for reusable UI, lucide-react icons, and Recharts for dashboard/report visuals.

The product surface is branded in the UI as `DeeCampus ERP` and currently uses mostly local in-file seed data rather than a backend API layer.

## Run Commands

- `npm run dev`: start Vite dev server on port `8080`.
- `npm run build`: production build.
- `npm run build:dev`: development-mode build.
- `npm run lint`: run ESLint.
- `npm run preview`: preview built app.
- `npm run test`: run Vitest once.
- `npm run test:watch`: run Vitest in watch mode.

There are both npm and Bun lockfiles present: `package-lock.json`, `bun.lock`, and `bun.lockb`.

## Entry Points

- `index.html`: Vite HTML shell.
- `src/main.tsx`: creates the React root and imports global CSS.
- `src/App.tsx`: top-level providers and all route definitions.
- `src/index.css`: global Tailwind/theme CSS.
- `src/App.css`: app CSS, currently separate from global Tailwind setup.

## Core Providers

`src/App.tsx` wraps the app with:

- `QueryClientProvider` from `@tanstack/react-query`.
- `TooltipProvider`.
- `RoleProvider`.
- shadcn toast toaster and Sonner toaster.
- `BrowserRouter`.

## Routing Map

Routes are defined in `src/App.tsx`.

Public route:

- `/login` -> `src/pages/auth/Login.tsx`

Layout-wrapped routes under `AppLayout`:

- `/` -> `src/pages/Dashboard.tsx`
- `/admissions/enquiries` -> `src/pages/admissions/EnquiryList.tsx`
- `/admissions/enquiries/new` -> `src/pages/admissions/NewEnquiry.tsx`
- `/admissions/enquiries/:id` -> `src/pages/admissions/EnquiryDetail.tsx`
- `/admissions/pipeline` -> `src/pages/admissions/AdmissionPipeline.tsx`
- `/students` -> `src/pages/students/StudentList.tsx`
- `/students/new` -> `src/pages/students/StudentForm.tsx`
- `/students/:id` -> `src/pages/students/StudentDetail.tsx`
- `/students/:id/edit` -> `src/pages/students/StudentForm.tsx`
- `/students/promotion` -> `src/pages/students/StudentPromotion.tsx`
- `/students/documents` -> `src/pages/students/StudentDocuments.tsx`
- `/students/certificates` -> `src/pages/students/Certificates.tsx`
- `/staff` -> `src/pages/staff/StaffList.tsx`
- `/staff/new` -> `src/pages/staff/StaffForm.tsx`
- `/staff/:id` -> `src/pages/staff/StaffDetail.tsx`
- `/staff/:id/edit` -> `src/pages/staff/StaffForm.tsx`
- `/staff/attendance` -> `src/pages/staff/StaffAttendance.tsx`
- `/staff/leaves` -> `src/pages/staff/LeaveManagement.tsx`
- `/staff/payroll` -> `src/pages/staff/Payroll.tsx`
- `/academics/classes` -> `src/pages/academics/ClassesSections.tsx`
- `/academics/subjects` -> `src/pages/academics/Subjects.tsx`
- `/academics/calendar` -> `src/pages/academics/AcademicCalendar.tsx`
- `/attendance` -> `src/pages/attendance/AttendancePage.tsx`
- `/timetable` -> `src/pages/timetable/Timetable.tsx`
- `/fees/structure` -> `src/pages/fees/FeeStructure.tsx`
- `/fees/collect` -> `src/pages/fees/FeeCollection.tsx`
- `/fees/:id` -> `src/pages/fees/FeeLedger.tsx`
- `/fees/pending` -> `src/pages/fees/PendingDues.tsx`
- `/fees/reports` -> `src/pages/fees/FeeReports.tsx`
- `/fees/expenses` -> `src/pages/fees/ExpenseManagement.tsx`
- `/fees/cashbook` -> `src/pages/fees/Cashbook.tsx`
- `/exams/schedule` -> `src/pages/exams/ExamSchedule.tsx`
- `/exams/marks` -> `src/pages/exams/MarksEntry.tsx`
- `/exams/results` -> `src/pages/exams/Results.tsx`
- `/exams/report-cards` -> `src/pages/exams/ReportCards.tsx`
- `/exams/question-bank` -> `src/pages/exams/QuestionBank.tsx`
- `/transport/routes` -> `src/pages/transport/TransportRoutes.tsx`
- `/transport/vehicles` -> `src/pages/transport/Vehicles.tsx`
- `/transport/students` -> `src/pages/transport/TransportStudents.tsx`
- `/transport/tracking` -> `src/pages/transport/LiveTracking.tsx`
- `/communication/messages` -> `src/pages/communication/Messages.tsx`
- `/communication/announcements` -> `src/pages/communication/Announcements.tsx`
- `/communication/templates` -> `src/pages/communication/Templates.tsx`
- `/library` -> `src/pages/modules/Library.tsx`
- `/inventory` -> `src/pages/modules/Inventory.tsx`
- `/visitors` -> `src/pages/modules/Visitors.tsx`
- `/helpdesk` -> `src/pages/modules/Helpdesk.tsx`
- `/documents` -> `src/pages/modules/Documents.tsx`
- `/reports` -> `src/pages/reports/ReportsCenter.tsx`
- `/user-rights` -> `src/pages/settings/UserRights.tsx`
- `/settings/school` -> `src/pages/settings/SchoolProfile.tsx`
- `/settings/masters` -> `src/pages/settings/MasterSetup.tsx`
- `/settings/integrations` -> `src/pages/settings/Integrations.tsx`
- `/settings/audit` -> `src/pages/settings/AuditLogs.tsx`
- `*` -> `src/pages/NotFound.tsx`

## Layout

- `src/components/layout/AppLayout.tsx`: shell with collapsible sidebar, header, and route outlet.
- `src/components/layout/AppSidebar.tsx`: sidebar navigation, grouping, active state, role filtering, DeeCampus branding.
- `src/components/layout/AppHeader.tsx`: sidebar toggle, search field, role switcher, quick actions, notifications, user menu.

## Role System

- `src/contexts/RoleContext.tsx`: role state, user labels, permission booleans, and sidebar access rules.

Supported roles:

- `admin`: full access.
- `staff`: student, attendance, timetable, exams, communication, library access.
- `student`: dashboard, attendance, timetable, fees, exams access.

Important exports:

- `UserRole`
- `sidebarAccess`
- `RoleProvider`
- `useRole`

## Shared ERP Components

Located in `src/components/erp`.

- `ActivityTimeline.tsx`: activity/event timeline.
- `ConfirmDialog.tsx`: reusable confirmation dialog.
- `DataTable.tsx`: searchable/paginated table with filter/export buttons.
- `FileUpload.tsx`: upload control.
- `KPICard.tsx`: dashboard metric card.
- `PageHeader.tsx`: page title, subtitle, breadcrumbs, actions.
- `PlaceholderModule.tsx`: placeholder module shell.
- `QuickActions.tsx`: header quick action menu.
- `RoleSwitcher.tsx`: role-changing control for preview/demo.
- `StatusBadge.tsx`: reusable status label.

## UI Primitives

Located in `src/components/ui`.

This folder contains shadcn/Radix-style primitives such as `button`, `card`, `dialog`, `dropdown-menu`, `form`, `input`, `select`, `table`, `tabs`, `toast`, `tooltip`, `sidebar`, `chart`, and more.

Configuration:

- `components.json`: shadcn configuration.
- `src/lib/utils.ts`: `cn()` helper using `clsx` and `tailwind-merge`.

## Feature Modules

Feature pages live under `src/pages`.

- `academics`: classes/sections, subjects, academic calendar.
- `admissions`: enquiry list/detail/new enquiry, admission pipeline.
- `attendance`: student/class attendance page.
- `auth`: login page.
- `communication`: messages, announcements, templates.
- `exams`: exam schedule, marks entry, results, report cards, question bank.
- `fees`: structure, collection, ledger, pending dues, reports, expenses, cashbook.
- `modules`: library, inventory, visitors, helpdesk, documents.
- `reports`: reports center.
- `settings`: school profile, master setup, integrations, audit logs, user rights.
- `staff`: staff list/detail/form, attendance, leave management, payroll.
- `students`: student list/detail/form, promotion, documents, certificates.
- `timetable`: timetable grid.
- `transport`: routes, vehicles, assigned students, live tracking.

Most feature files are self-contained React components with local sample arrays named things like `seed`, `columns`, `students`, `staff`, or module-specific data.

## Styling

- Tailwind CSS is configured in `tailwind.config.ts`.
- Design tokens are exposed as CSS variables and consumed through Tailwind color names such as `background`, `foreground`, `primary`, `secondary`, `accent`, `sidebar`, `success`, `warning`, and `info`.
- Tailwind animations include `fade-in`, `slide-in`, `scale-in`, accordion animations, and `shimmer`.
- The `@` alias points to `src`.

## Testing

- `vitest.config.ts`: Vitest with React SWC, `jsdom`, globals, `src/test/setup.ts`, and `src/**/*.{test,spec}.{ts,tsx}` include pattern.
- `src/test/setup.ts`: test setup file.
- `src/test/example.test.ts`: sample test.
- `playwright.config.ts`: uses `createLovableConfig` from `lovable-agent-playwright-config/config`.
- `playwright-fixture.ts`: Playwright fixture support.

## Build Tooling

- `vite.config.ts`: Vite React SWC config, dev server on host `::` and port `8080`, HMR overlay disabled, `lovable-tagger` in development mode, `@` alias to `src`, and React/query dedupe entries.
- `eslint.config.js`: ESLint flat config.
- `postcss.config.js`: PostCSS setup.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configs.

## Public Assets

- `public/favicon.ico`
- `public/placeholder.svg`
- `public/robots.txt`

## Notes For Future Work

- There is no obvious API/client service layer yet; data appears mocked locally in feature components.
- Route registration and sidebar navigation are maintained separately, so new pages usually require edits in both `src/App.tsx` and `src/components/layout/AppSidebar.tsx`.
- Role visibility is controlled by sidebar labels in `RoleContext.tsx`, not by route guards.
- Some rendered text shows mojibake characters for rupee symbols, bullets, dashes, and birthday icons in source output. If polishing UI text, check file encoding and replace those literals carefully.
- This folder is not currently initialized as a Git repository.
