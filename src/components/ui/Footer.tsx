"use client";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* <p className="text-white/20 text-sm">
          © 2026 Jitendra Vasishta. Built with Next.js, Three.js &amp; Framer Motion.
        </p> */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/jitendravasishta/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-blue-400 text-sm transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Jitu0110"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-blue-400 text-sm transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:jituvasishta0110@gmail.com"
            className="text-white/30 hover:text-blue-400 text-sm transition-colors"
          >
            jituvasishta0110@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
