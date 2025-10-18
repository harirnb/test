const entryData = [
  {
    title: "Sunrise sketchbook",
    mood: "joy",
    date: "2024-05-16",
    excerpt:
      "Sketched the sunrise from my window and realized the gradient mirrors yesterday's conversation with my sister.",
  },
  {
    title: "Deep work sprint",
    mood: "focus",
    date: "2024-05-18",
    excerpt:
      "Blocked off three hours for focused writing. Documented progress on the product roadmap and captured learnings.",
  },
  {
    title: "Quiet gratitude",
    mood: "gratitude",
    date: "2024-05-15",
    excerpt: "Listened to rain and wrote down five moments from the week that made me pause and smile.",
  },
  {
    title: "Breathwork notes",
    mood: "calm",
    date: "2024-05-17",
    excerpt: "Tried a new breathwork pattern today. The journal helped me notice a tension release behind my shoulders.",
  },
  {
    title: "Client reflection",
    mood: "focus",
    date: "2024-05-14",
    excerpt: "Summarized feedback from the latest design review and outlined clear next steps for next week's sprint.",
  },
  {
    title: "Unexpected joy",
    mood: "joy",
    date: "2024-05-13",
    excerpt: "A friend dropped by with homemade bread. Captured the laughter and warmth of the surprise visit.",
  },
];

const faqData = [
  {
    question: "Can I import my existing journal entries?",
    answer:
      "Absolutely. JournaLive supports importing from Markdown, Day One, Notion, and simple text files with just a few clicks.",
  },
  {
    question: "Does JournaLive work offline?",
    answer:
      "Yes. Draft entries offline on mobile or desktop and they will sync automatically when you're back online.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your privacy matters. All entries are encrypted at rest and in transit, and you can enable an additional passphrase for extra protection.",
  },
  {
    question: "Can I collaborate with others?",
    answer:
      "With Pro and Studio plans, invite collaborators to comment on shared entries or build community circles for mutual accountability.",
  },
];

const entryGrid = document.querySelector("#entry-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

const renderEntries = (filter = "all") => {
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });

  entryGrid.innerHTML = "";

  entryData
    .filter((entry) => (filter === "all" ? true : entry.mood === filter))
    .forEach((entry) => {
      const card = document.createElement("article");
      card.className = "entry-card";
      card.innerHTML = `
        <header>
          <div>
            <h3>${entry.title}</h3>
            <time datetime="${entry.date}">${formatter.format(new Date(entry.date))}</time>
          </div>
          <span class="badge-mood">${entry.mood}</span>
        </header>
        <p>${entry.excerpt}</p>
      `;
      entryGrid.append(card);
    });
};

const accordionRoot = document.querySelector(".accordion");

const renderFaq = () => {
  faqData.forEach(({ question, answer }, index) => {
    const item = document.createElement("article");
    item.className = "accordion-item";

    const header = document.createElement("button");
    header.className = "accordion-header";
    header.type = "button";
    header.setAttribute("aria-expanded", "false");
    header.setAttribute("aria-controls", `faq-panel-${index}`);
    header.innerHTML = `
      <span>${question}</span>
      <span aria-hidden="true">+</span>
    `;

    const panel = document.createElement("div");
    panel.className = "accordion-panel";
    panel.id = `faq-panel-${index}`;
    panel.innerHTML = `<p>${answer}</p>`;

    header.addEventListener("click", () => toggleAccordion(item, panel, header));

    item.append(header, panel);
    accordionRoot.append(item);
  });
};

const toggleAccordion = (item, panel, header) => {
  const isOpen = item.classList.contains("open");
  accordionRoot.querySelectorAll(".accordion-item").forEach((otherItem) => {
    if (otherItem !== item) {
      otherItem.classList.remove("open");
      const otherHeader = otherItem.querySelector(".accordion-header");
      const otherPanel = otherItem.querySelector(".accordion-panel");
      otherHeader?.setAttribute("aria-expanded", "false");
      otherPanel.style.maxHeight = null;
    }
  });

  if (isOpen) {
    item.classList.remove("open");
    header.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = null;
  } else {
    item.classList.add("open");
    header.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  }
};

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    renderEntries(button.dataset.filter);
  });
});

const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("journal-theme", theme);
};

const storedTheme = localStorage.getItem("journal-theme");
setTheme(storedTheme || preferredTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

const yearSpan = document.querySelector("#year");
yearSpan.textContent = new Date().getFullYear();

renderEntries();
renderFaq();
