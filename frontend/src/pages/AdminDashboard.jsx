import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LogOut, Search, Trash2, Download, Phone, Mail, MapPin, MessageSquare,
  TrendingUp, Clock, Calendar, Award, Home as HomeIcon, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/apiClient";

const STATUSES = ["Pending", "Contacted", "Meeting Scheduled", "Quotation Sent", "Won", "Lost"];
const STATUS_COLORS = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Contacted: "bg-blue-100 text-blue-800 border-blue-200",
  "Meeting Scheduled": "bg-purple-100 text-purple-800 border-purple-200",
  "Quotation Sent": "bg-indigo-100 text-indigo-800 border-indigo-200",
  Won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Lost: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminDashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, month: 0, pending: 0, won: 0 });
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [meRes, leadsRes, statsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/admin/leads"),
        api.get("/admin/stats"),
      ]);
      setUser(meRes.data);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (e) {
      nav("/admin/login");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const logout = async () => {
    localStorage.removeItem("suja_token");
    try { await api.post("/auth/logout"); } catch {}
    nav("/admin/login");
  };

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return [l.name, l.phone, l.email, l.location, l.property_type].filter(Boolean).some(v => v.toLowerCase().includes(s));
    });
  }, [leads, q, statusFilter]);

  const updateLead = async (id, patch) => {
    try {
      const { data } = await api.patch(`/admin/leads/${id}`, patch);
      setLeads(prev => prev.map(l => l.id === id ? data : l));
      if (selected?.id === id) setSelected(data);
      toast.success("Updated.");
    } catch { toast.error("Update failed"); }
  };
  const removeLead = async (id) => {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      await api.delete(`/admin/leads/${id}`);
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelected(null);
      toast.success("Lead deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  const exportCSV = () => {
    const headers = ["Name","Phone","Email","Property","Location","Budget","Status","Created","Message"];
    const rows = filtered.map(l => [l.name, l.phone, l.email || "", l.property_type, l.location, l.budget || "", l.status, l.created_at, (l.message||"").replace(/\n/g," ")]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sujacontera-leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-brand-bg text-brand-primary/60">Loading…</div>;
  }

  const statCards = [
    { l: "Total Leads", v: stats.total, i: TrendingUp },
    { l: "Today", v: stats.today, i: Clock },
    { l: "This Month", v: stats.month, i: Calendar },
    { l: "Pending", v: stats.pending, i: HomeIcon },
    { l: "Won", v: stats.won, i: Award },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Topbar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-brand-bg/85 border-b border-brand-primary/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3" data-testid="admin-brand">
            <div className="w-9 h-9 rounded-full bg-brand-primary/5 border border-brand-primary/20 grid place-items-center">
              <span className="font-display text-brand-primary">S</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-brand-primary">Suja Contera</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-brand-secondary">Studio Console</div>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-primary/60 hidden sm:block" data-testid="admin-user-email">{user?.email}</span>
            <Button onClick={logout} variant="ghost" className="rounded-full text-brand-primary hover:bg-brand-primary/5" data-testid="admin-logout">
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="eyebrow mb-3">Leads Console</div>
          <h1 className="font-display font-light text-4xl md:text-5xl text-brand-primary">Good day, {user?.name?.split(" ")[0] || "Admin"}.</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {statCards.map(({ l, v, i: I }) => (
            <div key={l} className="bg-brand-card rounded-[18px] p-6 border border-brand-primary/5 shadow-[0_4px_20px_rgba(44,33,26,0.04)]" data-testid={`stat-${l.replace(/\s/g,'-').toLowerCase()}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-widest text-brand-secondary">{l}</div>
                <I className="w-4 h-4 text-brand-accent" />
              </div>
              <div className="font-display text-3xl md:text-4xl text-brand-primary">{v}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/40" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, phone, city…"
              className="pl-11 h-11 rounded-full bg-brand-card border-brand-primary/10 focus-visible:ring-brand-accent" data-testid="admin-search" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 h-11 rounded-full bg-brand-card border-brand-primary/10" data-testid="admin-status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} className="rounded-full bg-brand-primary text-brand-bg hover:bg-brand-secondary h-11" data-testid="admin-export">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* Table */}
        <div className="bg-brand-card rounded-[18px] border border-brand-primary/5 overflow-hidden shadow-[0_4px_20px_rgba(44,33,26,0.04)]">
          <Table data-testid="admin-leads-table">
            <TableHeader>
              <TableRow className="bg-brand-primary/[0.03] hover:bg-brand-primary/[0.03]">
                <TableHead className="text-brand-secondary uppercase text-xs tracking-widest">Customer</TableHead>
                <TableHead className="text-brand-secondary uppercase text-xs tracking-widest">Contact</TableHead>
                <TableHead className="text-brand-secondary uppercase text-xs tracking-widest">Property</TableHead>
                <TableHead className="text-brand-secondary uppercase text-xs tracking-widest">Location</TableHead>
                <TableHead className="text-brand-secondary uppercase text-xs tracking-widest">Status</TableHead>
                <TableHead className="text-brand-secondary uppercase text-xs tracking-widest">Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-16 text-brand-primary/40">No leads yet. New enquiries will appear here in real time.</TableCell></TableRow>
              ) : filtered.map(l => (
                <TableRow key={l.id} className="hover:bg-brand-accent/5 cursor-pointer" onClick={() => setSelected(l)} data-testid={`lead-row-${l.id}`}>
                  <TableCell className="font-medium text-brand-primary">{l.name}</TableCell>
                  <TableCell className="text-brand-primary/70">{l.phone}</TableCell>
                  <TableCell className="text-brand-primary/70">{l.property_type}</TableCell>
                  <TableCell className="text-brand-primary/70">{l.location}</TableCell>
                  <TableCell><Badge className={`${STATUS_COLORS[l.status] || ""} border font-normal`}>{l.status}</Badge></TableCell>
                  <TableCell className="text-brand-primary/50 text-sm">{new Date(l.created_at).toLocaleDateString()}</TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <button onClick={() => removeLead(l.id)} className="text-brand-primary/40 hover:text-red-600 transition-colors" data-testid={`delete-${l.id}`}><Trash2 className="w-4 h-4" /></button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Details Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-brand-bg overflow-y-auto" data-testid="lead-details-sheet">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-3xl text-brand-primary text-left">{selected.name}</SheetTitle>
                <div className="text-sm text-brand-secondary text-left mt-1">Submitted {new Date(selected.created_at).toLocaleString()}</div>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-brand-secondary mb-2">Status</div>
                  <Select value={selected.status} onValueChange={v => updateLead(selected.id, { status: v })}>
                    <SelectTrigger className="rounded-full bg-brand-card" data-testid="lead-status-select"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <DetailRow icon={Phone} label="Phone" value={<a href={`tel:${selected.phone}`} className="text-brand-primary hover:text-brand-accent">{selected.phone}</a>} />
                  {selected.email && <DetailRow icon={Mail} label="Email" value={<a href={`mailto:${selected.email}`} className="text-brand-primary hover:text-brand-accent">{selected.email}</a>} />}
                  <DetailRow icon={HomeIcon} label="Property" value={selected.property_type} />
                  <DetailRow icon={MapPin} label="Location" value={selected.location} />
                  {selected.budget && <DetailRow label="Budget" value={selected.budget} />}
                  {selected.message && <DetailRow icon={MessageSquare} label="Project Details" value={<span className="whitespace-pre-wrap">{selected.message}</span>} />}
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-brand-secondary mb-2">Internal Notes</div>
                  <Textarea rows={4} defaultValue={selected.notes || ""} onBlur={e => e.target.value !== (selected.notes || "") && updateLead(selected.id, { notes: e.target.value })}
                    className="bg-brand-card rounded-[12px]" placeholder="Follow-up context, quotation notes…" data-testid="lead-notes" />
                </div>

                <div className="flex gap-3 pt-2">
                  <a href={`tel:${selected.phone}`} className="flex-1"><Button className="w-full rounded-full bg-brand-primary text-brand-bg hover:bg-brand-secondary h-11"><Phone className="w-4 h-4 mr-2" />Call</Button></a>
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g,"")}?text=Hello%20${encodeURIComponent(selected.name)}%2C%20this%20is%20Suja%20Contera.`} target="_blank" rel="noreferrer" className="flex-1">
                    <Button className="w-full rounded-full bg-[#25D366] text-white hover:bg-[#1ea855] h-11"><MessageSquare className="w-4 h-4 mr-2" />WhatsApp</Button>
                  </a>
                </div>

                <button onClick={() => removeLead(selected.id)} className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2 mt-4">
                  <Trash2 className="w-4 h-4" /> Delete this lead
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({ icon: I, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-9 h-9 rounded-full bg-brand-primary/5 grid place-items-center shrink-0">
        {I && <I className="w-4 h-4 text-brand-secondary" />}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-brand-secondary">{label}</div>
        <div className="text-brand-primary mt-0.5">{value}</div>
      </div>
    </div>
  );
}
