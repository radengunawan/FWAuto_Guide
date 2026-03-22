"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle2, Circle, ChevronRight, Terminal, Zap,
  Download, LogIn, FolderOpen, Hammer, Rocket, Activity,
  Copy, Check, Info, AlertTriangle, ArrowRight, ExternalLink,
  ChevronDown, Play, Cpu, BookOpen, Menu, X
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "install",
    number: "01",
    icon: Download,
    color: "blue",
    title: "Install FWAuto",
    subtitle: "Get the tool onto your machine in one command",
    duration: "~2 min",
    content: {
      intro: "FWAuto installs via a single command. The installer automatically detects your environment, checks for Node.js and Python dependencies, then installs the FWAuto core and AI interface (Claude Code).",
      platform: true,
      commands: {
        windows: [
          { type: "comment", text: "# Open PowerShell as Administrator, then run:" },
          { type: "cmd", text: 'powershell -ExecutionPolicy ByPass -c "irm https://fwauto.ai/install.ps1 | iex"' },
        ],
        macos: [
          { type: "comment", text: "# Open Terminal, then run:" },
          { type: "cmd", text: "curl -LsSf https://fwauto.ai/install.sh | bash" },
        ],
      },
      output: [
        { type: "out", text: "[INFO] Checking environment..." },
        { type: "out", text: "[INFO] Node.js installed: v24.13.0" },
        { type: "out", text: "[INFO] Environment check passed!" },
        { type: "out", text: "[INFO] Installing fwauto..." },
        { type: "out", text: "[INFO] fwauto installation complete" },
        { type: "out", text: "[INFO] Installing AI CLI tools..." },
        { type: "success", text: "[INFO] Installation complete!" },
        { type: "out", text: "Run: fwauto --help" },
      ],
      tips: [
        { type: "tip", text: "The installer takes 1–3 minutes. Let it run — do not close the terminal." },
        { type: "warning", text: "Windows users: run PowerShell as Administrator, not regular PowerShell." },
      ],
      verify: {
        cmd: "fwauto --help",
        description: "Run this to confirm FWAuto installed correctly. You should see the FWAuto logo and a list of commands.",
      },
    },
  },
  {
    id: "auth",
    number: "02",
    icon: LogIn,
    color: "purple",
    title: "Connect Your AI Account",
    subtitle: "Link FWAuto to your account with Google login",
    duration: "~1 min",
    content: {
      intro: "FWAuto uses Google OAuth to authenticate. This links your account so AI features — like automatic code analysis, log interpretation, and error repair — work correctly.",
      commands: {
        all: [
          { type: "cmd", text: "fwauto auth login" },
        ],
      },
      steps: [
        { icon: "🌐", title: "Browser opens automatically", desc: "FWAuto opens your browser to a Google login page." },
        { icon: "👤", title: "Select your Google account", desc: "Choose the Google account linked to your FWAuto registration." },
        { icon: "✅", title: "Grant permission", desc: "Google asks to share your name and email with FWAuto. Click Continue." },
        { icon: "🔒", title: "Close browser, return to terminal", desc: "You'll see \"Login Successful!\" — close the tab and come back." },
      ],
      verify: {
        cmd: "fwauto auth status",
        expectedOutput: [
          { type: "out", text: "Status:  ✅ Logged in" },
          { type: "out", text: "User:    Your Name" },
          { type: "out", text: "Email:   your@gmail.com" },
          { type: "success", text: "Token:   ✅ Valid" },
        ],
        description: "Run this after login to confirm your session is active.",
      },
      tips: [
        { type: "tip", text: "Use the same Google account you registered with on fwauto.ai." },
        { type: "warning", text: "If auth fails, run: fwauto auth logout, then fwauto auth login again." },
      ],
    },
  },
  {
    id: "project",
    number: "03",
    icon: FolderOpen,
    color: "amber",
    title: "Open Your Project",
    subtitle: "Navigate to your firmware folder and let AI scan it",
    duration: "~1 min",
    content: {
      intro: "Navigate to your firmware project directory. When you run any FWAuto command for the first time, it automatically scans the project — detecting your hardware configuration, MCU type, and compiler toolchain.",
      commands: {
        all: [
          { type: "comment", text: "# Navigate to your firmware project folder" },
          { type: "cmd", text: "cd /path/to/your-firmware-project" },
          { type: "comment", text: "# View available commands or enter chat mode" },
          { type: "cmd", text: "fwauto --help" },
        ],
      },
      detection: {
        title: "What FWAuto detects automatically",
        items: [
          { label: "MCU", value: "Renesas RA8T2 (Cortex-M85)", icon: "🔲" },
          { label: "NPU", value: "Ethos-U55 Neural Processing Unit", icon: "🧠" },
          { label: "Toolchain", value: "ARM GCC / IAR / Keil MDK", icon: "🔧" },
          { label: "Project type", value: "Bare-metal / RTOS / Azure RTOS", icon: "📁" },
        ],
      },
      tips: [
        { type: "tip", text: "You can also enter Chat Mode by running fwauto with no arguments — then describe what you want in plain English." },
        { type: "info", text: "FWAuto works with Renesas RA8T2, RA6, RA4, AM62X, Arduino, STM32, and more." },
      ],
    },
  },
  {
    id: "build",
    number: "04",
    icon: Hammer,
    color: "blue",
    title: "Build Your Firmware",
    subtitle: "Compile with one command — AI fixes errors automatically",
    duration: "~3 min",
    content: {
      intro: "Tell FWAuto to build your firmware. You can use a plain English instruction or the build command directly. If compilation fails, the AI automatically diagnoses the error and attempts to fix it — up to 3 times.",
      commands: {
        all: [
          { type: "comment", text: "# Option A: plain English in chat mode" },
          { type: "cmd", text: 'fwauto "please help to build environment"' },
          { type: "comment", text: "# Option B: direct command" },
          { type: "cmd", text: "fwauto build" },
          { type: "comment", text: "# Option C: click the Build button in the dashboard" },
        ],
      },
      output: [
        { type: "out", text: "🔍 Scanning project structure..." },
        { type: "out", text: "📦 Invoking compiler toolchain..." },
        { type: "out", text: "⚙  Compiling src/main.c" },
        { type: "out", text: "⚙  Compiling src/motor_control.c" },
        { type: "out", text: "⚙  Compiling src/hal_ra8t2.c" },
        { type: "out", text: "🔗 Linking..." },
        { type: "success", text: "✅ Build succeeded → output/firmware.elf" },
        { type: "success", text: "✅ Binary ready → output/firmware.bin" },
      ],
      autoFix: {
        title: "AI Auto-Repair",
        desc: "If the build fails, FWAuto doesn't just show you the error. It reads it, diagnoses the cause, suggests a fix, applies it, and rebuilds — automatically. Up to 3 attempts.",
        steps: ["Build fails", "AI reads error output", "Diagnoses root cause", "Applies fix", "Rebuilds"],
      },
      tips: [
        { type: "tip", text: "AI auto-repair works for compilation errors. Configuration errors (wrong SDK path, missing Makefile) need manual fixing." },
      ],
    },
  },
  {
    id: "deploy",
    number: "05",
    icon: Rocket,
    color: "green",
    title: "Deploy to Your Device",
    subtitle: "Flash firmware to the board over J-Link or network",
    duration: "~1 min",
    content: {
      intro: "Once built, deploy the firmware to your hardware. FWAuto uses your configured debugger (J-Link, OpenOCD, etc.) or network connection to flash the binary. A success message confirms the deployment.",
      commands: {
        all: [
          { type: "cmd", text: "fwauto deploy" },
          { type: "comment", text: "# With startup arguments:" },
          { type: "cmd", text: 'fwauto deploy --binary-args "on"' },
        ],
      },
      output: [
        { type: "out", text: "🔌 Connecting to J-Link debugger..." },
        { type: "out", text: "🔍 Detecting target: Renesas RA8T2" },
        { type: "out", text: "📤 Flashing firmware.bin → 0x00000000" },
        { type: "out", text: "⠋ Programming [████████████░░░░] 75%" },
        { type: "out", text: "⠋ Programming [████████████████] 100%" },
        { type: "out", text: "🔄 Verifying flash..." },
        { type: "success", text: "✅ Deployment Complete" },
        { type: "success", text: "✅ Device is running the new firmware" },
      ],
      methods: [
        { icon: "🔗", name: "J-Link", desc: "Recommended for Renesas RA boards" },
        { icon: "🌐", name: "Network (SSH)", desc: "For Linux-based boards like AM62X" },
        { icon: "🔌", name: "Serial / UART", desc: "For Arduino and similar boards" },
        { icon: "⚙️", name: "Custom command", desc: "For any other deployment tool" },
      ],
      tips: [
        { type: "tip", text: "Make sure your J-Link or debugger is connected and recognized before running deploy." },
      ],
    },
  },
  {
    id: "logs",
    number: "06",
    icon: Activity,
    color: "teal",
    title: "AI Log Analysis",
    subtitle: "Ask the AI questions about your UART output in plain English",
    duration: "~2 min",
    content: {
      intro: "This is FWAuto's most powerful feature. Instead of manually searching through thousands of lines of serial output, you ask the AI a question in plain English. It reads the UART log, understands the context, and gives you a full diagnostic report.",
      commands: {
        all: [
          { type: "comment", text: "# Analyze the most recent log" },
          { type: "cmd", text: 'fwauto log "Are there any errors?"' },
          { type: "comment", text: "# Analyze a specific log file" },
          { type: "cmd", text: 'fwauto log "Analyze this log" --log-path /path/to/uart.log' },
          { type: "comment", text: "# In chat mode" },
          { type: "cmd", text: 'fwauto "Why are motor control parameters not outputting?"' },
        ],
      },
      examples: [
        { q: "Are there any errors?", a: "Found 2 issues: baud rate mismatch on UART2 (expected 115200, got 9600), and motor_init() not called before motor_control() on line 247." },
        { q: "Why did the system restart?", a: "Watchdog timer triggered at T+2.3s. Stack overflow detected in task_sensor_read(). Recommend increasing stack size from 512 to 1024 bytes." },
        { q: "Is the NPU initialized correctly?", a: "Ethos-U55 initialized successfully. Driver version 1.2.3 loaded. 3 inference runs completed with avg latency 4.2ms." },
      ],
      tips: [
        { type: "tip", text: "You can ask anything — the AI understands firmware and embedded systems context." },
        { type: "info", text: "Common questions: baud rate issues, hardware connection checks, motor control debugging, boot sequence analysis." },
      ],
    },
  },
];

const COLORS: Record<string, { bg: string; border: string; text: string; glow: string; badge: string; dot: string }> = {
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400",   glow: "shadow-blue-500/20",   badge: "bg-blue-500/20 text-blue-300",   dot: "bg-blue-500" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20", badge: "bg-purple-500/20 text-purple-300", dot: "bg-purple-500" },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-400",  glow: "shadow-amber-500/20",  badge: "bg-amber-500/20 text-amber-300",  dot: "bg-amber-500" },
  green:  { bg: "bg-emerald-500/10",border: "border-emerald-500/30",text: "text-emerald-400",glow: "shadow-emerald-500/20",badge: "bg-emerald-500/20 text-emerald-300",dot: "bg-emerald-500" },
  teal:   { bg: "bg-teal-500/10",   border: "border-teal-500/30",   text: "text-teal-400",   glow: "shadow-teal-500/20",   badge: "bg-teal-500/20 text-teal-300",   dot: "bg-teal-500" },
};

// ─── Utility ─────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Components ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeLine({ line }: { line: { type: string; text: string } }) {
  const classes: Record<string, string> = {
    cmd:     "text-emerald-400 font-mono",
    out:     "text-slate-400 font-mono",
    success: "text-emerald-300 font-mono",
    comment: "text-slate-600 font-mono italic",
    file:    "text-amber-300 font-mono",
    error:   "text-red-400 font-mono",
  };
  const prefix = line.type === "cmd" ? "$ " : "  ";
  return (
    <div className={cn("text-sm leading-relaxed py-0.5", classes[line.type] || "text-slate-400 font-mono")}>
      <span className="select-none text-slate-600">{prefix}</span>
      {line.text}
    </div>
  );
}

function TerminalBlock({
  lines,
  title,
  copyText,
}: {
  lines: { type: string; text: string }[];
  title?: string;
  copyText?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          {title && (
            <span className="text-xs text-slate-500 ml-2 font-mono">{title}</span>
          )}
        </div>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {/* Terminal body */}
      <div className="bg-[#0D1117] px-5 py-4 space-y-0.5 scanlines relative">
        {lines.map((line, i) => (
          <CodeLine key={i} line={line} />
        ))}
        <div className="flex items-center gap-0 mt-1">
          <span className="text-slate-600 font-mono text-sm select-none">$ </span>
          <span className="w-2 h-4 bg-emerald-400/70 ml-0.5 cursor-blink" />
        </div>
      </div>
    </div>
  );
}

function TipCard({ type, text }: { type: string; text: string }) {
  const config: Record<string, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
    tip:     { icon: <Info size={14} />,          bg: "bg-blue-500/5",   border: "border-blue-500/20",   text: "text-blue-300" },
    warning: { icon: <AlertTriangle size={14} />, bg: "bg-amber-500/5",  border: "border-amber-500/20",  text: "text-amber-300" },
    info:    { icon: <Info size={14} />,          bg: "bg-teal-500/5",   border: "border-teal-500/20",   text: "text-teal-300" },
  };
  const c = config[type] || config.tip;
  return (
    <div className={cn("flex gap-3 p-3.5 rounded-lg border text-sm", c.bg, c.border)}>
      <span className={cn("mt-0.5 shrink-0", c.text)}>{c.icon}</span>
      <p className="text-slate-300 leading-relaxed">{text}</p>
    </div>
  );
}

function PlatformToggle({
  platform,
  setPlatform,
}: {
  platform: "windows" | "macos";
  setPlatform: (p: "windows" | "macos") => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 w-fit">
      {(["windows", "macos"] as const).map((p) => (
        <button
          key={p}
          onClick={() => setPlatform(p)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            platform === p
              ? "bg-slate-700 text-white shadow"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          {p === "windows" ? "⊞ Windows" : " macOS"}
        </button>
      ))}
    </div>
  );
}

function StepContent({ step, platform, setPlatform }: {
  step: typeof STEPS[0];
  platform: "windows" | "macos";
  setPlatform: (p: "windows" | "macos") => void;
}) {
  const c = COLORS[step.color];
  const content = step.content as any;

  // Get the right commands
  const commands = content.commands?.all
    || content.commands?.[platform]
    || content.commands?.windows
    || [];

  const cmdText = commands
    .filter((l: any) => l.type === "cmd")
    .map((l: any) => l.text)
    .join("\n");

  return (
    <div className="space-y-6">
      {/* Intro */}
      <p className="text-slate-300 leading-relaxed text-base">{content.intro}</p>

      {/* Platform toggle */}
      {content.platform && (
        <PlatformToggle platform={platform} setPlatform={setPlatform} />
      )}

      {/* Main command block */}
      <TerminalBlock
        lines={[
          ...commands,
          ...(content.output || []),
        ]}
        title="terminal"
        copyText={cmdText}
      />

      {/* Auth steps */}
      {content.steps && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {content.steps.map((s: any, i: number) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl shrink-0">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-200 mb-0.5">{s.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hardware detection */}
      {content.detection && (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800">
            <p className="text-xs text-slate-400 font-medium">{content.detection.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-800">
            {content.detection.items.map((item: any, i: number) => (
              <div key={i} className="bg-[#0D1117] p-4">
                <div className="text-lg mb-1">{item.icon}</div>
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm font-mono text-slate-300">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI auto-fix pipeline */}
      {content.autoFix && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-amber-400" />
            <p className="text-sm font-semibold text-slate-200">{content.autoFix.title}</p>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">{content.autoFix.desc}</p>
          <div className="flex items-center gap-1 flex-wrap">
            {content.autoFix.steps.map((s: string, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  i === 0 ? "bg-red-500/10 border-red-500/30 text-red-300" :
                  i === content.autoFix.steps.length - 1 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
                  "bg-slate-800 border-slate-700 text-slate-300"
                )}>
                  {s}
                </span>
                {i < content.autoFix.steps.length - 1 && (
                  <ArrowRight size={12} className="text-slate-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deploy methods */}
      {content.methods && (
        <div className="grid grid-cols-2 gap-3">
          {content.methods.map((m: any, i: number) => (
            <div key={i} className="flex gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xl shrink-0">{m.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-200">{m.name}</p>
                <p className="text-xs text-slate-500">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log analysis examples */}
      {content.examples && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-300">Example questions you can ask:</p>
          {content.examples.map((ex: any, i: number) => (
            <div key={i} className="rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900/60 flex gap-2 items-start">
                <span className="text-xs font-mono text-teal-400 shrink-0 mt-0.5">You:</span>
                <p className="text-sm text-slate-300 font-mono">&quot;{ex.q}&quot;</p>
              </div>
              <div className="px-4 py-2.5 bg-[#0D1117] flex gap-2 items-start">
                <span className="text-xs font-mono text-blue-400 shrink-0 mt-0.5">AI:</span>
                <p className="text-sm text-slate-400 leading-relaxed">{ex.a}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verify block */}
      {content.verify && (
        <div className={cn("rounded-xl border p-4", c.bg, c.border)}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className={c.text} />
            <p className="text-sm font-semibold text-slate-200">Verify this step</p>
          </div>
          <p className="text-sm text-slate-400 mb-3">{content.verify.description}</p>
          {content.verify.expectedOutput ? (
            <TerminalBlock lines={[{ type: "cmd", text: content.verify.cmd }, ...content.verify.expectedOutput]} title="verify" copyText={content.verify.cmd} />
          ) : (
            <TerminalBlock lines={[{ type: "cmd", text: content.verify.cmd }]} title="verify" copyText={content.verify.cmd} />
          )}
        </div>
      )}

      {/* Tips */}
      {content.tips && (
        <div className="space-y-2">
          {content.tips.map((tip: any, i: number) => (
            <TipCard key={i} type={tip.type} text={tip.text} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [platform, setPlatform] = useState<"windows" | "macos">("macos");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const step = STEPS[activeStep];
  const c = COLORS[step.color];
  const progress = Math.round((completedSteps.size / STEPS.length) * 100);

  const markComplete = () => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (i: number) => {
    setActiveStep(i);
    setMobileNavOpen(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen grid-bg text-slate-100 flex flex-col">

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-[#0A0E17]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Terminal size={14} className="text-blue-400" />
            </div>
            <span className="font-display text-base font-bold tracking-tight">FWAuto</span>
            <span className="hidden sm:block text-slate-600 text-sm">/ Interactive Guide</span>
          </div>

          {/* Progress bar (desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 shrink-0">{completedSteps.size}/{STEPS.length} done</span>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://fwauto.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ExternalLink size={12} />
              fwauto.ai
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-slate-200"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-[#0A0E17]/95 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="space-y-2">
            {STEPS.map((s, i) => {
              const sc = COLORS[s.color];
              const done = completedSteps.has(i);
              return (
                <button
                  key={s.id}
                  onClick={() => goToStep(i)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                    i === activeStep
                      ? cn("border", sc.border, sc.bg)
                      : "border-slate-800 bg-slate-900/40 hover:bg-slate-900"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono border shrink-0",
                    done ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                    i === activeStep ? cn(sc.bg, sc.border, sc.text) :
                    "bg-slate-800 border-slate-700 text-slate-500"
                  )}>
                    {done ? <Check size={14} /> : s.number}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0 sticky top-20 self-start">
          {/* Progress summary */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
              <span className="text-xs font-mono text-slate-500">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">
              {completedSteps.size === STEPS.length
                ? "🎉 All steps complete!"
                : `${STEPS.length - completedSteps.size} step${STEPS.length - completedSteps.size !== 1 ? "s" : ""} remaining`}
            </p>
          </div>

          {/* Step list */}
          {STEPS.map((s, i) => {
            const sc = COLORS[s.color];
            const done = completedSteps.has(i);
            const active = i === activeStep;
            return (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200",
                  active
                    ? cn("border", sc.border, sc.bg, "shadow-lg", sc.glow)
                    : "border-transparent hover:border-slate-800 hover:bg-slate-900/60"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono border shrink-0 transition-all",
                  done ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" :
                  active ? cn(sc.bg, sc.border, sc.text) :
                  "bg-slate-800/60 border-slate-700/60 text-slate-600 group-hover:text-slate-400"
                )}>
                  {done ? <Check size={13} /> : s.number}
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate transition-colors",
                    active ? "text-slate-100" : done ? "text-slate-400" : "text-slate-500 group-hover:text-slate-300"
                  )}>
                    {s.title}
                  </p>
                  <p className="text-xs text-slate-600 truncate">{s.duration}</p>
                </div>

                {/* Active indicator */}
                {active && (
                  <ChevronRight size={14} className={cn("ml-auto shrink-0", sc.text)} />
                )}
              </button>
            );
          })}
        </aside>

        {/* ── Main content ── */}
        <main ref={contentRef} className="flex-1 min-w-0">

          {/* Step header */}
          <div className={cn(
            "rounded-2xl border p-6 mb-6 relative overflow-hidden",
            c.bg, c.border
          )}>
            {/* Background glow */}
            <div className={cn(
              "absolute -top-8 -right-8 w-48 h-48 rounded-full blur-3xl opacity-20",
              step.color === "blue" ? "bg-blue-500" :
              step.color === "purple" ? "bg-purple-500" :
              step.color === "amber" ? "bg-amber-500" :
              step.color === "green" ? "bg-emerald-500" :
              "bg-teal-500"
            )} />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0",
                c.bg, c.border
              )}>
                <step.icon size={22} className={c.text} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-md", c.badge)}>
                    STEP {step.number}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                    ⏱ {step.duration}
                  </span>
                  {completedSteps.has(activeStep) && (
                    <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check size={10} /> Done
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mb-1">
                  {step.title}
                </h1>
                <p className="text-sm text-slate-400">{step.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            <StepContent step={step} platform={platform} setPlatform={setPlatform} />
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => goToStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} className="rotate-180" />
              Previous
            </button>

            <button
              onClick={markComplete}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg",
                completedSteps.has(activeStep)
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                  : cn("text-white border", c.border, "hover:opacity-90",
                      step.color === "blue"   ? "bg-blue-600 hover:bg-blue-500" :
                      step.color === "purple" ? "bg-purple-600 hover:bg-purple-500" :
                      step.color === "amber"  ? "bg-amber-600 hover:bg-amber-500" :
                      step.color === "green"  ? "bg-emerald-600 hover:bg-emerald-500" :
                      "bg-teal-600 hover:bg-teal-500"
                    )
              )}
            >
              {completedSteps.has(activeStep) ? (
                <><Check size={14} /> Completed — Next step</>
              ) : activeStep === STEPS.length - 1 ? (
                <><CheckCircle2 size={14} /> Mark Complete</>
              ) : (
                <>Mark Complete & Continue <ChevronRight size={14} /></>
              )}
            </button>
          </div>
        </main>
      </div>

      {/* ── Hero / All done banner ── */}
      {completedSteps.size === STEPS.length && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-xl font-display font-bold text-emerald-300 mb-2">
              You&apos;re all set with FWAuto!
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              You&apos;ve completed the full setup — install, authenticate, build, deploy, and log analysis.
            </p>
            <a
              href="https://fwauto.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
            >
              Open FWAuto Dashboard <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/60 py-6 text-center">
        <p className="text-xs text-slate-600">
          FWAuto — AI-Powered Firmware Development Automation &nbsp;·&nbsp; ARM Official Technology Partner
        </p>
      </footer>
    </div>
  );
}
