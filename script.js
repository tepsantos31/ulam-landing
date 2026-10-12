(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    var open = mobileMenu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Same fetch-based submit used below for the main contact form, kept
  // separate since it's a different form with its own fields/endpoint pair.
  var earlyAccessForm = document.getElementById("earlyAccessForm");
  if (earlyAccessForm) {
    var earlySubmitBtn = document.getElementById("earlyAccessSubmit");
    var earlyStatus = document.getElementById("earlyAccessStatus");

    earlyAccessForm.addEventListener("submit", function (e) {
      e.preventDefault();
      earlySubmitBtn.disabled = true;
      earlyStatus.textContent = "";
      earlyStatus.classList.remove("is-success", "is-error");

      fetch(earlyAccessForm.action, {
        method: "POST",
        body: new FormData(earlyAccessForm),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            earlyAccessForm.reset();
            earlyStatus.textContent = "You're on the list — we'll email you when UlamHub is live.";
            earlyStatus.classList.add("is-success");
          } else {
            throw new Error("Something went wrong — please try again.");
          }
        })
        .catch(function (err) {
          earlyStatus.textContent = (err && err.message) || "Something went wrong — please try again.";
          earlyStatus.classList.add("is-error");
        })
        .finally(function () {
          earlySubmitBtn.disabled = false;
        });
    });
  }

  // Submits via fetch so the visitor gets an inline status instead of being
  // bounced to Formspree's own confirmation page. If JS fails for any
  // reason, the form's plain action/method still POSTs straight to
  // Formspree and works, just with a less polished landing afterward.
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var submitBtn = document.getElementById("contactSubmit");
    var status = document.getElementById("contactStatus");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      status.textContent = "";
      status.classList.remove("is-success", "is-error");

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.reset();
            status.textContent = "Thanks — we'll get back to you soon.";
            status.classList.add("is-success");
          } else {
            return response.json().then(function (data) {
              var message =
                data && Array.isArray(data.errors) && data.errors.length
                  ? data.errors.map(function (err) { return err.message; }).join(", ")
                  : "Something went wrong — please try again.";
              throw new Error(message);
            });
          }
        })
        .catch(function (err) {
          status.textContent = (err && err.message) || "Something went wrong — please try again, or email support@ulamhub.com directly.";
          status.classList.add("is-error");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        });
    });
  }
})();
