import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search } from "lucide-react";
import { useState } from "react";

const contacts = [
  { name: "Parent - Sharma Family", lastMsg: "Thank you for the update", time: "10:30 AM", unread: 2 },
  { name: "Mrs. Gupta (Teacher)", lastMsg: "Attendance report sent", time: "9:15 AM", unread: 0 },
  { name: "Parent - Patel Family", lastMsg: "When is the PTM?", time: "Yesterday", unread: 1 },
  { name: "Mr. Verma (Admin)", lastMsg: "Fee reminder sent", time: "Yesterday", unread: 0 },
  { name: "Parent - Singh Family", lastMsg: "Bus route changed?", time: "2 days ago", unread: 0 },
];

const messages = [
  { from: "parent", text: "Good morning. Is there a PTM scheduled this month?", time: "9:00 AM" },
  { from: "school", text: "Good morning! Yes, PTM is on 15th April from 10 AM to 1 PM.", time: "9:05 AM" },
  { from: "parent", text: "Thank you. Will both class teachers be available?", time: "9:10 AM" },
  { from: "school", text: "Yes, all class teachers will be available. You can also book a slot.", time: "9:15 AM" },
  { from: "parent", text: "Thank you for the update", time: "10:30 AM" },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Messages" subtitle="Communication hub for parents, staff, and students"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Communication" }, { label: "Messages" }]}
        actions={<Button>+ New Message</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
        <Card className="md:col-span-1 overflow-hidden">
          <div className="p-3 border-b"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search contacts..." className="pl-9" /></div></div>
          <CardContent className="p-0 overflow-auto">
            {contacts.map((c, i) => (
              <div key={i} onClick={() => setSelected(i)} className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selected === i ? "bg-muted" : ""}`}>
                <div className="flex justify-between"><span className="font-medium text-sm">{c.name}</span><span className="text-xs text-muted-foreground">{c.time}</span></div>
                <div className="flex justify-between mt-1"><span className="text-xs text-muted-foreground truncate">{c.lastMsg}</span>{c.unread > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 min-w-[20px] text-center">{c.unread}</span>}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          <div className="p-3 border-b font-medium text-sm">{contacts[selected].name}</div>
          <CardContent className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "school" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.from === "school" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <div>{m.text}</div><div className={`text-xs mt-1 ${m.from === "school" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-3 border-t flex gap-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
