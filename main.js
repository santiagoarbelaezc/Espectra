/**
 * Infografía Académica — Deconstrucción del Género & Diversidad Sexual
 * Universidad del Quindío | Unidad 2
 * Compiled JavaScript (compatible ES2020)
 */

"use strict";

class ThemeManager {
  constructor() {
    this.storageKey = "infografia-theme";
    const stored = localStorage.getItem(this.storageKey);
    this.currentTheme = stored ?? "dark";
    this.apply();
    this.bindToggle();
  }
  apply() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
  }
  bindToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(this.storageKey, this.currentTheme);
      this.apply();
    });
  }
}

class ConceptFilter {
  constructor() {
    this.tabs = document.querySelectorAll(".filter-tab");
    this.cards = document.querySelectorAll(".concept-card");
    this.bindTabs();
  }
  bindTabs() {
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter || "all";
        this.setFilter(filter, tab);
      });
      tab.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tab.click(); }
      });
    });
  }
  setFilter(filter, activeTab) {
    this.tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    activeTab.classList.add("active");
    activeTab.setAttribute("aria-selected", "true");
    this.cards.forEach((card, i) => {
      const concept = card.dataset.concept || "";
      if (filter === "all" || concept === filter) {
        card.style.display = "";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
          card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        }, i * 80);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.95) translateY(8px)";
        card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        setTimeout(() => { card.style.display = "none"; }, 310);
      }
    });
  }
}

class ExpandableCards {
  constructor() {
    this.expandBtns = document.querySelectorAll(".card-expand-btn");
    this.bindButtons();
  }
  bindButtons() {
    this.expandBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.target || "");
        if (!target) return;
        const isOpen = target.classList.contains("open");
        if (isOpen) {
          target.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
          const t = btn.querySelector(".expand-text"); if (t) t.textContent = "Ver más";
        } else {
          target.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
          const t = btn.querySelector(".expand-text"); if (t) t.textContent = "Ver menos";
        }
      });
    });
  }
}

class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); this.observer.unobserve(e.target); } }); },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    [".concept-card", ".tl-card", ".inclusion-card", ".inclusion-hero-card", ".ref-item",
     ".body-concept-item", ".section-title", ".section-intro", ".academic-quote",
     ".reflection-card", ".triada-visual", ".timeline-visual"].forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add("reveal", `reveal-delay-${Math.min((i % 4) + 1, 4)}`);
        this.observer.observe(el);
      });
    });
  }
}

class PrintHandler {
  constructor() {
    const btn = document.getElementById("printBtn");
    const prepare = () => {
      document.querySelectorAll(".card-expandable").forEach((e) => e.classList.add("open"));
      document.querySelectorAll(".concept-card").forEach((c) => {
        c.style.display = "";
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("visible"));
    };

    if (btn) {
      btn.addEventListener("click", () => {
        prepare();
        setTimeout(() => window.print(), 200);
      });
    }

    window.addEventListener("beforeprint", prepare);

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        btn ? btn.click() : (prepare(), window.print());
      }
    });
  }
}

class ReadingProgress {
  constructor() {
    this.bar = document.createElement("div");
    this.bar.id = "readingProgress";
    this.bar.className = "reading-progress-bar";
    Object.assign(this.bar.style, { position: "fixed", top: "0", left: "0", width: "0%", height: "3px",
      background: "linear-gradient(90deg, #8B5CF6, #6366F1, #06B6D4)", zIndex: "9999",
      transition: "width 0.1s ease", borderRadius: "0 2px 2px 0", pointerEvents: "none" });
    document.body.prepend(this.bar);
    window.addEventListener("scroll", () => {
      const p = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.bar.style.width = Math.min(p, 100) + "%";
    });
  }
}

class TooltipSystem {
  constructor() {
    this.tip = document.createElement("div");
    this.tip.id = "infografia-tooltip";
    this.tip.className = "academic-tooltip";
    Object.assign(this.tip.style, { position: "fixed", background: "rgba(17,24,39,0.95)", backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.85rem",
      fontSize: "0.78rem", color: "#F1F5F9", pointerEvents: "none", zIndex: "9000",
      opacity: "0", transform: "translateY(-6px)", transition: "all 0.2s ease",
      maxWidth: "220px", lineHeight: "1.5", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" });
    document.body.appendChild(this.tip);
    const map = {
      ".tl-dot-indigo": "Paradigma histórico dominante",
      ".tl-dot-rose": "Período de patologización médica",
      ".tl-dot-violet": "Quiebre del paradigma psiquiátrico",
      ".tl-dot-cyan": "Reconocimiento internacional OMS",
      ".badge-dot": "Verificado académicamente",
    };
    Object.entries(map).forEach(([sel, text]) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.style.cursor = "help";
        el.addEventListener("mouseenter", (e) => { this.tip.textContent = text; this.tip.style.opacity = "1"; this.tip.style.transform = "translateY(0)"; this.moveTip(e); });
        el.addEventListener("mouseleave", () => { this.tip.style.opacity = "0"; this.tip.style.transform = "translateY(-6px)"; });
        el.addEventListener("mousemove", (e) => this.moveTip(e));
      });
    });
  }
  moveTip(e) { this.tip.style.left = (e.clientX + 14) + "px"; this.tip.style.top = (e.clientY - 10) + "px"; }
}

class KinseyScaleViz {
  render() {
    const target = document.getElementById("expand-orientacion");
    if (!target || target.querySelector(".kinsey-scale")) return;
    const content = target.querySelector(".expand-content");
    if (!content) return;
    const w = document.createElement("div");
    w.className = "kinsey-scale";
    Object.assign(w.style, { marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.06)" });
    w.innerHTML = `
      <p style="font-size:0.7rem;color:#64748B;margin-bottom:0.5rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Escala de Kinsey (0–6)</p>
      <div style="height:6px;border-radius:3px;background:linear-gradient(90deg,#6366F1 0%,#8B5CF6 33%,#A855F7 50%,#EC4899 67%,#F43F5E 100%);margin-bottom:0.5rem;"></div>
      <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:#64748B;">
        <span>0 – Exclusiv. Heterosexual</span><span>3 – Bisexual</span><span>6 – Exclusiv. Homosexual</span>
      </div>`;
    content.appendChild(w);
  }
  init() {
    const btn = document.querySelector('[data-target="expand-orientacion"]');
    if (btn) btn.addEventListener("click", () => setTimeout(() => this.render(), 80));
  }
}

function init() {
  new ThemeManager();
  new ConceptFilter();
  new ExpandableCards();
  new ScrollReveal();
  new PrintHandler();
  new ReadingProgress();
  new TooltipSystem();
  const k = new KinseyScaleViz();
  k.init();

  console.log("%c🌈 Infografía Académica — Deconstrucción del Género",
    "background:linear-gradient(135deg,#8B5CF6,#06B6D4);color:white;padding:8px 16px;border-radius:8px;font-weight:bold;font-size:13px;");
  console.log("%cUniversidad del Quindío · Unidad 2", "color:#94A3B8;font-size:11px;");

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href") || "")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".concept-card").forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.querySelector(".card-expand-btn")?.click(); }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
