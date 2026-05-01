import { KPICard } from "@/components/erp/KPICard";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { useRole } from "@/contexts/RoleContext";
import {
  Users, GraduationCap, UserCheck, Receipt, TrendingUp,
  Calendar, Bus, AlertTriangle, ArrowUpRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const attendanceData = [
  { day: "Mon", present: 92, absent: 8 }, { day: "Tue", present: 89, absent: 11 },
  { day: "Wed", present: 94, absent: 6 }, { day: "Thu", present: 91, absent: 9 },
  { day: "Fri", present: 88, absent: 12 }, { day: "Sat", present: 85, absent: 15 },
];

const collectionData = [
  { month: "Jul", amount: 425000 }, { month: "Aug", amount: 380000 }, { month: "Sep", amount: 510000 },
  { month: "Oct", amount: 470000 }, { month: "Nov", amount: 520000 }, { month: "Dec", amount: 490000 },
  { month: "Jan", amount: 540000 }, { month: "Feb", amount: 480000 }, { month: "Mar", amount: 560000 },
];

const enquiryData = [
  { name: "New", value: 24, color: "hsl(210, 90%, 56%)" },
  { name: "Follow-up", value: 18, color: "hsl(30, 100%, 55%)" },
  { name: "Converted", value: 45, color: "hsl(152, 60%, 42%)" },
  { name: "Dropped", value: 8, color: "hsl(0, 84%, 60%)" },
];

const recentActivities = [
  { text: "Rohit Sharma (Class 10-A) fees collected — ₹12,500", time: "2 min ago", type: "paid" as const },
  { text: "New enquiry from Priya Patel — Class 5 admission", time: "15 min ago", type: "new" as const },
  { text: "Staff attendance marked — 45 present, 3 absent", time: "1 hour ago", type: "present" as const },
  { text: "Transport fee pending — 12 students overdue", time: "2 hours ago", type: "overdue" as const },
  { text: "Exam schedule published — Mid Term 2025-26", time: "3 hours ago", type: "active" as const },
];

const upcomingEvents = [
  { title: "Parent-Teacher Meeting", date: "Apr 5", type: "Meeting" },
  { title: "Annual Sports Day", date: "Apr 12", type: "Event" },
  { title: "Mid Term Exams Begin", date: "Apr 20", type: "Exam" },
  { title: "Summer Vacation Starts", date: "May 1", type: "Holiday" },
];

const birthdays = [
  { name: "Ananya Gupta", class: "8-B", type: "Student" },
  { name: "Rajesh Kumar", class: "Math Dept", type: "Staff" },
  { name: "Sneha Verma", class: "3-A", type: "Student" },
];

// Student-specific data
const studentResults = [
  { subject: "Mathematics", marks: 92, total: 100, grade: "A+" },
  { subject: "Science", marks: 88, total: 100, grade: "A" },
  { subject: "English", marks: 85, total: 100, grade: "A" },
  { subject: "Hindi", marks: 78, total: 100, grade: "B+" },
  { subject: "Social Studies", marks: 82, total: 100, grade: "A" },
];

export default function Dashboard() {
  const { role, user } = useRole();

  const greetings: Record<string, string> = {
    admin: "Welcome back, Admin. Here's what's happening today.",
    staff: `Welcome, ${user.name}. Here's your overview.`,
    student: `Welcome, ${user.name}. Here's your academic snapshot.`,
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Dashboard"
        subtitle={greetings[role]}
        breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]}
      />

      {/* Student Dashboard */}
      {role === "student" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Attendance" value="94.2%" change="1.3%" changeType="up" icon={UserCheck} variant="success" />
            <KPICard title="Fees Due" value="₹0" subtitle="All paid" icon={Receipt} variant="navy" />
            <KPICard title="Last Exam Rank" value="#3" subtitle="Class 10-A" icon={GraduationCap} variant="orange" />
            <KPICard title="Upcoming Exams" value="2" subtitle="Mid Term" icon={Calendar} variant="info" />
          </div>
          <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
            <h3 className="text-sm font-semibold mb-3">Recent Exam Results — Unit Test 1</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>{["Subject", "Marks", "Total", "Grade"].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {studentResults.map((r, i) => (
                    <tr key={i} className="border-t"><td className="px-4 py-2.5 font-medium">{r.subject}</td><td className="px-4 py-2.5">{r.marks}</td><td className="px-4 py-2.5">{r.total}</td><td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-success/10 text-success text-xs font-medium">{r.grade}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
            <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-accent" /></div>
                  <div className="min-w-0"><p className="text-xs font-medium truncate">{event.title}</p><p className="text-[10px] text-muted-foreground">{event.date} · {event.type}</p></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Staff Dashboard */}
      {role === "staff" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="My Classes" value="4" subtitle="10-A, 9-C, 8-B, 7-A" icon={GraduationCap} variant="navy" />
            <KPICard title="Total Students" value="142" icon={Users} />
            <KPICard title="Today's Attendance" value="94.2%" change="1.3%" changeType="up" icon={UserCheck} variant="success" />
            <KPICard title="Pending Marks" value="2" subtitle="Unit Test 1" icon={Calendar} variant="warning" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border shadow-sm p-5 lg:col-span-2 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-sm font-semibold">Class Attendance</h3><p className="text-xs text-muted-foreground">This week</p></div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220, 15%, 90%)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
                <h3 className="text-sm font-semibold mb-3">My Schedule Today</h3>
                <div className="space-y-2">
                  {[["Period 1", "10-A · Mathematics"], ["Period 3", "9-C · Mathematics"], ["Period 5", "8-B · Mathematics"], ["Period 7", "7-A · Mathematics"]].map(([p, c]) => (
                    <div key={p} className="flex items-center justify-between p-2 rounded bg-secondary/50 text-xs"><span className="font-medium">{p}</span><span className="text-muted-foreground">{c}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
                <h3 className="text-sm font-semibold mb-3">🎂 Today's Birthdays</h3>
                <div className="space-y-2">{birthdays.map((b, i) => (<div key={i} className="flex items-center justify-between text-xs"><span className="font-medium">{b.name}</span><span className="text-muted-foreground">{b.class}</span></div>))}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Admin Dashboard - Original */}
      {role === "admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Students" value="1,247" change="5.2%" changeType="up" icon={GraduationCap} variant="navy" />
            <KPICard title="Total Staff" value="86" change="2 new" changeType="up" icon={Users} variant="default" />
            <KPICard title="Today's Attendance" value="94.2%" change="1.3%" changeType="up" icon={UserCheck} variant="success" />
            <KPICard title="Fee Collection Today" value="₹1,45,200" change="12.5%" changeType="up" icon={Receipt} variant="orange" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Monthly Collection" value="₹18.2L" subtitle="April 2025" icon={TrendingUp} />
            <KPICard title="Pending Dues" value="₹4.8L" change="3.1%" changeType="down" icon={AlertTriangle} variant="warning" />
            <KPICard title="Active Routes" value="14" subtitle="328 students" icon={Bus} />
            <KPICard title="Upcoming Events" value="4" subtitle="This week" icon={Calendar} variant="info" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border shadow-sm p-5 lg:col-span-2 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-sm font-semibold">Attendance Trend</h3><p className="text-xs text-muted-foreground">This week's student attendance</p></div>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">This Week</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220, 15%, 90%)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
              <h3 className="text-sm font-semibold mb-1">Enquiry Funnel</h3>
              <p className="text-xs text-muted-foreground mb-3">Admission pipeline</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart><Pie data={enquiryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">{enquiryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {enquiryData.map((item) => (<div key={item.name} className="flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-muted-foreground">{item.name}</span><span className="font-semibold ml-auto">{item.value}</span></div>))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border shadow-sm p-5 lg:col-span-2 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-sm font-semibold">Collection Trends</h3><p className="text-xs text-muted-foreground">Monthly fee collection</p></div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220, 15%, 90%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Collection"]} />
                  <Line type="monotone" dataKey="amount" stroke="hsl(30, 100%, 55%)" strokeWidth={2.5} dot={{ fill: "hsl(30, 100%, 55%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
                <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <StatusBadge status={activity.type} className="mt-0.5 scale-75 origin-left" />
                      <div className="flex-1 min-w-0"><p className="text-xs leading-relaxed truncate">{activity.text}</p><p className="text-[10px] text-muted-foreground">{activity.time}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
                <h3 className="text-sm font-semibold mb-3">🎂 Today's Birthdays</h3>
                <div className="space-y-2">{birthdays.map((b, i) => (<div key={i} className="flex items-center justify-between text-xs"><span className="font-medium">{b.name}</span><span className="text-muted-foreground">{b.class}</span></div>))}</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
            <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-accent" /></div>
                  <div className="min-w-0"><p className="text-xs font-medium truncate">{event.title}</p><p className="text-[10px] text-muted-foreground">{event.date} · {event.type}</p></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
