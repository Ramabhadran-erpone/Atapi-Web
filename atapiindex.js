
/* Home page only: hero product showcase and the enquiry form.
   Theme, menu, footer year and count-up live in site.js. */
(function () {
    "use strict";
 
    var $ = function (selector) {
        return document.querySelector(selector);
    };
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
    /* ---------- Hero product showcase ---------- */
    var products = [
        [
            "laptops.webp",
            "Business laptops",
            "#i-laptop",
            "Premium business models, standard ranges and quality-checked pre-owned options.",
        ],
        [
            "pcs.webp",
            "Desktops and mini PCs",
            "#i-pc",
            "Business desktops and compact mini PCs for productive workspaces.",
        ],
        [
            "printers.webp",
            "Printing solutions",
            "#i-print",
            "Laser, inkjet and multifunction printers for everyday document workflows.",
        ],
        [
            "servers.webp",
            "Enterprise servers",
            "#i-server",
            "Scalable server and storage solutions for critical business workloads.",
        ],
        [
            "ups.webp",
            "UPS and backup power",
            "#i-bolt",
            "Dependable backup power that protects equipment and keeps operations running.",
        ],
    ];
 
    var image = $("#s-img");
    var dots = $("#dots");
    var showcase = $("#show");
    var current = 0;
    var timer = null;
    var paused = false;
 
    function show(index) {
        var item = products[index];
 
        current = index;
        image.classList.add("fade");
 
        setTimeout(function () {
            image.src = item[0];
            image.alt = item[1];
            $("#s-t").textContent = item[1];
            $("#s-d").textContent = item[3];
            $("#s-ic").setAttribute("href", item[2]);
            image.classList.remove("fade");
        }, 250);
 
        Array.prototype.forEach.call(dots.children, function (dot, i) {
            dot.setAttribute("aria-current", i === index);
        });
    }
 
    function restart() {
        clearInterval(timer);
 
        if (reduceMotion || paused) return;
 
        timer = setInterval(function () {
            show((current + 1) % products.length);
        }, 5000);
    }
 
    if (image && dots && showcase) {
        products.forEach(function (item, index) {
            var button = document.createElement("button");
 
            button.type = "button";
            button.setAttribute("aria-label", "Show " + item[1]);
            button.addEventListener("click", function () {
                show(index);
                restart();
            });
            dots.appendChild(button);
 
            if (index > 0) new Image().src = item[0];
        });
 
        ["mouseenter", "focusin"].forEach(function (name) {
            showcase.addEventListener(name, function () {
                paused = true;
                clearInterval(timer);
            });
        });
 
        ["mouseleave", "focusout"].forEach(function (name) {
            showcase.addEventListener(name, function () {
                paused = false;
                restart();
            });
        });
 
        show(0);
        restart();
    }
 
    /* ---------- Enquiry form: opens a prefilled email until a backend is connected ---------- */
    var form = $("#form");
 
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
 
            /* Native validation accepts spaces only, so check the text fields as well. */
            var blank = Array.prototype.filter.call(
                form.querySelectorAll("input, textarea"),
                function (field) {
                    return !field.value.trim();
                },
            )[0];
 
            if (blank) {
                blank.setCustomValidity("Please fill in this field.");
                blank.reportValidity();
                blank.addEventListener(
                    "input",
                    function () {
                        blank.setCustomValidity("");
                    },
                    { once: true },
                );
                return;
            }
 
            var data = new FormData(form);
            var body =
                "Name: " +
                data.get("name").trim() +
                "\nEmail: " +
                data.get("email").trim() +
                "\nPhone: " +
                data.get("phone").trim() +
                "\nRequirement: " +
                data.get("need") +
                "\n\n" +
                data.get("msg").trim();
 
            location.href =
                "mailto:info@atapisystems.com?subject=" +
                encodeURIComponent("Website enquiry: " + data.get("need")) +
                "&body=" +
                encodeURIComponent(body);
 
            $("#note").textContent =
                "Your email app should now be open. If not, write to info@atapisystems.com.";
        });
    }
})();
 