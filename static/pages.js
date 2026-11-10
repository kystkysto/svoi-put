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
