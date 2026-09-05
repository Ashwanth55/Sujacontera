import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/apiClient";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect
    api.get("/auth/me").then(() => nav("/admin")).catch(() => {});
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.token) localStorage.setItem("suja_token", data.token);
      toast.success("Welcome back.");
      nav("/admin");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : (typeof detail === "string" ? detail : "Login failed.");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen walnut-surface grid place-items-center px-6 relative overflow-hidden">
      <div className="grain absolute inset-0" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/50 grid place-items-center">
              <span className="font-display text-lg text-brand-accent">S</span>
            </div>
            <div className="text-left">
              <div className="font-display text-brand-bg text-xl">Suja Contera</div>
              <div className="eyebrow">Studio Console</div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="bg-brand-card/98 backdrop-blur rounded-[24px] p-8 md:p-10 border border-brand-accent/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)]" data-testid="admin-login-form">
          <div className="w-12 h-12 rounded-full bg-brand-accent/10 grid place-items-center mb-6">
            <Lock className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-brand-primary mb-2">Sign in</h1>
          <p className="text-sm text-brand-primary/60 mb-8">Access the leads console.</p>

          <div className="space-y-6">
            <div>
              <Label className="text-xs uppercase tracking-widest text-brand-secondary">Email</Label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} data-testid="admin-email"
                className="mt-2 rounded-none border-0 border-b border-brand-primary/20 bg-transparent focus-visible:ring-0 focus:border-brand-accent px-0 h-11" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-brand-secondary">Password</Label>
              <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} data-testid="admin-password"
                className="mt-2 rounded-none border-0 border-b border-brand-primary/20 bg-transparent focus-visible:ring-0 focus:border-brand-accent px-0 h-11" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-8 w-full rounded-full bg-brand-primary text-brand-bg hover:bg-brand-secondary h-12" data-testid="admin-login-btn">
            {loading ? "Signing in…" : "Sign in"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <a href="/" className="mt-6 block text-center text-xs text-brand-primary/50 hover:text-brand-accent transition-colors">← Back to site</a>
        </form>
      </div>
    </div>
  );
}
