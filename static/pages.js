(function () {
  "use strict";
  // the link label (?src=ya_direct) goes into the form's hidden field «src»; nothing is sent anywhere else
  var p = new URLSearchParams(location.search);
  var src = (p.get("src") || p.get("utm_source") || "direct").toLowerCase().slice(0, 40);
  // only our labels (the same rule as SRC_RE in server.py): no digits or dots, so no phone or name in a label
  if (!/^(direct|friend|assoc|interview|other|(ya|vk|tg)_[a-z]{2,16})$/.test(src)) src = "other";
  var f = document.getElementById("yform"), a = document.getElementById("yformLink");
  if (!f) return;
  var base = f.getAttribute("data-form");
  f.src = base + "?iframe=1&src=" + encodeURIComponent(src);
  if (a) a.href = base + "?src=" + encodeURIComponent(src);
})();
(function () {
  "use strict";
  try {
    var meta = document.querySelector('meta[name="ym-id"]');
    var id = meta ? meta.getAttribute("content") : "";
    if (!/^[0-9]{5,12}$/.test(id || "")) return;
    // four goals, each sent once per page view; the goal name is the only thing sent, no personal data
    var sent = {};
    var goal = function (name) {
      if (sent[name]) return;
      sent[name] = true;
      try {
        if (typeof window.ym === "function") window.ym(Number(id), "reachGoal", name);
      } catch (e) { /* a blocked counter must not break the page */ }
    };
    // a sent form is counted by Yandex Forms itself: the form has the same counter (goals ya-forms_start-change,
    // ya-forms_submit); the frame gives the page no reliable signal of it (checked 11.11.2026)
    var target = function (ev) {
      var el = ev.target;
      if (el && el.nodeType !== 1) el = el.parentElement;
      return el && el.closest ? el : null;
    };
    document.addEventListener("click", function (ev) {
      var el = target(ev);
      if (!el) return;
      if (el.closest("[data-cta]")) goal("cta_click");
      if (el.closest("#yformLink")) goal("form_link");
      if (el.closest('a[href^="mailto:"]')) goal("mailto_click");
    }, true);
    var f = document.getElementById("yform");
    if (!f) return;
    var seen = function () { goal("form_seen"); };
    var vh = function () { return window.innerHeight || (document.documentElement || {}).clientHeight || 0; };
    // the frame is 2000–2400 px tall: on a low phone screen 30% of it never fits, so half a screen of it counts too
    var enough = function (visible, height) {
      return height > 0 && visible > 0 && visible >= Math.min(height * 0.3, vh() * 0.5);
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (e.isIntersecting && enough(e.intersectionRect.height, e.boundingClientRect.height)) {
            seen(); io.disconnect(); return;
          }
        }
      }, { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3] });
      io.observe(f);
    } else {
      // old browsers: check the position on scroll and resize instead
      var check = function () {
        var r = f.getBoundingClientRect();
        var visible = Math.min(r.bottom, vh()) - Math.max(r.top, 0);
        if (enough(visible, r.height)) {
          seen();
          window.removeEventListener("scroll", check);
          window.removeEventListener("resize", check);
        }
      };
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
      check();
    }
  } catch (e) { /* the page works without the counter */ }
})();
