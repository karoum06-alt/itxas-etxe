/* ITXAS-ETXE — site behaviour */
(function () {
  "use strict";
  var D = window.ITXAS, R = D.restaurant, CFG = D.config;
  var LANGS = ["eu", "es", "fr", "en"];
  var LOCALE = { es: "es-ES", eu: "eu-ES", fr: "fr-FR", en: "en-GB" };
  var GI = { en: 0, fr: 1, eu: 2 }; // gloss index
  var TI = { es: 0, eu: 1, fr: 2, en: 3 }; // caption index
  var SECTIONS = ["inicio", "historia", "gastronomia", "carta", "vinos", "galeria", "reservas", "contacto"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var lang = "es", T = D.i18n.es;

  function pick(obj, path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function money(n) {
    try { return new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n); }
    catch (e) { return n.toFixed(2).replace(".", ",") + " €"; }
  }

  /* ---------- Language ---------- */
  function parseHash() {
    var h = (location.hash || "").replace("#", "");
    var m = h.match(/^(eu|es|fr|en)(?:-([a-z]+))?$/);
    if (m) return { lang: m[1], sec: m[2] || null };
    if (SECTIONS.indexOf(h) > -1) return { lang: null, sec: h };
    return { lang: null, sec: null };
  }
  function detect() {
    var s = store.get("itxas-lang"); if (LANGS.indexOf(s) > -1) return s;
    var nav = (navigator.languages || [navigator.language || "es"]);
    for (var i = 0; i < nav.length; i++) { var c = (nav[i] || "").slice(0, 2).toLowerCase(); if (LANGS.indexOf(c) > -1) return c; }
    return "es";
  }
  function setHash(sec) {
    var h = "#" + lang + (sec && sec !== "inicio" ? "-" + sec : "");
    try { history.replaceState(null, "", h); } catch (e) {}
  }
  function applyLang(l, keepHash) {
    lang = l; T = D.i18n[l];
    document.documentElement.lang = l;
    document.title = T.metaTitle;
    var md = $('meta[name="description"]'); if (md) md.setAttribute("content", T.metaDesc);
    $$("[data-t]").forEach(function (el) { var v = pick(T, el.getAttribute("data-t")); if (typeof v === "string") el.textContent = v; });
    $$("[data-ph]").forEach(function (el) { el.placeholder = pick(T, el.getAttribute("data-ph")) || ""; });
    $$("[data-ta]").forEach(function (el) { el.setAttribute("aria-label", pick(T, el.getAttribute("data-ta")) || ""); });
    $$("[data-alt]").forEach(function (el) { el.alt = pick(T, el.getAttribute("data-alt")) || ""; });
    $$("[data-langs]").forEach(function (g) {
      g.setAttribute("aria-label", T.langLabel);
      $$("button", g).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === l)); });
    });
    $("#burger").setAttribute("aria-label", T.menuBtn);
    renderStrip(); renderLog(); renderDishes(); renderPillars(); renderMenu(); renderWines(); renderGallery(); renderHours(); updateToggleAll();
    $$(".slide img").forEach(function (im, i) { im.alt = [heroCap(0), heroCap(1), heroCap(2)][i]; });
    $("#slidecap").textContent = heroCap(slideIdx);
    store.set("itxas-lang", l);
    if (!keepHash) setHash(currentSection);
    splitHeads();
    observeReveals();
  }
  function buildLangs() {
    $$("[data-langs]").forEach(function (g) {
      g.innerHTML = LANGS.map(function (l) { return '<button type="button" data-l="' + l + '" lang="' + l + '">' + l.toUpperCase() + "</button>"; }).join("");
      g.addEventListener("click", function (e) { var b = e.target.closest("button[data-l]"); if (b && b.dataset.l !== lang) switchLang(b.dataset.l); });
    });
  }
  function switchLang(l) {
    document.body.style.transition = "opacity .25s"; document.body.style.opacity = ".35";
    setTimeout(function () { applyLang(l); document.body.style.opacity = "1"; }, reduce ? 0 : 220);
  }

  /* ---------- Content renderers ---------- */
  function renderStrip() {
    var words = T.strip.concat(T.strip);
    var ul = function (hidden) { return "<ul" + (hidden ? ' aria-hidden="true"' : "") + ">" + words.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>"; };
    $("#strip").innerHTML = ul(false) + ul(true);
  }
  function renderLog() {
    var num = ["I", "II", "III", "IV"];
    $("#log").innerHTML = T.log.map(function (e, i) { return '<li class="rv" style="transition-delay:' + i * 0.08 + 's"><b>' + num[i] + "</b><h4>" + esc(e[0]) + "</h4><p>" + esc(e[1]) + "</p></li>"; }).join("");
  }
  function renderPillars() {
    $("#pillars").innerHTML = T.pillars.map(function (p, i) { return '<div class="rv" style="transition-delay:' + i * 0.1 + 's"><h3>' + esc(p[0]) + "</h3><p>" + esc(p[1]) + "</p></div>"; }).join("");
  }
  var DISHES = [
    { k: "bonito", f: "dish-bonito", cls: "d-a", cat: "entrantes", w: 1170, h: 1754 },
    { k: "grill", f: "dish-grilled", cls: "d-b", cat: "brasa", w: 736, h: 736 },
    { k: "prawns", f: "dish-prawns", cls: "d-c", cat: "mariscos", w: 736, h: 1308 },
    { k: "cod", f: "dish-cod-peppers", cls: "d-d", cat: "segundos", w: 720, h: 1280 },
    { k: "peppers", f: "dish-fish-red", cls: "d-e", cat: "segundos", w: 1152, h: 2048 }
  ];
  function renderDishes() {
    $("#dishes").innerHTML = DISHES.map(function (d, i) {
      var t = T.dishes[d.k];
      return '<figure class="dish rv-img ' + d.cls + '" data-cursor="menu" style="transition-delay:' + (i % 3) * 0.08 + 's"><img src="img/' + d.f + '.webp" alt="' + esc(t[0]) + '" width="' + d.w + '" height="' + d.h + '" loading="lazy" decoding="async">' +
        "<figcaption><h3>" + esc(t[0]) + "</h3><p>" + esc(t[1]) + '</p><button class="more" type="button" data-cat="' + d.cat + '">' + esc(T.seeInMenu) + "</button></figcaption></figure>";
    }).join("");
  }

  /* Menu */
  var openCats = { entrantes: true };
  function tagHtml(tags) {
    if (!tags) return "";
    return tags.filter(function (t) { return t === "spm" || t === "p2"; }).map(function (t) {
      return t === "spm" ? '<abbr class="tag" title="' + esc(T.tagSpmLong) + '">' + esc(T.tagSpm) + "</abbr>" : '<span class="tag">' + esc(T.tagP2) + "</span>";
    }).join("");
  }
  function unit(tags) { if (!tags) return ""; if (tags.indexOf("kg") > -1) return "<small>" + T.tagKg + "</small>"; if (tags.indexOf("pp") > -1) return "<small>" + esc(T.tagPp) + "</small>"; return ""; }
  function renderMenu() {
    $("#menuChips").setAttribute("aria-label", T.menuTitle);
    $("#menuChips").innerHTML = D.menu.map(function (c) { return '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="' + !!openCats[c.id] + '">' + esc(c[lang]) + "</button>"; }).join("");
    $("#cats").innerHTML = D.menu.map(function (c, ci) {
      var open = !!openCats[c.id];
      var sub = lang === "es" ? "" : "<small>" + esc(c.es) + "</small>";
      var items = c.items.map(function (it, ii) {
        var gloss = lang === "es" ? (it.note ? esc(it.note) : "") : esc(it.g[GI[lang]]);
        return '<li class="item" style="transition-delay:' + Math.min(ii * 0.035, 0.4) + 's"><div class="item__row"><span class="item__name">' + esc(it.n) + tagHtml(it.tags) + '</span><span class="item__dots" aria-hidden="true"></span><span class="item__price">' + money(it.p) + unit(it.tags) + "</span></div>" + (gloss ? '<div class="item__gloss">' + gloss + "</div>" : "") + "</li>";
      }).join("");
      return '<div class="cat' + (open ? " open" : "") + '" id="cat-' + c.id + '"><button class="cat__btn" type="button" aria-expanded="' + open + '" aria-controls="panel-' + c.id + '"><span class="cat__num">' + ("0" + (ci + 1)).slice(-2) + '</span><span class="cat__name">' + esc(c[lang]) + sub + '</span><span class="cat__count">' + c.items.length + " " + esc(T.dishesCount) + '</span><span class="cat__ico" aria-hidden="true"></span></button><div class="cat__panel" id="panel-' + c.id + '" role="region"><div class="cat__inner"' + (open ? "" : " inert") + '><ul class="items">' + items + "</ul></div></div></div>";
    }).join("");
  }
  function setCat(id, open) {
    openCats[id] = open;
    var el = $("#cat-" + id); if (!el) return;
    el.classList.toggle("open", open);
    $(".cat__btn", el).setAttribute("aria-expanded", String(open));
    var inner = $(".cat__inner", el); if (open) inner.removeAttribute("inert"); else inner.setAttribute("inert", "");
    var chip = $('#menuChips [data-cat="' + id + '"]'); if (chip) chip.setAttribute("aria-pressed", String(open));
    updateToggleAll();
  }
  function allOpen() { return D.menu.every(function (c) { return openCats[c.id]; }); }
  function updateToggleAll() { $("#toggleAll").textContent = allOpen() ? T.closeAll : T.openAll; }
  function goCat(id) {
    setCat(id, true);
    setTimeout(function () { scrollToEl($("#cat-" + id), -12); }, 60);
  }

  /* Wines */
  function renderWines() {
    $("#wlist").innerHTML = D.wines.map(function (c) {
      var sub = lang === "es" ? "" : " · " + esc(c.es);
      return '<div class="wcat rv"><h3>' + esc(c[lang]) + sub + "</h3><ul>" + c.items.map(function (w) {
        return '<li><span class="n">' + esc(w[0]) + '</span><span class="d" aria-hidden="true"></span><span class="p">' + money(w[1]) + "</span></li>";
      }).join("") + "</ul></div>";
    }).join("");
  }

  /* Gallery */
  var galCat = "all", galList = [];
  var GCATS = ["restaurant", "terraza", "patrimonio", "mar"];
  var MARKS = { restaurant: "Barruan", terraza: "Kaian", patrimonio: "Oroimena", mar: "Itsasoa" };
  function renderGallery() {
    $("#galChips").setAttribute("aria-label", T.galleryKicker);
    $("#galChips").innerHTML = ["all"].concat(GCATS).map(function (c) { return '<button class="chip" type="button" data-g="' + c + '" aria-pressed="' + (c === galCat) + '">' + esc(T.galleryCats[c]) + "</button>"; }).join("");
    var num = ["I", "II", "III", "IV"], n = 0;
    $("#masonry").innerHTML = GCATS.map(function (c, ci) {
      var list = [];
      D.photos.forEach(function (p, i) { if (p.g !== false && p.cat === c) list.push(i); });
      var tiles = list.map(function (i, k) {
        var p = D.photos[i], cap = p.t[TI[lang]]; n++;
        return '<button class="gitem rv" style="transition-delay:' + (k * 0.08).toFixed(2) + 's" data-cursor="open" type="button" data-i="' + i + '" aria-label="' + esc(T.open + ": " + cap) + '"><img src="img/' + p.f + '-s.webp" alt="' + esc(cap) + '" width="' + p.w + '" height="' + p.h + '" loading="lazy" decoding="async"><span class="gtag"><em>Nº ' + ("0" + n).slice(-2) + "</em>" + esc(cap) + "</span></button>";
      }).join("");
      return '<div class="gchap gchap--' + c + " n" + list.length + '" data-cat="' + c + '"' + (galCat === "all" || galCat === c ? "" : " hidden") + '><span class="gchap__mark" data-par="0.07" aria-hidden="true">' + MARKS[c] + '</span><header class="gchap__head rv"><span class="gchap__num">' + num[ci] + '</span><div>' + (c === "restaurant" ? '<span class="gchap__badge">' + esc(T.insideBadge) + "</span>" : "") + "<h3>" + esc(T.galleryCats[c]) + '</h3><p class="gchap__line">' + esc(T.galleryLines[c]) + '</p><p class="gchap__text">' + esc(T.galleryText[c]) + '</p></div><span class="gchap__count">' + list.length + " " + esc(T.photosCount) + '</span></header><div class="ggrid">' + tiles + "</div></div>";
    }).join('<div class="rope" aria-hidden="true"><i></i><svg viewBox="0 0 40 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 12h10c4 0 6-8 10-8s6 4 2 8-8 8-4 8 6-4 10-8"/><circle cx="20" cy="12" r="3.2"/></svg><i></i></div>');
    if (window.__refreshPar) window.__refreshPar();
    $$("#masonry img").forEach(function (im) { if (im.complete) im.classList.add("ld"); else im.addEventListener("load", function () { im.classList.add("ld"); }); });
  }
  function filterGal(c) {
    galCat = c;
    $$("#galChips .chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.g === c)); });
    var m = $("#masonry"); m.style.opacity = "0"; m.style.transition = "opacity .3s";
    setTimeout(function () {
      $$(".gchap", m).forEach(function (g) { g.hidden = !(c === "all" || g.dataset.cat === c); });
      $$(".rope", m).forEach(function (r) { r.hidden = c !== "all"; });
      m.style.opacity = "1";
    }, reduce ? 0 : 280);
  }

  /* Lightbox */
  var lbIdx = 0, lastFocus = null;
  function visiblePhotos() { return $$(".gitem").filter(function (g) { return !g.closest(".gchap").hidden; }).map(function (g) { return +g.dataset.i; }); }
  function lbShow(i) {
    galList = visiblePhotos(); lbIdx = Math.max(0, galList.indexOf(i));
    lbRender(); var lb = $("#lb"); lastFocus = document.activeElement;
    lb.classList.add("on"); lb.setAttribute("aria-hidden", "false"); lockScroll(true);
    $('[data-lb="close"]', lb).focus();
  }
  function lbRender(dir) {
    var p = D.photos[galList[lbIdx]], img = $("#lbImg");
    img.style.opacity = "0"; img.style.transform = "translateX(" + (dir ? dir * 24 : 0) + "px)";
    var n = new Image(); n.onload = function () { img.src = n.src; img.alt = p.t[TI[lang]]; requestAnimationFrame(function () { img.style.opacity = "1"; img.style.transform = "none"; }); };
    n.src = "img/" + p.f + ".webp";
    $("#lbCap").textContent = p.t[TI[lang]];
    $("#lbCount").textContent = (lbIdx + 1) + " / " + galList.length;
  }
  function lbStep(d) { lbIdx = (lbIdx + d + galList.length) % galList.length; lbRender(d); }
  function lbClose() { var lb = $("#lb"); lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true"); lockScroll(false); if (lastFocus) lastFocus.focus(); }

  /* ---------- Scrolling ---------- */
  var lenis = null;
  function scrollToEl(el, extra) {
    if (!el) return;
    var off = -($("#hdr").offsetHeight) + (extra || 0);
    if (lenis) { lenis.scrollTo(el, { offset: off, duration: 1.4 }); return; }
    var y = el.getBoundingClientRect().top + window.pageYOffset + off;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  function goSection(id) {
    closeDrawer();
    var el = document.getElementById(id); if (!el) return;
    if (id === "inicio") { if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }
    else scrollToEl(el, 0);
    currentSection = id; setHash(id);
  }
  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    if (lenis) { if (on) lenis.stop(); else lenis.start(); }
  }
  function initLenis() {
    if (reduce || !window.Lenis || !matchMedia("(pointer:fine)").matches) return;
    try {
      lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    } catch (e) { lenis = null; }
  }

  /* ---------- Drawer ---------- */
  function openDrawer() { document.body.classList.add("menu-open"); $("#burger").setAttribute("aria-expanded", "true"); $("#drawer").setAttribute("aria-hidden", "false"); lockScroll(true); }
  function closeDrawer() { if (!document.body.classList.contains("menu-open")) return; document.body.classList.remove("menu-open"); $("#burger").setAttribute("aria-expanded", "false"); $("#drawer").setAttribute("aria-hidden", "true"); lockScroll(false); }

  /* ---------- Hero slideshow ---------- */
  var slideIdx = 0, slideTimer = null;
  function heroCap(i) { var f = ["hero-exterior", "terrace-evening", "terrace-arch"][i]; var p = D.photos.filter(function (x) { return x.f === f; })[0]; return p ? p.t[TI[lang]] : ""; }
  function showSlide(i) {
    var s = $$(".slide"); slideIdx = (i + s.length) % s.length;
    s.forEach(function (el, k) { el.classList.toggle("on", k === slideIdx); });
    $$("#dots button").forEach(function (b, k) { b.setAttribute("aria-current", String(k === slideIdx)); });
    var cap = $("#slidecap"); cap.style.opacity = 0; setTimeout(function () { cap.textContent = heroCap(slideIdx); cap.style.opacity = 1; }, 400);
  }
  function startSlides() {
    var dots = $("#dots");
    dots.innerHTML = $$(".slide").map(function (_, i) { return '<button type="button" aria-label="' + (i + 1) + '" aria-current="' + (i === 0) + '"></button>'; }).join("");
    dots.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; showSlide($$("button", dots).indexOf(b)); restart(); });
    $("#slidecap").style.transition = "opacity .4s";
    function restart() { clearInterval(slideTimer); if (!reduce) slideTimer = setInterval(function () { if (!document.hidden) showSlide(slideIdx + 1); }, 7000); }
    restart();
  }


  /* ---------- Motion layer ---------- */
  function splitHeads() {
    $$(".h2, .ftr__closing, .sea .h2").forEach(function (el) {
      var txt = el.textContent; if (!txt || el.querySelector(".w")) return;
      el.innerHTML = txt.split(/\s+/).map(function (w, i) { return '<span class="w"><span style="--i:' + i + '">' + esc(w) + "</span></span>"; }).join(" ");
      el.classList.add("split");
      if (!el.classList.contains("rv")) el.classList.add("rv");
    });
  }
  var fine = matchMedia("(pointer:fine)").matches, mx = 0, my = 0;
  var heroArch, heroCopy, imgPar = [];
  var helmSpin = 0;
  function motionScroll(y, vh) {
    var w = document.getElementById("wheel");
    if (w && !reduce) w.style.rotate = (y * 0.22 + helmSpin).toFixed(1) + "deg";
    // header progress
    var max = document.documentElement.scrollHeight - vh;
    $("#progress").style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ")";
    if (reduce) return;
    // hero: arch drifts, copy lifts and fades
    if (y < vh * 1.2) {
      var k = y / vh;
      heroArch.style.translate = (fine ? mx * 14 : 0).toFixed(1) + "px " + (y * 0.18 + (fine ? my * 10 : 0)).toFixed(1) + "px";
      heroCopy.style.translate = "0 " + (y * -0.08).toFixed(1) + "px";
      heroCopy.style.opacity = Math.max(0, 1 - k * 1.1).toFixed(3);
    }
    // images drift inside their frames
    var sw = $("[data-swim]");
    if (sw) { var sr = sw.getBoundingClientRect(); if (sr.bottom > -100 && sr.top < vh + 100) { var sc = (sr.top + sr.height / 2 - vh / 2) / vh; sw.style.translate = (sc * Math.min(70, innerWidth * 0.05)).toFixed(1) + "px 0"; } }
    $$(".dish img, .story__art .rv-img img").forEach(function (im) {
      var r = im.parentNode.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
      var c = (r.top + r.height / 2 - vh / 2) / vh;
      im.style.translate = "0 " + (c * -42).toFixed(1) + "px";
    });
  }
  function initMotion() {
    var helm = $("#helm");
    if (helm) helm.addEventListener("click", function () {
      helmSpin += 360; var w = $("#wheel"); w.classList.add("spin"); onScroll();
      setTimeout(function () { w.classList.remove("spin"); }, 1600);
    });
    heroArch = $(".arch"); heroCopy = $(".hero__copy");
    imgPar = $$(".dish img, .story__art .rv-img img");
    if (reduce) return;
    if (fine) {
      // hero mouse depth
      $(".hero").addEventListener("mousemove", function (e) {
        mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; onScroll();
      });
      // magnetic buttons
      $$(".hero .btn, .hdr__book, .book .btn--ink, .ftr .btn").forEach(function (b) {
        b.addEventListener("mousemove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px " + ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + "px";
        });
        b.addEventListener("mouseleave", function () { b.style.translate = ""; });
      });
      // follow cursor over photos
      var cur = $("#cursor"), lab = $("span", cur), cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, on = false;
      document.addEventListener("mousemove", function (e) {
        tx = e.clientX; ty = e.clientY;
        var t = e.target.closest && e.target.closest("[data-cursor]");
        if (t) { lab.textContent = t.dataset.cursor === "menu" ? T.nav.menu : T.open; }
        if (!!t !== on) { on = !!t; cur.classList.toggle("on", on); }
      }, { passive: true });
      (function loop() {
        cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
        cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
        requestAnimationFrame(loop);
      })();
      // gentle tilt on gallery photos
      $("#masonry").addEventListener("mousemove", function (e) {
        var g = e.target.closest(".gitem"); if (!g) return;
        var r = g.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        g.style.transform = "perspective(900px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg)";
      });
      $("#masonry").addEventListener("mouseout", function (e) { var g = e.target.closest(".gitem"); if (g && !g.contains(e.relatedTarget)) g.style.transform = ""; });
    }
  }

  /* ---------- Reveal & parallax ---------- */
  var io = null;
  function observeReveals() {
    var els = $$(".rv:not(.in), .rv-img:not(.in)");
    if (!("IntersectionObserver" in window) || reduce) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  }
  var parEls = [], ticking = false, currentSection = "inicio";
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.pageYOffset, vh = window.innerHeight;
      if (heroArch) motionScroll(y, vh);
      $("#hdr").classList.toggle("is-solid", y > vh * 0.82 - 80);
      var bookR = $("#reservas").getBoundingClientRect();
      $("#mbar").classList.toggle("on", y > vh * 0.6 && !(bookR.top < vh && bookR.bottom > 0));
      if (!reduce && window.innerWidth > 900) parEls.forEach(function (el) {
        var r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
        var c = (r.top + r.height / 2 - vh / 2); el.style.transform = "translate3d(0," + (c * parseFloat(el.dataset.par)).toFixed(1) + "px,0)";
      });
      var active = "inicio";
      SECTIONS.forEach(function (id) { var el = document.getElementById(id); if (el && el.getBoundingClientRect().top < vh * 0.4) active = id; });
      if (active !== currentSection) { currentSection = active; $$(".nav a").forEach(function (a) { a.classList.toggle("is-active", a.dataset.go === active); }); setHash(active); }
    });
  }

  /* ---------- Forms ---------- */
  var loadedAt = Date.now();
  function todayISO() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function setErr(field, msg) {
    var wrap = field.closest(".field"); if (!wrap) return;
    wrap.classList.toggle("bad", !!msg);
    var m = $(".msg", wrap); if (!m) { m = document.createElement("span"); m.className = "msg"; wrap.appendChild(m); }
    m.textContent = msg || ""; field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) { if (!m.id) m.id = "m-" + Math.random().toString(36).slice(2); field.setAttribute("aria-describedby", m.id); }
  }
  function validate(form) {
    var ok = true, first = null;
    $$("input, textarea, select", form).forEach(function (f) {
      if (f.name === "company" || f.type === "radio") return;
      var v = f.type === "checkbox" ? f.checked : f.value.trim(), msg = "";
      if (f.required && !v) msg = f.name === "consent" ? T.err.consent : T.err.required;
      else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = T.err.email;
      else if (f.type === "tel" && v && (v.replace(/\D/g, "").length < 6 || !/^[+()\d\s.\-]+$/.test(v))) msg = T.err.phone;
      else if (f.type === "date" && v && v < todayISO()) msg = T.err.date;
      setErr(f, msg); if (msg) { ok = false; first = first || f; }
    });
    if (first) first.focus({ preventScroll: false });
    return ok;
  }
  function fmtDate(iso) { try { return new Date(iso + "T12:00:00").toLocaleDateString(LOCALE[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch (e) { return iso; } }
  function reservationData(form) {
    var fd = new FormData(form);
    return {
      type: "reservation", status: "pending", lang: lang,
      name: fd.get("name").trim(), phone: fd.get("phone").trim(), email: fd.get("email").trim(),
      date: fd.get("date"), time: fd.get("time"), service: fd.get("service"), guests: +$("#r-guests").value || +$("#r-guests").textContent,
      requests: (fd.get("requests") || "").trim(), allergies: (fd.get("allergies") || "").trim(), consent: true, sentAt: new Date().toISOString()
    };
  }
  function summaryText(d) {
    var L = T.f, lines = [
      L.name + ": " + d.name, L.phone + ": " + d.phone, L.email + ": " + d.email,
      L.date + ": " + fmtDate(d.date), L.service + ": " + (d.service === "dinner" ? L.dinner : L.lunch) + " · " + d.time,
      L.guests + ": " + d.guests
    ];
    if (d.requests) lines.push(L.requests + ": " + d.requests);
    if (d.allergies) lines.push(L.allergies + ": " + d.allergies);
    return lines.join("\n");
  }
  function post(url, data) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r; });
  }
  function showState(id) {
    $("#rform").style.display = "none"; ["#rok", "#roff"].forEach(function (s) { $(s).classList.remove("on"); });
    var el = $(id); el.classList.add("on"); el.focus({ preventScroll: true });
    scrollToEl($(".card"), -20);
  }
  function initReservation() {
    var form = $("#rform"), date = $("#r-date"), out = $("#r-guests"), btn = $('button[type="submit"]', form);
    date.min = todayISO();
    var guests = 2;
    $$("[data-step]", form).forEach(function (b) { b.addEventListener("click", function () { guests = Math.min(12, Math.max(1, guests + +b.dataset.step)); out.value = guests; out.textContent = guests; }); });
    out.value = 2;
    $$('input[name="service"]', form).forEach(function (r) { r.addEventListener("change", function () { $("#r-time").value = r.value === "dinner" ? "21:00" : "14:00"; }); });
    form.addEventListener("input", function (e) { if (e.target.closest(".field.bad")) setErr(e.target, ""); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); $("#rerr").textContent = "";
      if (!validate(form)) { $("#rerr").textContent = T.err.form; return; }
      if (form.company.value || Date.now() - loadedAt < 2500) return; // spam guard
      var d = reservationData(form), sum = summaryText(d);
      if (!CFG.reservationEndpoint) { $("#rsum2").textContent = sum; showState("#roff"); return; }
      btn.disabled = true; btn.textContent = T.f.sending;
      d._subject = "Solicitud de reserva · Itxas-Etxe · " + d.date + " " + d.time + " · " + d.guests + " pers. (PENDIENTE)";
      d._replyto = d.email; d.summary = sum;
      post(CFG.reservationEndpoint, d).then(function () {
        $("#rsum1").textContent = sum; showState("#rok"); form.reset(); date.min = todayISO();
      }).catch(function () { $("#rerr").textContent = T.err.network; })
        .then(function () { btn.disabled = false; btn.textContent = T.f.submit; });
    });
    $$("[data-again]").forEach(function (b) { b.addEventListener("click", function () { ["#rok", "#roff"].forEach(function (s) { $(s).classList.remove("on"); }); form.style.display = ""; $("#r-name").focus(); }); });
    $("#copySum").addEventListener("click", function () {
      var b = this, txt = "Restaurante Itxas-Etxe\n" + $("#rsum2").textContent;
      var done = function () { b.textContent = T.copied; setTimeout(function () { b.textContent = T.copy; }, 1800); };
      try { navigator.clipboard.writeText(txt).then(done, function () {}); } catch (e) {}
    });
  }
  function initContact() {
    var form = $("#cform"), btn = $('button[type="submit"]', form);
    form.addEventListener("input", function (e) { if (e.target.closest(".field.bad")) setErr(e.target, ""); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var err = $("#cerr"); err.style.color = ""; err.textContent = "";
      if (!validate(form)) { err.textContent = T.err.form; return; }
      if (form.company.value) return;
      if (!CFG.contactEndpoint) { err.style.color = "var(--marine)"; err.textContent = T.contactOff; return; }
      var fd = new FormData(form);
      btn.disabled = true;
      post(CFG.contactEndpoint, { type: "contact", lang: lang, name: fd.get("name"), email: fd.get("email"), _replyto: fd.get("email"), message: fd.get("message"), _subject: "Mensaje web · Itxas-Etxe" })
        .then(function () { form.reset(); err.style.color = "var(--marine)"; err.textContent = T.contactOk; })
        .catch(function () { err.textContent = T.err.network; })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- Contact, map, modals, cookies ---------- */
  function renderHours() {
    var h = R.hours && (R.hours[lang] || R.hours.es);
    $("#hours").textContent = h || T.hoursAsk;
  }
  var framed = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  function mapsAllowed() { return store.get("itxas-maps") === "1"; }
  function loadMap() {
    if (framed || $("#map iframe")) return;
    var f = document.createElement("iframe");
    f.src = R.mapEmbed; f.loading = "lazy"; f.title = "Google Maps · Restaurante Itxas-Etxe"; f.referrerPolicy = "no-referrer-when-downgrade";
    $("#map").insertBefore(f, $(".map__foot")); $(".map__pin").hidden = true; $("#loadMap").hidden = true; $("#mapNote").hidden = true;
  }
  function initMap() {
    $("#dirBtn").href = R.directionsUrl; $("#mapsBtn").href = R.mapsUrl;
    if (framed) return; // embedded preview: external maps are blocked, keep the links
    $("#loadMap").hidden = false; $("#mapNote").hidden = false;
    $("#loadMap").addEventListener("click", function () { store.set("itxas-maps", "1"); $("#ckMaps").checked = true; loadMap(); });
    if (mapsAllowed()) loadMap();
  }
  function openModal(kind) {
    var m = $("#modal"); lastFocus = document.activeElement;
    $("#modalT").textContent = T.legal[kind];
    $("#modalB").innerHTML = (kind === "privacy" ? T.privacyText : T.noticeText).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    m.classList.add("on"); m.setAttribute("aria-hidden", "false"); lockScroll(true); $(".modal__close", m).focus();
  }
  function closeModal() { var m = $("#modal"); if (!m.classList.contains("on")) return; m.classList.remove("on"); m.setAttribute("aria-hidden", "true"); lockScroll(false); if (lastFocus) lastFocus.focus(); }
  function initCookie() {
    var c = $("#cookie"), ck = $("#ckMaps");
    ck.checked = mapsAllowed();
    if (framed) ck.closest("label").hidden = true;
    if (!store.get("itxas-cookie")) setTimeout(function () { c.classList.add("on"); }, 1800);
    $("#ckOk").addEventListener("click", function () {
      store.set("itxas-cookie", "1"); store.set("itxas-maps", ck.checked ? "1" : "0");
      c.classList.remove("on"); if (ck.checked) loadMap();
    });
    $$("[data-cookie]").forEach(function (b) { b.addEventListener("click", function () { ck.checked = mapsAllowed(); c.classList.add("on"); $("#ckOk").focus(); }); });
  }

  /* ---------- Events ---------- */
  function trapFocus(container, e) {
    var f = $$('button, a[href], input, [tabindex]:not([tabindex="-1"])', container).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return; var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function bind() {
    document.addEventListener("click", function (e) {
      var go = e.target.closest("[data-go]"); if (go) { e.preventDefault(); goSection(go.dataset.go); return; }
      var cb = e.target.closest(".cat__btn"); if (cb) { var id = cb.parentNode.id.replace("cat-", ""); setCat(id, !openCats[id]); return; }
      var chip = e.target.closest("#menuChips .chip"); if (chip) { goCat(chip.dataset.cat); return; }
      var more = e.target.closest(".dish .more"); if (more) { scrollToEl($("#carta")); setTimeout(function () { goCat(more.dataset.cat); }, lenis ? 900 : 500); return; }
      var gc = e.target.closest("#galChips .chip"); if (gc) { filterGal(gc.dataset.g); return; }
      var gi = e.target.closest(".gitem"); if (gi) { lbShow(+gi.dataset.i); return; }
      var lb = e.target.closest("[data-lb]"); if (lb) { var a = lb.dataset.lb; if (a === "close") lbClose(); else lbStep(a === "next" ? 1 : -1); return; }
      if (e.target.id === "lbStage") { lbClose(); return; }
      var md = e.target.closest("[data-modal]"); if (md) { openModal(md.dataset.modal); return; }
      if (e.target.closest("[data-close]") || e.target.id === "modal") { closeModal(); return; }
      if (e.target.closest(".consent button")) { openModal("privacy"); }
    });
    $("#burger").addEventListener("click", function () { document.body.classList.contains("menu-open") ? closeDrawer() : openDrawer(); });
    $("#toggleAll").addEventListener("click", function () { var o = !allOpen(); D.menu.forEach(function (c) { setCat(c.id, o); }); });
    document.addEventListener("keydown", function (e) {
      var lbOn = $("#lb").classList.contains("on"), mOn = $("#modal").classList.contains("on");
      if (e.key === "Escape") { if (lbOn) lbClose(); else if (mOn) closeModal(); else closeDrawer(); }
      if (lbOn && e.key === "ArrowRight") lbStep(1);
      if (lbOn && e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "Tab") { if (lbOn) trapFocus($("#lb"), e); else if (mOn) trapFocus($("#modal"), e); else if (document.body.classList.contains("menu-open")) trapFocus(document.body, e); }
    });
    var sx = null, sy = null;
    $("#lbStage").addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    $("#lbStage").addEventListener("touchend", function (e) {
      if (sx == null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) lbStep(dx < 0 ? 1 : -1); sx = null;
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("hashchange", function () { var h = parseHash(); if (h.lang && h.lang !== lang) applyLang(h.lang, true); if (h.sec) goSection(h.sec); });
  }

  /* ---------- Structured data (menu) ---------- */
  function jsonld() {
    var data = { "@context": "https://schema.org", "@type": "Menu", name: "Carta · Restaurante Itxas-Etxe", inLanguage: "es",
      hasMenuSection: D.menu.map(function (c) { return { "@type": "MenuSection", name: c.es, hasMenuItem: c.items.map(function (i) { return { "@type": "MenuItem", name: i.n, description: i.g[0], offers: { "@type": "Offer", price: i.p.toFixed(2), priceCurrency: "EUR" } }; }) }; }) };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  /* ---------- Boot ---------- */
  function boot() {
    buildLangs();
    var h = parseHash();
    applyLang(h.lang || detect(), true);
    setHash(h.sec || "inicio");
    parEls = $$("[data-par]");
    window.__refreshPar = function () { parEls = $$("[data-par]"); };
    bind(); startSlides(); initReservation(); initContact(); initMap(); initCookie(); jsonld();
    $("#yr").textContent = new Date().getFullYear();
    initLenis(); initMotion();
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add("is-in"); }); });
    onScroll();
    if (h.sec && h.sec !== "inicio") setTimeout(function () { goSection(h.sec); }, 300);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
