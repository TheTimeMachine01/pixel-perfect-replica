import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownToLine,
  Check,
  ChevronDown,
  Clipboard,
  Code2,
  Cpu,
  HardDrive,
  House,
  Layers3,
  Mail,
  Menu,
  Monitor,
  Network,
  Power,
  Shield,
  Terminal as TerminalIcon,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import details from "@/data/portfolio-details.json";

type SecurityItem = (typeof details.security)[number];
type Project = (typeof details.projects)[number];
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ashish Verma — Linux & Cloud Administrator" },
      {
        name: "description",
        content: "Ashish Verma's Linux systems administration portfolio: RHCSA certification, security posture, and hands-on infrastructure labs.",
      },
      { property: "og:title", content: "Ashish Verma — Linux & Cloud Administrator" },
      {
        property: "og:description",
        content: "RHCSA-certified Linux and cloud administration, security hardening, and hands-on systems labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [clock, setClock] = useState("--:--");
  const [lightTheme, setLightTheme] = useState(false);
  const [recruiterView, setRecruiterView] = useState(true);
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityItem | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalValue, setTerminalValue] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "ashish@rhel-workstation:~$ help",
    "Available: help · whoami · neofetch · ls labs · skills · contact · clear",
  ]);

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !lightTheme);
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [lightTheme]);

  const commandResults = useMemo(
    () => ({
      help: "Available: help · whoami · neofetch · ls labs · skills · contact · clear",
      whoami: `${details.name} — ${details.role}`,
      neofetch: `OS: ${details.platforms.join(" · ")}   Cert: ${details.certification}   Uptime: ${details.uptime}`,
      "ls labs": details.projects.map((project) => project.id).join("  "),
      skills: "RHEL · systemd · SELinux · Podman · LVM · KVM/QEMU · Firewalld · Kdump",
      contact: [details.contact.email, details.contact.linkedin, details.contact.github]
        .filter(Boolean)
        .join("  ") || "Contact details have not been added yet.",
    }),
    [],
  );

  const showTerminal = () => {
    setTerminalOpen(true);
    window.setTimeout(() => document.getElementById("terminal-input")?.focus(), 80);
  };

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = terminalValue.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setTerminalLines([]);
    } else {
      const result = commandResults[command as keyof typeof commandResults];
      setTerminalLines((lines) => [
        ...lines,
        `ashish@rhel-workstation:~$ ${terminalValue.trim()}`,
        result ?? `bash: ${command}: command not found — try help`,
      ]);
    }
    setTerminalValue("");
  };

  const copyText = async (value: string, label: string) => {
    if (!value) {
      toast.info(`${label} hasn’t been added yet.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn’t copy to clipboard");
    }
  };

  const resumeButton = (className = "") =>
    details.contact.resumePdf ? (
      <Button asChild className={className}>
        <a href={details.contact.resumePdf} target="_blank" rel="noreferrer" download>
          <ArrowDownToLine /> Download CV
        </a>
      </Button>
    ) : (
      <Button className={className} variant="outline" onClick={() => toast.info("Resume PDF hasn’t been added yet.")}>
        <ArrowDownToLine /> Download CV
      </Button>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="system-bar sticky top-0 z-40 flex h-10 items-center justify-between border-b border-border bg-top-bar px-3 text-xs text-foreground sm:px-6">
        <a href="#home" className="flex min-w-0 items-center gap-2 font-medium" aria-label="Ashish Verma home">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-blue text-[10px] font-bold text-primary-foreground">A</span>
          <span className="hidden sm:inline">ashish@rhel-workstation</span>
          <span className="sm:hidden">ashish@rhel</span>
        </a>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3 font-medium text-foreground hover:bg-secondary">
              {clock} <ChevronDown className="ml-1 size-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-border bg-card" align="center">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-positive/15 text-positive"><Activity className="size-5" /></div>
              <div>
                <p className="font-semibold">Available for opportunities</p>
                <p className="mt-1 text-sm text-muted-foreground">{details.availability}</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-foreground hover:bg-secondary" aria-label="Quick settings">
              <Network className="size-4" /><Shield className="hidden size-4 sm:block" /><Power className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-border bg-card" align="end">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div><p className="font-semibold">Quick settings</p><p className="text-xs text-muted-foreground">Personalize your view</p></div>
              <Menu className="size-4 text-muted-foreground" />
            </div>
            <SettingRow icon={<Monitor />} label="Light appearance" checked={lightTheme} onCheckedChange={setLightTheme} />
            <SettingRow icon={<UserRound />} label="Recruiter view" checked={recruiterView} onCheckedChange={setRecruiterView} />
            <div className="mt-4 border-t border-border pt-4">{resumeButton("w-full")}</div>
          </PopoverContent>
        </Popover>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-8 sm:px-8 sm:pt-12">
        <section id="home" className="scroll-mt-16">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-positive" /> WORKSTATION / HOME</span>
            <span className="font-mono">SESSION 01 · RHCSA</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex h-11 items-center justify-between border-b border-border bg-window-header px-4">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-destructive/80" /><span className="size-2.5 rounded-full bg-chart-4" /><span className="size-2.5 rounded-full bg-positive" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">about — {details.handle}</span>
              <span className="w-10" />
            </div>
            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
              <div className="flex flex-col justify-center">
                <p className="mb-4 flex items-center gap-2 text-sm font-medium text-positive"><span className="size-2 rounded-full bg-positive" /> {details.certification} CERTIFIED</p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">{details.headline}</h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{details.intro}</p>
                {!recruiterView && <p className="mt-3 max-w-xl border-l-2 border-accent-blue pl-3 text-sm leading-6 text-muted-foreground">Hands-on labs across RHEL, Arch Linux, containers, storage, systemd, and virtualized test environments.</p>}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button onClick={showTerminal}><TerminalIcon /> Open terminal</Button>
                  {resumeButton("")}
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><Check className="size-4 text-positive" /> {details.role}</span>
                  <span className="flex items-center gap-2"><Network className="size-4 text-accent-blue" /> {details.platforms.join(" · ")}</span>
                </div>
              </div>
              <SystemSummary />
            </div>
          </div>
        </section>

        <section id="security" className="scroll-mt-16 pt-12 sm:pt-16">
          <SectionHeading eyebrow="SYSTEM STATUS" title="Security & hardening" note="Configured with a defense-in-depth mindset." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {details.security.map((item) => (
              <Button key={item.id} variant="outline" onClick={() => setSelectedSecurity(item)} className="h-auto min-h-24 justify-start whitespace-normal rounded-lg border-border bg-card p-4 text-left shadow-none hover:border-positive/50 hover:bg-secondary">
                <div className="flex w-full items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-positive/10 text-positive"><Shield className="size-4" /></span>
                  <span className="min-w-0"><span className="block text-xs text-muted-foreground">{item.title}</span><span className="mt-1 block text-sm font-semibold text-foreground">{item.value}</span></span>
                </div>
              </Button>
            ))}
          </div>
        </section>

        <section id="labs" className="scroll-mt-16 pt-12 sm:pt-16">
          <SectionHeading eyebrow="HANDS-ON WORK" title="Infrastructure labs" note="Practical systems work, documented from design through operations." />
          <div className="grid gap-4 md:grid-cols-2">
            {details.projects.map((project, index) => <ProjectWindow key={project.id} project={project} index={index} onCopy={copyText} />)}
          </div>
        </section>

        <section id="contact" className="scroll-mt-16 pb-8 pt-12 sm:pt-16">
          <SectionHeading eyebrow="CONTACT" title={details.contactHeading} note={details.contactIntro} />
          <div className="grid gap-8 border-y border-border py-7 md:grid-cols-[1fr_1fr] md:items-center">
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Open to starting a conversation about Linux systems and cloud administration opportunities.</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <ContactAction label="Email" value={details.contact.email} icon={<Mail />} onCopy={copyText} />
              <ContactAction label="LinkedIn" value={details.contact.linkedin} icon={<UserRound />} onCopy={copyText} />
              <ContactAction label="GitHub" value={details.contact.github} icon={<Code2 />} onCopy={copyText} />
            </div>
          </div>
        </section>
      </main>

      <nav aria-label="Portfolio sections" className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur">
        <DockButton label="Home" href="#home" icon={<House />} />
        <DockButton label="Labs" href="#labs" icon={<Layers3 />} />
        <DockButton label="Security" href="#security" icon={<Shield />} />
        <Button variant="ghost" size="icon" className="size-10 rounded-lg" aria-label="Terminal" title="Terminal" onClick={showTerminal}><TerminalIcon /></Button>
        <DockButton label="Contact" href="#contact" icon={<Mail />} />
      </nav>

      {terminalOpen && (
        <aside className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:inset-x-6" aria-label="Interactive terminal">
          <div className="flex items-center justify-between border-b border-border bg-window-header px-4 py-3">
            <span className="flex items-center gap-2 font-mono text-xs"><TerminalIcon className="size-4 text-positive" /> ashish@rhel-workstation:~</span>
            <Button variant="ghost" size="icon" className="size-8" aria-label="Close terminal" onClick={() => setTerminalOpen(false)}><X /></Button>
          </div>
          <div className="max-h-56 overflow-y-auto p-4 font-mono text-xs leading-6 sm:text-sm" aria-live="polite">
            {terminalLines.map((line, index) => <p key={`${index}-${line}`} className={line.startsWith("ashish@") ? "text-positive" : "text-muted-foreground"}>{line}</p>)}
            <form onSubmit={runCommand} className="mt-2 flex items-center gap-2">
              <span className="shrink-0 text-positive">ashish@rhel-workstation:~$</span>
              <Input id="terminal-input" autoComplete="off" spellCheck={false} aria-label="Terminal command" value={terminalValue} onChange={(event) => setTerminalValue(event.target.value)} className="h-7 border-0 bg-transparent px-0 font-mono text-sm shadow-none focus-visible:ring-0" />
            </form>
          </div>
        </aside>
      )}

      <Dialog open={selectedSecurity !== null} onOpenChange={(open) => !open && setSelectedSecurity(null)}>
        <DialogContent className="border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"> <Shield className="size-5 text-positive" /> {selectedSecurity?.title}</DialogTitle>
            <DialogDescription>{selectedSecurity?.value}</DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6 text-muted-foreground">{selectedSecurity?.detail}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingRow({ icon, label, checked, onCheckedChange }: { icon: ReactNode; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between py-2"><span className="flex items-center gap-3 text-sm"><span className="text-muted-foreground">{icon}</span>{label}</span><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} /></div>;
}

function SystemSummary() {
  const rows = [
    { label: "OS", value: details.platforms.join(" / "), icon: <Monitor /> },
    { label: "Certification", value: details.certification, icon: <Shield /> },
    { label: "Uptime", value: details.uptime, icon: <Activity /> },
    { label: "Security", value: details.security[0]?.value ?? "Configured", icon: <Check /> },
  ];
  return <div className="overflow-hidden rounded-lg border border-border bg-background">
    <div className="flex items-center justify-between border-b border-border bg-window-header px-4 py-3"><span className="font-mono text-xs text-muted-foreground">SYSTEM SUMMARY</span><span className="size-2 rounded-full bg-positive" /></div>
    <div className="p-4 sm:p-5">
      <div className="mb-5 flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-blue"><Cpu className="size-6" /></div><div><p className="font-semibold">{details.handle}</p><p className="text-xs text-muted-foreground">Linux workstation</p></div></div>
      <div className="space-y-3">{rows.map((row) => <div key={row.label} className="grid grid-cols-[24px_88px_1fr] items-center gap-2 text-sm"><span className="text-muted-foreground">{row.icon}</span><span className="text-muted-foreground">{row.label}</span><span className="font-medium">{row.value}</span></div>)}</div>
      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><HardDrive className="size-4" /> Systems-focused · security-minded · operations-ready</div>
    </div>
  </div>;
}

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-semibold text-accent-blue">{eyebrow}</p><h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2></div><p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-right">{note}</p></div>;
}

function ProjectWindow({ project, index, onCopy }: { project: Project; index: number; onCopy: (value: string, label: string) => void }) {
  const [showSnippet, setShowSnippet] = useState(false);
  return <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
    <div className="flex min-h-11 items-center justify-between gap-2 border-b border-border bg-window-header px-4 py-2"><div className="flex min-w-0 items-center gap-2"><span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent-blue/15 text-accent-blue">{index === 0 ? <Activity /> : index === 1 ? <Cpu /> : index === 2 ? <HardDrive /> : <Layers3 />}</span><span className="truncate font-medium">{project.title}</span></div><span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground sm:block">LAB {String(index + 1).padStart(2, "0")}</span></div>
    <div className="p-4 sm:p-5"><p className="text-[10px] font-semibold text-accent-blue">{project.category}</p><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{project.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3"><div className="flex items-center gap-2 text-xs"><span className={showSnippet ? "text-muted-foreground" : "font-medium"}>Overview</span><Switch checked={showSnippet} onCheckedChange={setShowSnippet} aria-label={`${project.title} show CLI snippet`} /><span className={showSnippet ? "font-medium" : "text-muted-foreground"}>CLI</span></div>{showSnippet && <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onCopy(project.snippet, "CLI snippet")}><Clipboard /> Copy</Button>}</div>
      {showSnippet ? <pre className="mt-3 max-h-44 overflow-auto rounded-md border border-border bg-background p-3 font-mono text-xs leading-5 text-muted-foreground"><code>{project.snippet}</code></pre> : <div className="mt-3 rounded-md bg-secondary/60 p-3"><p className="mb-1 text-[10px] font-semibold text-muted-foreground">ARCHITECTURE</p><p className="text-xs leading-5 text-foreground">{project.architecture}</p><p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">{project.detail}</p></div>}
    </div>
  </article>;
}

function ContactAction({ label, value, icon, onCopy }: { label: string; value: string; icon: ReactNode; onCopy: (value: string, label: string) => void }) {
  return <Button variant="outline" onClick={() => onCopy(value, label)} className="h-auto min-h-10 justify-start gap-2 rounded-md px-3 text-xs"><span className="text-accent-blue">{icon}</span><span className="truncate">{value || `Add ${label}`}</span><Clipboard className="ml-auto size-3 shrink-0 text-muted-foreground" /></Button>;
}

function DockButton({ label, href, icon }: { label: string; href: string; icon: ReactNode }) {
  return <Button asChild variant="ghost" size="icon" className="size-10 rounded-lg" title={label} aria-label={label}><a href={href}>{icon}</a></Button>;
}