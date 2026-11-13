/* Shared behaviour for every ATAPI page: theme, mobile menu, footer year and metric count-up. */
(function () {
    "use strict";

    var root = document.documentElement;
    var themeButton = document.getElementById("theme");
    var themePath = document.getElementById("theme-p");
    var nav = document.getElementById("nav");
    var menuButton = document.getElementById("menu");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var MOON = "M21 13A9 9 0 1111 3a7 7 0 0010 10z";
    var SUN =
        "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 8a4 4 0 100 8 4 4 0 000-8z";

    /* ---------- Theme and theme-aware logos ---------- */
    function applyTheme(theme) {
        var isDark = theme === "dark";

        if (isDark) {
            root.dataset.theme = "dark";
        } else {
            delete root.dataset.theme;
        }

        document.querySelectorAll("img[data-l]").forEach(function (logo) {
            logo.src = isDark ? logo.dataset.d : logo.dataset.l;
        });

        if (themeButton) {
            themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        }

        if (themePath) {
            themePath.setAttribute("d", isDark ? SUN : MOON);
        }
    }

    applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            var next = root.dataset.theme === "dark" ? "light" : "dark";

            applyTheme(next);

            try {
                sessionStorage.setItem("theme", next);
            } catch (error) {
                /* The theme still changes for this page view. */
            }
        });
    }

    /* ---------- Mobile navigation ---------- */
    function closeMenu() {
        if (!nav || !menuButton) return;

        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    }

    if (nav && menuButton) {
        menuButton.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 1080) closeMenu();
        });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById("yr");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /* ---------- Count-up for the metrics (not the founding year) ---------- */
    function format(element, value) {
        var rounded = Math.round(value);
        var text = element.dataset.c ? rounded.toLocaleString("en-IN") : String(rounded);

        element.textContent = text + "+";
    }

    function animate(element) {
        var target = Number(element.dataset.n);
        var start = performance.now();

        function frame(now) {
            var progress = Math.min((now - start) / 1200, 1);

            format(element, target * (1 - Math.pow(1 - progress, 4)));

            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    observer.unobserve(entry.target);
                    animate(entry.target);
                });
            },
            { threshold: 0.4 },
        );

        document.querySelectorAll("[data-n]").forEach(function (element) {
            observer.observe(element);
        });
    }
})();
