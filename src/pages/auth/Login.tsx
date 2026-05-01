import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark to-navy opacity-90" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-9 w-9 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-3">DeeCampus ERP</h1>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Complete school management platform trusted by 500+ institutions. Manage admissions, academics, finance, transport, and more — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[["500+", "Schools"], ["1.2M", "Students"], ["99.9%", "Uptime"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-accent">{val}</p>
                <p className="text-xs text-primary-foreground/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">DeeCampus</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">ERP</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
              <Input id="email" type="email" placeholder="admin@school.com" className="h-10" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                <button className="text-xs text-accent hover:text-orange-dark transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-10 pr-10" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full h-10 bg-accent text-accent-foreground hover:bg-orange-dark font-medium" onClick={() => navigate("/")}>
              Sign In
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            © 2025 DeeCampus ERP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
