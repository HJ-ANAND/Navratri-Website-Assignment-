class navheader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header>
            <div class="navbar">
                <div class="nav-logo">
                    <div class="logo" aria-hidden="true"></div>
                </div>

                <nav class="navigation" role="navigation">
                    <a href="/index.html" class="active">Home</a>
                    <a href="/pages/about.html">About</a>
                    <a href="/pages/9days.html">9 Days</a>
                    <a href="/pages/gallery.html">Gallery</a>
                    <a href="/pages/story.html">Story</a>
                    <a href="/pages/contact.html">Contact</a>
                </nav>
            </div>
        </header>
        `;
    this._setActiveLink();
    window.addEventListener("popstate", () => this._setActiveLink());
    const logo = this.querySelector(".logo");
    if (logo) {
      logo.setAttribute("role", "link");
      logo.setAttribute("title", "Home");
      logo.tabIndex = 0;
      const goHome = () => {
        const homePath = "/index.html";
        const cur = location.pathname.replace(/\/+$/, "");
        if (cur === homePath || cur === "/Navratri" || cur === "/") {
          // already on home → refresh
          location.reload();
        } else {
          // navigate to home
          location.assign(homePath);
        }
      };
      logo.addEventListener("click", goHome);
      logo.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goHome();
        }
      });
    }
  }
  _setActiveLink() {
    const links = this.querySelectorAll(".navigation a");
    let current = location.pathname.split("/").pop().toLowerCase();
    if (!current) current = "index.html";
    current = current.split("?")[0].split("#")[0];

    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      let target = href.split("/").pop().toLowerCase();
      if (!target) target = "index.html";
      target = target.split("?")[0].split("#")[0];

      if (target === current) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-mainPage");
  if (!btn) return;
  const cards = document.querySelector(".highlights");
  if (!cards) return;
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const top =
    cards.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
  window.scrollTo({ top, behavior: "smooth" });
});

customElements.define("nav-header", navheader);

let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

if (next) {
  next.addEventListener("click", function () {
    let items = document.querySelectorAll(".item");
    document.querySelector(".slide").appendChild(items[0]);
  });
}

if (prev) {
  prev.addEventListener("click", function () {
    let items = document.querySelectorAll(".item");
    document.querySelector(".slide").prepend(items[items.length - 1]);
  });
}

const steps = document.querySelectorAll(".step");
let current = 0;
let isAnimating = false;

const showStep = (target, direction) => {
  if (isAnimating || target === current) return;
  const prev = steps[current];
  const next = steps[target];
  if (!next) return;

  isAnimating = true;
  prev.classList.remove("active");

  const entryClass = direction === "down" ? "from-top" : "from-bottom";
  next.classList.add(entryClass);

  requestAnimationFrame(() => {
    next.classList.add("active");
  });

  const onTransitionEnd = (evt) => {
    if (evt.propertyName !== "transform") return;
    next.classList.remove(entryClass);
    next.removeEventListener("transitionend", onTransitionEnd);
    isAnimating = false;
  };

  next.addEventListener("transitionend", onTransitionEnd);
  current = target;
};

const handleWheel = (event) => {
  if (!steps.length) return;
  event.preventDefault();

  if (event.deltaY > 0 && current < steps.length - 1) {
    showStep(current + 1, "down");
  } else if (event.deltaY < 0 && current > 0) {
    showStep(current - 1, "up");
  }
};

window.addEventListener("wheel", handleWheel, { passive: false });
