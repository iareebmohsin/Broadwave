"""
Broadwave Encoder - a small desktop broadcaster for demos.

Paste the Server URL and Stream Key from the Studio > Keys page, choose a
video file, and click Go Live. The app runs ffmpeg, pushes the file to the
RTMP ingress on loop, burns an ON AIR clock into the picture, and shows the
encoder statistics while it runs.

Run:   pythonw scripts/encoder.pyw          (GUI, no console)
CLI:   python  scripts/encoder.pyw --cli <server> <key> <video>   (no GUI)
"""
import os
import queue
import subprocess
import sys
import threading
import tkinter as tk
from tkinter import filedialog, ttk

HERE = os.path.dirname(os.path.abspath(__file__))
WINGET_FFMPEG = os.path.join(
    os.environ.get("LOCALAPPDATA", ""),
    r"Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe",
)
FFMPEG = WINGET_FFMPEG if os.path.exists(WINGET_FFMPEG) else "ffmpeg"
DEFAULT_VIDEO = os.path.join(HERE, "..", "media", "sample-broadcast.mp4")

CORAL = "#ff6a45"
BG = "#0b1516"
CARD = "#12201f"
INK = "#e8f2ef"
MUTED = "#8fa8a3"
BORDER = "#1d302e"

OVERLAY = (
    "drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':text='ON AIR  %{localtime}'"
    ":x=24:y=24:fontsize=40:fontcolor=white:box=1:boxcolor=0x1a0c08@0.6:boxborderw=12"
)


def build_command(server: str, key: str, video: str, overlay: bool) -> list[str]:
    target = f"{server.rstrip('/')}/{key.strip()}"
    cmd = [
        FFMPEG, "-hide_banner", "-loglevel", "warning", "-stats",
        "-re", "-stream_loop", "-1", "-i", video,
    ]
    if overlay:
        cmd += ["-vf", OVERLAY]
    cmd += [
        "-c:v", "libx264", "-preset", "veryfast", "-tune", "zerolatency", "-pix_fmt", "yuv420p",
        "-g", "60", "-b:v", "2500k", "-maxrate", "2500k", "-bufsize", "5000k",
        "-c:a", "aac", "-b:a", "128k", "-ar", "48000",
        "-f", "flv", target,
    ]
    return cmd


class Encoder:
    """Owns the ffmpeg process and streams its stderr lines into a queue."""

    def __init__(self) -> None:
        self.proc: subprocess.Popen | None = None
        self.lines: queue.Queue[str] = queue.Queue()

    def start(self, cmd: list[str]) -> None:
        flags = subprocess.CREATE_NO_WINDOW if hasattr(subprocess, "CREATE_NO_WINDOW") else 0
        self.proc = subprocess.Popen(
            cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
            creationflags=flags,
        )
        threading.Thread(target=self._pump, daemon=True).start()

    def _pump(self) -> None:
        assert self.proc and self.proc.stderr
        buf = b""
        while True:
            ch = self.proc.stderr.read(1)
            if not ch:
                break
            if ch in (b"\r", b"\n"):
                if buf.strip():
                    self.lines.put(buf.decode("utf-8", "ignore"))
                buf = b""
            else:
                buf += ch
        self.lines.put("__EXIT__")

    def stop(self) -> None:
        if not self.proc:
            return
        try:
            if self.proc.stdin:
                self.proc.stdin.write(b"q")
                self.proc.stdin.flush()
            self.proc.wait(timeout=5)
        except Exception:
            self.proc.kill()
        self.proc = None

    @property
    def running(self) -> bool:
        return self.proc is not None and self.proc.poll() is None


class App(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Broadwave Encoder")
        self.configure(bg=BG)
        self.geometry("720x560")
        self.minsize(640, 520)
        self.encoder = Encoder()
        self._build()
        self.after(150, self._poll)
        self.protocol("WM_DELETE_WINDOW", self._on_close)

    # ---------- UI ----------
    def _build(self) -> None:
        style = ttk.Style(self)
        style.theme_use("clam")
        style.configure("TFrame", background=BG)
        style.configure("Card.TFrame", background=CARD)
        style.configure("TLabel", background=BG, foreground=INK, font=("Segoe UI", 10))
        style.configure("Card.TLabel", background=CARD, foreground=INK, font=("Segoe UI", 10))
        style.configure("Muted.TLabel", background=CARD, foreground=MUTED, font=("Segoe UI", 9))
        style.configure("Title.TLabel", background=BG, foreground=INK, font=("Segoe UI Semibold", 18))
        style.configure("Sub.TLabel", background=BG, foreground=MUTED, font=("Segoe UI", 9))
        style.configure("TEntry", fieldbackground="#0b1516", foreground=INK, insertcolor=INK, bordercolor=BORDER)
        style.configure("Go.TButton", background=CORAL, foreground="#1a0c08", font=("Segoe UI Semibold", 11), padding=(18, 10), borderwidth=0)
        style.map("Go.TButton", background=[("active", "#ff8a6b"), ("disabled", "#3a2a26")])
        style.configure("Ghost.TButton", background=CARD, foreground=INK, font=("Segoe UI", 10), padding=(12, 8), bordercolor=BORDER)
        style.map("Ghost.TButton", background=[("active", "#1a2c2a")])

        outer = ttk.Frame(self, padding=24)
        outer.pack(fill="both", expand=True)

        head = ttk.Frame(outer)
        head.pack(fill="x")
        badge = tk.Canvas(head, width=36, height=36, bg=BG, highlightthickness=0)
        badge.create_oval(2, 2, 34, 34, fill=CORAL, outline=CORAL)
        badge.create_line(8, 20, 12, 12, 16, 26, 20, 12, 24, 26, 28, 18, fill="#1a0c08", width=3, smooth=True)
        badge.pack(side="left", padx=(0, 12))
        titles = ttk.Frame(head)
        titles.pack(side="left")
        ttk.Label(titles, text="Broadwave Encoder", style="Title.TLabel").pack(anchor="w")
        ttk.Label(titles, text="Paste the server and key from Studio  >  Keys, choose a video, go live.", style="Sub.TLabel").pack(anchor="w")

        self.status = tk.Label(head, text="OFF AIR", bg="#1d302e", fg=MUTED, font=("Segoe UI Semibold", 10), padx=14, pady=6)
        self.status.pack(side="right")

        card = ttk.Frame(outer, style="Card.TFrame", padding=20)
        card.pack(fill="x", pady=(20, 12))

        self.server = tk.StringVar()
        self.key = tk.StringVar()
        self.video = tk.StringVar(value=os.path.abspath(DEFAULT_VIDEO) if os.path.exists(DEFAULT_VIDEO) else "")
        self.overlay = tk.BooleanVar(value=True)

        self._field(card, "SERVER URL", self.server, "rtmps://...livekit.cloud/x", 0)
        self._field(card, "STREAM KEY", self.key, "paste the key", 1, show="*")

        ttk.Label(card, text="VIDEO FILE", style="Muted.TLabel").grid(row=4, column=0, sticky="w", pady=(12, 4))
        row = ttk.Frame(card, style="Card.TFrame")
        row.grid(row=5, column=0, sticky="ew")
        row.columnconfigure(0, weight=1)
        ttk.Entry(row, textvariable=self.video).grid(row=0, column=0, sticky="ew", ipady=6)
        ttk.Button(row, text="Browse", style="Ghost.TButton", command=self._browse).grid(row=0, column=1, padx=(8, 0))
        card.columnconfigure(0, weight=1)

        tk.Checkbutton(
            card, text="Burn a live clock into the picture", variable=self.overlay,
            bg=CARD, fg=INK, activebackground=CARD, activeforeground=INK, selectcolor="#0b1516",
            font=("Segoe UI", 9),
        ).grid(row=6, column=0, sticky="w", pady=(12, 0))

        actions = ttk.Frame(outer)
        actions.pack(fill="x", pady=(4, 12))
        self.go = ttk.Button(actions, text="Go Live", style="Go.TButton", command=self._toggle)
        self.go.pack(side="left")
        ttk.Label(actions, text="  The stream key is never shown in this window.", style="Sub.TLabel").pack(side="left")

        ttk.Label(outer, text="ENCODER LOG", style="Sub.TLabel").pack(anchor="w")
        self.log = tk.Text(outer, height=10, bg="#07100f", fg="#b9d3ce", insertbackground=INK, relief="flat",
                           font=("Consolas", 9), padx=12, pady=10, wrap="none")
        self.log.pack(fill="both", expand=True, pady=(6, 0))
        self.log.configure(state="disabled")

    def _field(self, parent, label, var, placeholder, row, show=None):
        ttk.Label(parent, text=label, style="Muted.TLabel").grid(row=row * 2, column=0, sticky="w", pady=(0 if row == 0 else 12, 4))
        entry = ttk.Entry(parent, textvariable=var, show=show or "")
        entry.grid(row=row * 2 + 1, column=0, sticky="ew", ipady=6)
        return entry

    # ---------- actions ----------
    def _browse(self) -> None:
        path = filedialog.askopenfilename(title="Choose a video", filetypes=[("Video", "*.mp4 *.mov *.mkv *.avi *.webm"), ("All files", "*.*")])
        if path:
            self.video.set(path)

    def _toggle(self) -> None:
        if self.encoder.running:
            self._stop()
        else:
            self._start()

    def _start(self) -> None:
        server, key, video = self.server.get().strip(), self.key.get().strip(), self.video.get().strip()
        if not server.startswith("rtmp"):
            return self._say("Server URL must start with rtmp:// or rtmps://")
        if not key:
            return self._say("Paste the stream key first.")
        if not os.path.exists(video):
            return self._say("Choose a video file that exists.")
        cmd = build_command(server, key, video, self.overlay.get())
        self._say(f"Connecting to {server} ...")
        self._say(f"Source: {os.path.basename(video)} (looping)")
        try:
            self.encoder.start(cmd)
        except FileNotFoundError:
            return self._say("ffmpeg not found. Install it with: winget install Gyan.FFmpeg")
        self.go.configure(text="End Broadcast")
        self.status.configure(text="●  LIVE", bg=CORAL, fg="#1a0c08")

    def _stop(self) -> None:
        self.encoder.stop()
        self._say("Broadcast ended.")
        self.go.configure(text="Go Live")
        self.status.configure(text="OFF AIR", bg="#1d302e", fg=MUTED)

    def _poll(self) -> None:
        try:
            while True:
                line = self.encoder.lines.get_nowait()
                if line == "__EXIT__":
                    if self.encoder.running is False and self.go.cget("text") != "Go Live":
                        self._stop()
                    continue
                self._say(line, replace_stats=line.startswith("frame="))
        except queue.Empty:
            pass
        self.after(150, self._poll)

    def _say(self, text: str, replace_stats: bool = False) -> None:
        self.log.configure(state="normal")
        if replace_stats:
            last = self.log.get("end-2l", "end-1l")
            if last.startswith("frame="):
                self.log.delete("end-2l", "end-1l")
        self.log.insert("end", text.strip() + "\n")
        self.log.see("end")
        self.log.configure(state="disabled")

    def _on_close(self) -> None:
        self.encoder.stop()
        self.destroy()


def cli(server: str, key: str, video: str) -> int:
    cmd = build_command(server, key, video, True)
    print("Running:", " ".join(c if "rtmp" not in c else c.rsplit("/", 1)[0] + "/****" for c in cmd), flush=True)
    return subprocess.call(cmd)


if __name__ == "__main__":
    if len(sys.argv) >= 5 and sys.argv[1] == "--cli":
        sys.exit(cli(sys.argv[2], sys.argv[3], sys.argv[4]))
    App().mainloop()
