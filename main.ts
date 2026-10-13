/**
 * Infografía Académica — Deconstrucción del Género & Diversidad Sexual
 * Universidad del Quindío | Unidad 2
 *
 * TypeScript: Interactividad, animaciones y renderizado dinámico
 */

// ============================================================
// INTERFACES (TIPADO ESTRICTO)
// ============================================================

interface ConceptCard {
  id: string;
  concept: "sexo" | "genero" | "orientacion";
  title: string;
  label: string;
  color: "cyan" | "violet" | "rose";
  tags: string[];
}

interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  paradigmTag: string;
  tagColor: string;
}

interface FilterState {
  active: string;
}

// ============================================================
// THEME MANAGER
// ============================================================

class ThemeManager {
  private currentTheme: "dark" | "light";
  private readonly storageKey = "infografia-theme";

  constructor() {
    const stored = localStorage.getItem(this.storageKey) as "dark" | "light" | null;
    this.currentTheme = stored ?? "dark";
    this.apply();
    this.bindToggle();
  }

  private apply(): void {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
  }

  private bindToggle(): void {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(this.storageKey, this.currentTheme);
      this.apply();

      // Ripple effect
      btn.classList.add("theme-transition");
      setTimeout(() => btn.classList.remove("theme-transition"), 300);
    });
  }

  getTheme(): "dark" | "light" {
    return this.currentTheme;
  }
}

// ============================================================
// CONCEPT CARD FILTER
// ============================================================

class ConceptFilter {
  private filterState: FilterState = { active: "all" };
  private readonly tabs: NodeListOf<HTMLElement>;
  private readonly cards: NodeListOf<HTMLElement>;

  constructor() {
    this.tabs = document.querySelectorAll<HTMLElement>(".filter-tab");
    this.cards = document.querySelectorAll<HTMLElement>(".concept-card");
    this.bindTabs();
  }

  private bindTabs(): void {
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter ?? "all";
        this.setFilter(filter, tab);
      });

      // Keyboard accessibility
      tab.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tab.click();
        }
      });
    });
  }

  private setFilter(filter: string, activeTab: HTMLElement): void {
    this.filterState.active = filter;

    // Update tab states
    this.tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });
    activeTab.classList.add("active");
    activeTab.setAttribute("aria-selected", "true");

    // Filter cards with staggered animation
    this.cards.forEach((card, index) => {
      const concept = card.dataset.concept ?? "";

      if (filter === "all" || concept === filter) {
        card.style.display = "";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
        }, index * 80);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.95) translateY(8px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }
}

// ============================================================
// EXPANDABLE CARD CONTENT
// ============================================================

class ExpandableCards {
  private readonly expandBtns: NodeListOf<HTMLElement>;

  constructor() {
    this.expandBtns = document.querySelectorAll<HTMLElement>(".card-expand-btn");
    this.bindButtons();
  }

  private bindButtons(): void {
    this.expandBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target ?? "";
        const target = document.getElementById(targetId);
        if (!target) return;

        const isOpen = target.classList.contains("open");

        if (isOpen) {
          this.collapse(target, btn);
        } else {
          this.expand(target, btn);
        }
      });
    });
  }

  private expand(target: HTMLElement, btn: HTMLElement): void {
    target.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    const expandText = btn.querySelector<HTMLElement>(".expand-text");
    if (expandText) expandText.textContent = "Ver menos";
  }

  private collapse(target: HTMLElement, btn: HTMLElement): void {
    target.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    const expandText = btn.querySelector<HTMLElement>(".expand-text");
    if (expandText) expandText.textContent = "Ver más";
  }
}

// ============================================================
// SCROLL REVEAL ANIMATION
// ============================================================

class ScrollReveal {
  private readonly observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    this.observeElements();
  }

  private observeElements(): void {
    const selectors = [
      ".concept-card",
      ".tl-card",
      ".inclusion-card",
      ".inclusion-hero-card",
      ".ref-item",
      ".body-concept-item",
      ".section-title",
      ".section-intro",
      ".academic-quote",
      ".reflection-card",
      ".triada-visual",
      ".timeline-visual",
    ];

    selectors.forEach((selector, selectorIndex) => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el, elIndex) => {
        el.classList.add("reveal");

        // Stagger delay based on index
        const delayClass = `reveal-delay-${Math.min((elIndex % 4) + 1, 4)}`;
        el.classList.add(delayClass);

        this.observer.observe(el);
      });
    });
  }
}

// ============================================================
// PRINT / EXPORT HANDLER
// ============================================================

class PrintHandler {
  constructor() {
    this.bindPrintButton();
    this.bindKeyboardShortcut();
  }

  private bindPrintButton(): void {
    const printBtn = document.getElementById("printBtn");
    if (!printBtn) return;

    printBtn.addEventListener("click", () => {
      this.prepareForPrint();
      setTimeout(() => {
        window.print();
        this.cleanupAfterPrint();
      }, 200);
    });

    // Before print event (e.g. Ctrl+P natively)
    window.addEventListener("beforeprint", () => {
      this.prepareForPrint();
    });

    // After print dialog closes
    window.addEventListener("afterprint", () => {
      this.cleanupAfterPrint();
    });
  }

  private bindKeyboardShortcut(): void {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        document.getElementById("printBtn")?.click();
      }
    });
  }

  private prepareForPrint(): void {
    // Expand all card content for printing
    const expandables = document.querySelectorAll<HTMLElement>(".card-expandable");
    expandables.forEach((el) => el.classList.add("open"));

    // Ensure all cards are visible
    const cards = document.querySelectorAll<HTMLElement>(".concept-card");
    cards.forEach((card) => {
      card.style.display = "";
      card.style.opacity = "1";
      card.style.transform = "none";
    });

    // Mark reveal elements as visible
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  private cleanupAfterPrint(): void {
    // Collapse cards that were not open
    const expandables = document.querySelectorAll<HTMLElement>(".card-expandable:not(.was-open)");
    expandables.forEach((el) => el.classList.remove("open"));
  }
}

// ============================================================
// FLOATING CONTROLS VISIBILITY
// ============================================================

class FloatingControls {
  private readonly controls: HTMLElement | null;
  private lastScrollY: number = 0;
  private ticking: boolean = false;

  constructor() {
    this.controls = document.getElementById("floatingControls");
    this.bindScroll();
  }

  private bindScroll(): void {
    window.addEventListener("scroll", () => {
      this.lastScrollY = window.scrollY;

      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateVisibility();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  private updateVisibility(): void {
    if (!this.controls) return;

    if (this.lastScrollY > 50) {
      this.controls.style.opacity = "1";
      this.controls.style.transform = "translateY(0)";
    } else {
      this.controls.style.opacity = "0.6";
      this.controls.style.transform = "translateY(-4px)";
    }
  }
}

// ============================================================
// PROGRESS INDICATOR
// ============================================================

class ReadingProgress {
  private progressBar: HTMLElement | null = null;

  constructor() {
    this.createProgressBar();
    this.bindScroll();
  }

  private createProgressBar(): void {
    this.progressBar = document.createElement("div");
    this.progressBar.id = "readingProgress";
    Object.assign(this.progressBar.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "0%",
      height: "3px",
      background: "linear-gradient(90deg, #8B5CF6, #6366F1, #06B6D4)",
      zIndex: "9999",
      transition: "width 0.1s ease",
      borderRadius: "0 2px 2px 0",
    });
    document.body.prepend(this.progressBar);
  }

  private bindScroll(): void {
    window.addEventListener("scroll", () => {
      if (!this.progressBar) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      this.progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
  }
}

// ============================================================
// TOOLTIP SYSTEM
// ============================================================

class TooltipSystem {
  private tooltip: HTMLElement | null = null;

  constructor() {
    this.createTooltip();
    this.bindElements();
  }

  private createTooltip(): void {
    this.tooltip = document.createElement("div");
    this.tooltip.id = "infografia-tooltip";
    Object.assign(this.tooltip.style, {
      position: "fixed",
      background: "rgba(17, 24, 39, 0.95)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      padding: "0.5rem 0.85rem",
      fontSize: "0.78rem",
      color: "#F1F5F9",
      pointerEvents: "none",
      zIndex: "9000",
      opacity: "0",
      transform: "translateY(-6px)",
      transition: "all 0.2s ease",
      maxWidth: "200px",
      lineHeight: "1.5",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    });
    document.body.appendChild(this.tooltip);
  }

  private bindElements(): void {
    const tooltipMap: Record<string, string> = {
      ".tl-dot-indigo": "Paradigma histórico dominante",
      ".tl-dot-rose": "Período de patologización médica",
      ".tl-dot-violet": "Quiebre del paradigma psiquiátrico",
      ".tl-dot-cyan": "Reconocimiento internacional",
      ".badge-dot": "Infografía verificada académicamente",
    };

    Object.entries(tooltipMap).forEach(([selector, text]) => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.setAttribute("title", text);
        el.style.cursor = "help";

        el.addEventListener("mouseenter", (e: MouseEvent) => this.show(e, text));
        el.addEventListener("mouseleave", () => this.hide());
        el.addEventListener("mousemove", (e: MouseEvent) => this.move(e));
      });
    });
  }

  private show(e: MouseEvent, text: string): void {
    if (!this.tooltip) return;
    this.tooltip.textContent = text;
    this.tooltip.style.opacity = "1";
    this.tooltip.style.transform = "translateY(0)";
    this.move(e);
  }

  private hide(): void {
    if (!this.tooltip) return;
    this.tooltip.style.opacity = "0";
    this.tooltip.style.transform = "translateY(-6px)";
  }

  private move(e: MouseEvent): void {
    if (!this.tooltip) return;
    this.tooltip.style.left = `${e.clientX + 12}px`;
    this.tooltip.style.top = `${e.clientY - 8}px`;
  }
}

// ============================================================
// ACTIVE SECTION HIGHLIGHT (NAV AWARENESS)
// ============================================================

class SectionObserver {
  private readonly sections: NodeListOf<HTMLElement>;

  constructor() {
    this.sections = document.querySelectorAll<HTMLElement>("section[id]");
    this.observe();
  }

  private observe(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            history.replaceState(null, "", `#${id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    this.sections.forEach((section) => observer.observe(section));
  }
}

// ============================================================
// KINSEY SCALE MINI VISUALIZATION (Dynamic render)
// ============================================================

class KinseyScaleViz {
  private render(): void {
    const expandOrientacion = document.getElementById("expand-orientacion");
    if (!expandOrientacion) return;

    // Only render if not already rendered
    if (expandOrientacion.querySelector(".kinsey-scale")) return;

    const expandContent = expandOrientacion.querySelector<HTMLElement>(".expand-content");
    if (!expandContent) return;

    const scaleContainer = document.createElement("div");
    scaleContainer.className = "kinsey-scale";
    Object.assign(scaleContainer.style, {
      marginTop: "1rem",
      padding: "1rem",
      background: "rgba(255,255,255,0.03)",
      borderRadius: "0.75rem",
      border: "1px solid rgba(255,255,255,0.06)",
    });

    const label = document.createElement("p");
    label.textContent = "Escala de Kinsey (0–6)";
    Object.assign(label.style, {
      fontSize: "0.72rem",
      color: "#64748B",
      marginBottom: "0.5rem",
      fontWeight: "600",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    });

    const bar = document.createElement("div");
    Object.assign(bar.style, {
      height: "6px",
      borderRadius: "3px",
      background:
        "linear-gradient(90deg, #6366F1 0%, #8B5CF6 33%, #A855F7 50%, #EC4899 67%, #F43F5E 100%)",
      marginBottom: "0.4rem",
    });

    const labels = document.createElement("div");
    Object.assign(labels.style, {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.68rem",
      color: "#64748B",
    });
    labels.innerHTML =
      "<span>0 Exclusiv. Hetero.</span><span>3 Bisexual</span><span>6 Exclusiv. Homo.</span>";

    scaleContainer.appendChild(label);
    scaleContainer.appendChild(bar);
    scaleContainer.appendChild(labels);
    expandContent.appendChild(scaleContainer);
  }

  init(): void {
    // Render when the orientacion card is expanded
    const expandBtn = document.querySelector<HTMLElement>(
      '[data-target="expand-orientacion"]'
    );
    if (!expandBtn) return;

    expandBtn.addEventListener("click", () => {
      setTimeout(() => this.render(), 50);
    });
  }
}

// ============================================================
// INITIALIZATION
// ============================================================

function init(): void {
  // Initialize all modules
  const themeManager = new ThemeManager();
  const conceptFilter = new ConceptFilter();
  const expandableCards = new ExpandableCards();
  const scrollReveal = new ScrollReveal();
  const printHandler = new PrintHandler();
  const floatingControls = new FloatingControls();
  const readingProgress = new ReadingProgress();
  const tooltipSystem = new TooltipSystem();
  const sectionObserver = new SectionObserver();
  const kinseyViz = new KinseyScaleViz();
  kinseyViz.init();

  // Announce to console for dev reference
  console.log(
    "%c🌈 Infografía Académica — Deconstrucción del Género",
    "background: linear-gradient(135deg, #8B5CF6, #06B6D4); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold;"
  );
  console.log(
    "%cUniversidad del Quindío | Unidad 2 | TypeScript v5.0",
    "color: #94A3B8; font-size: 12px;"
  );

  // Smooth scroll for anchor links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href") ?? "");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Card keyboard interaction
  document.querySelectorAll<HTMLElement>(".concept-card").forEach((card) => {
    card.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const btn = card.querySelector<HTMLElement>(".card-expand-btn");
        btn?.click();
      }
    });
  });
}

// Run after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
