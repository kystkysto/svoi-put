(function () {
  "use strict";
  var p = new URLSearchParams(location.search);
  var src = (p.get("src") || p.get("utm_source") || "direct").toLowerCase().slice(0, 40);
  if (!/^(direct|friend|assoc|interview|other|(ya|vk|tg)_[a-z]{2,16})$/.test(src)) src = "other";

  if (src === "ya_pain" || src === "ya_schoolpain") {
    try {
      var ey = document.querySelector(".hero .eyebrow"), h1 = document.querySelector(".hero h1"),
          note = document.querySelector(".hero .note");
      if (ey) ey.textContent = "Для родителей детей 1–11 классов · если ребёнок устал от школы";
      if (h1) h1.textContent = "Ребёнок устал от школы и домашек? Передайте учёбу персональному ИИ-наставнику.";
      if (note) note.textContent = "Полная программа 1–11 классов дома за ~2 часа в день вместо 6 часов школы. Открываем ранний доступ: 2 недели бесплатно. Аттестация — в прикреплённой школе.";
    } catch (e) {}
  }

  var f = document.getElementById("yform"), a = document.getElementById("yformLink");
  if (f) {
    var base = f.getAttribute("data-form");
    f.src = base + "?iframe=1&src=" + encodeURIComponent(src);
    if (a) a.href = base + "?src=" + encodeURIComponent(src);
  }

  var themes = {
    football: {
      explain: "«Процент — это сотая часть. Если нападающий пробил по воротам 20 раз, а 12 ударов попали в створ — как перевести это в проценты? Умножим и 12, и 20 на 5: получится 60 ударов из 100 — то есть 60%.»",
      question: "2. Теперь решите задачу сами: вратарь отбил 15 пенальти из 25. Сколько это процентов?"
    },
    games: {
      explain: "«Процент — это сотая часть. Если в игре 20 уровней и ты прошёл 12 — это дробь 12/20. Умножим верх и низ на 5, чтобы знаменатель стал 100: получится 60/100, то есть пройдено 60%.»",
      question: "2. Теперь решите задачу сами: игрок собрал 15 из 25 кристаллов на карте. Какой процент собран?"
    },
    space: {
      explain: "«Процент — это сотая часть. Если корабль прошёл 12 ступеней траектории из 20 — это дробь 12/20. Умножим оба числа на 5, чтобы получить долю от 100: выйдет 60/100, значит, позади 60% пути.»",
      question: "2. Теперь решите задачу сами: марсоход передал 15 из 25 снимков. Сколько процентов передано?"
    }
  };
  var demoBox = document.getElementById("demoBox");
  if (!demoBox) return;
  var exEl = document.getElementById("demoExplain");
  var qEl = document.getElementById("demoQuestion");
  var repEl = document.getElementById("demoReply");
  var tabs = demoBox.querySelectorAll("[data-demo-theme]");
  var opts = demoBox.querySelectorAll("[data-demo-ans]");

  var clearAnswer = function () {
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove("is-right", "is-wrong");
    if (repEl) {
      repEl.hidden = true;
      repEl.classList.remove("is-right", "is-hint");
      repEl.textContent = "";
    }
  };

  demoBox.addEventListener("click", function (ev) {
    var el = ev.target;
    if (el && el.nodeType !== 1) el = el.parentElement;
    if (!el || !el.closest) return;
    var tab = el.closest("[data-demo-theme]");
    if (tab) {
      var key = tab.getAttribute("data-demo-theme");
      var t = themes[key];
      if (!t) return;
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle("is-active", tabs[i] === tab);
      if (exEl) exEl.textContent = t.explain;
      if (qEl) qEl.textContent = t.question;
      clearAnswer();
      return;
    }
    var opt = el.closest("[data-demo-ans]");
    if (opt) {
      var ans = opt.getAttribute("data-demo-ans");
      for (var j = 0; j < opts.length; j++) opts[j].classList.remove("is-right", "is-wrong");
      if (!repEl) return;
      repEl.hidden = false;
      repEl.classList.remove("is-right", "is-hint");
      if (ans === "right") {
        opt.classList.add("is-right");
        repEl.classList.add("is-right");
        repEl.textContent = "✓ Верно: 25 × 4 = 100 и 15 × 4 = 60, значит 60%. Тему пометили как предварительно освоенную — вернём похожую задачу на повтор через пару дней и добавили в вечерний отчёт родителю.";
      } else {
        opt.classList.add("is-wrong");
        repEl.classList.add("is-hint");
        repEl.textContent = "Почти, давай по шагам без угадывания: 15 из 25 — это дробь 15/25. На сколько нужно умножить 25, чтобы получилось 100? Умножь 15 на это же число — сколько выйдет?";
      }
    }
  });
})();
(function () {
  "use strict";
  try {
    var meta = document.querySelector('meta[name="ym-id"]');
    var id = meta ? meta.getAttribute("content") : "";
    if (!/^[0-9]{5,12}$/.test(id || "")) return;
    var sent = {};
    var goal = function (name) {
      if (sent[name]) return;
      sent[name] = true;
      try {
        if (typeof window.ym === "function") window.ym(Number(id), "reachGoal", name);
      } catch (e) {}
    };
    var target = function (ev) {
      var el = ev.target;
      if (el && el.nodeType !== 1) el = el.parentElement;
      return el && el.closest ? el : null;
    };
    document.addEventListener("click", function (ev) {
      var el = target(ev);
      if (!el) return;
      if (el.closest("[data-cta]")) goal("cta_click");
      if (el.closest("[data-demo-theme]") || el.closest("[data-demo-ans]")) goal("demo_try");
      if (el.closest("#yformLink")) goal("form_link");
      if (el.closest('a[href^="mailto:"]')) goal("mailto_click");
    }, true);
    var f = document.getElementById("yform");
    if (!f) return;
    var seen = function () { goal("form_seen"); };
    var vh = function () { return window.innerHeight || (document.documentElement || {}).clientHeight || 0; };
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
  } catch (e) {}
})();
