/* Felix Remmen — Portfolio: Interaktion
   Grid-Rendering, Filter, Lightbox mit Zwei-Klick-YouTube-Embed,
   Timecode-Ruler, Scroll-Reveals, Mobile-Menü. */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const reduzierteBewegung = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Timecode-Ruler (Signature) ----------
     Die Seite verhält sich wie eine Timeline: Der Playhead wandert mit
     der Scroll-Position, der Timecode läuft bei 24 fps über eine
     fiktive Laufzeit von 2:30 Minuten. */

  const FPS = 24;
  const LAUFZEIT_FRAMES = 150 * FPS;
  const timecodeEl = $("#timecode");
  const playheadEl = $("#playhead");
  const rulerEl = $(".ruler");
  let tickGeplant = false;

  const pad = (n) => String(n).padStart(2, "0");

  function scrollFortschritt() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function rulerUpdate() {
    tickGeplant = false;
    const p = scrollFortschritt();
    if (playheadEl && rulerEl) {
      playheadEl.style.transform = `translateX(${p * (rulerEl.clientWidth - 2)}px)`;
    }
    if (timecodeEl) {
      const frames = Math.round(p * LAUFZEIT_FRAMES);
      const ff = frames % FPS;
      const s = Math.floor(frames / FPS);
      timecodeEl.textContent = `TC 00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(ff)}`;
    }
    navAktivUpdate();
    stapel3dAktualisieren(); // 3D-Tiefe des Karten-Decks am Scroll-Fortschritt
    prozessAktualisieren(); // Punkt-Position auf der Arbeitsweise-Linie
  }

  function rulerAnfordern() {
    if (!tickGeplant) {
      tickGeplant = true;
      requestAnimationFrame(rulerUpdate);
    }
  }

  window.addEventListener("scroll", rulerAnfordern, { passive: true });
  window.addEventListener("resize", rulerAnfordern);

  /* ---------- Projekt-Grid + Filter ---------- */

  const grid = $("#projekt-grid");
  const filterLeiste = $("#filter-leiste");
  const KATEGORIE_REIHENFOLGE = ["imagefilm", "werbefilm", "social", "kurzfilm"];

  function kartenMarkup(p, index) {
    const award = p.award
      ? '<span class="karte-award">★ Nominiert</span>'
      : "";
    return `
      <article class="projekt-karte reveal" data-kategorie="${esc(p.kategorie)}">
        <div class="karte-buehne">
          <button class="karte-trigger" data-projekt="${esc(p.id)}" aria-haspopup="dialog">
            <div class="karte-glow" aria-hidden="true"></div>
            <div class="karte-media">
              <img src="${esc(p.thumb)}" alt="Vorschaubild: ${esc(p.titel)}" loading="${index < 2 ? "eager" : "lazy"}" width="1600" height="900">
              ${award}
              <span class="karte-play" aria-hidden="true">▶ Ansehen</span>
            </div>
            <div class="karte-info">
              <h3>${esc(p.titel)}</h3>
              <span class="meta">${esc(KATEGORIEN[p.kategorie])} — ${p.jahr}</span>
            </div>
          </button>
        </div>
      </article>`;
  }

  // Vergibt fortlaufende Stapel-Indizes an die sichtbaren Karten —
  // daraus errechnet das CSS den Sticky-Versatz des Decks.
  function stapelAktualisieren() {
    let i = 0;
    grid.querySelectorAll(".projekt-karte").forEach((karte) => {
      if (karte.classList.contains("versteckt")) {
        karte.style.removeProperty("--stapel-i");
        return;
      }
      karte.style.setProperty("--stapel-i", i);
      i += 1;
    });
  }

  // 3D-Tiefe des Karten-Decks: Für jede sichtbare Karte wird gemessen, wie stark
  // sie von der folgenden Karte überdeckt wird (0 = frei, 1 = komplett gestapelt).
  // Die Tiefe akkumuliert nach hinten (depth_i = cover_i + depth_{i+1}), sodass
  // weiter hinten steckende Karten perspektivisch tiefer zurückrücken — gedeckelt
  // bei TIEFE_MAX, damit die hintersten Kanten sichtbar bleiben (echtes Deck).
  // Gemessen wird die *untransformierte* .projekt-karte (nur ihr Sticky-Offset);
  // die 3D-Transform liegt auf der inneren .karte-buehne, es gibt also keine
  // Rückkopplung über getBoundingClientRect.
  const TIEFE_MAX = 3.4;

  function stapel3dAktualisieren() {
    if (!grid) return;
    const karten = Array.from(grid.querySelectorAll(".projekt-karte")).filter(
      (k) => !k.classList.contains("versteckt")
    );
    if (reduzierteBewegung.matches || karten.length === 0) {
      karten.forEach((k) => k.style.setProperty("--tiefe", "0"));
      return;
    }

    const rects = karten.map((k) => k.getBoundingClientRect());
    let tiefe = 0; // Tiefe der jeweils dahinter liegenden Karte
    for (let i = karten.length - 1; i >= 0; i -= 1) {
      let cover = 0;
      if (i < karten.length - 1) {
        const r = rects[i];
        const naechste = rects[i + 1];
        if (r.height > 0) {
          cover = Math.min(1, Math.max(0, (r.bottom - naechste.top) / r.height));
        }
      }
      tiefe += cover;
      karten[i].style.setProperty("--tiefe", Math.min(TIEFE_MAX, tiefe).toFixed(3));
    }
  }

  function gridRendern() {
    if (!grid || !filterLeiste) return;

    grid.innerHTML = PROJEKTE.map(kartenMarkup).join("");
    stapelAktualisieren();
    stapel3dAktualisieren();

    const vorhandene = KATEGORIE_REIHENFOLGE.filter((k) =>
      PROJEKTE.some((p) => p.kategorie === k)
    );
    const buttons = [
      `<button class="filter-btn" data-filter="alle" aria-pressed="true">Alle (${PROJEKTE.length})</button>`,
      ...vorhandene.map((k) => {
        const n = PROJEKTE.filter((p) => p.kategorie === k).length;
        return `<button class="filter-btn" data-filter="${k}" aria-pressed="false">${esc(KATEGORIEN[k])} (${n})</button>`;
      }),
    ];
    filterLeiste.innerHTML = buttons.join("");

    filterLeiste.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterLeiste.querySelectorAll(".filter-btn").forEach((b) => {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const filter = btn.dataset.filter;
      grid.querySelectorAll(".projekt-karte").forEach((karte) => {
        karte.classList.toggle(
          "versteckt",
          filter !== "alle" && karte.dataset.kategorie !== filter
        );
      });
      stapelAktualisieren();
      stapel3dAktualisieren();
    });

    grid.addEventListener("click", (e) => {
      const trigger = e.target.closest(".karte-trigger");
      if (!trigger) return;
      const projekt = PROJEKTE.find((p) => p.id === trigger.dataset.projekt);
      if (projekt) lightboxOeffnen(projekt, trigger);
    });

    // Cursor-folgender Neon-Glow auf den Karten: Position landet in
    // CSS-Variablen, das Ein-/Ausblenden übernimmt der :hover-Zustand im CSS.
    grid.addEventListener("pointermove", (e) => {
      const trigger = e.target.closest(".karte-trigger");
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      trigger.style.setProperty("--gx", `${e.clientX - rect.left}px`);
      trigger.style.setProperty("--gy", `${e.clientY - rect.top}px`);
    });
  }

  /* ---------- Lightbox + Zwei-Klick-Embed ---------- */

  const lightbox = $("#lightbox");
  const lbPlayer = $("#lightbox-player");
  const lbTitel = $("#lightbox-titel");
  const lbAwardSlot = $("#lightbox-award-slot");
  const lbMeta = $("#lightbox-meta");
  const lbBesch = $("#lightbox-besch");
  const lbCredits = $("#lightbox-credits");
  const lbSchliessenBtn = $("#lightbox-schliessen");
  let zuletztFokussiert = null;

  // Akzeptiert reine IDs sowie alle gängigen Link-Formate
  // (youtu.be/…, watch?v=…, shorts/…, embed/…, live/…)
  function youtubeIdExtrahieren(wert) {
    if (!wert) return "";
    const w = String(wert).trim();
    if (!/[/.]/.test(w)) return w;
    const m = w.match(/(?:youtu\.be\/|shorts\/|watch\?v=|embed\/|live\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : "";
  }

  function playerRendern(p) {
    const thumb = `<img class="player-thumb" src="${esc(p.thumb)}" alt="" aria-hidden="true">`;
    const youtubeId = youtubeIdExtrahieren(p.youtubeId);

    if (!youtubeId) {
      lbPlayer.innerHTML = `
        ${thumb}
        <div class="player-folgt">
          <span class="mono">Video folgt</span>
          <p>Der Link zu diesem Projekt wird gerade nachgereicht.</p>
        </div>`;
      return;
    }

    lbPlayer.innerHTML = `
      ${thumb}
      <div class="player-consent">
        <span class="mono">Externes Video</span>
        <p class="hinweis">Das Video wird von YouTube geladen. Erst mit Klick auf „Video laden“ werden Daten an Google übertragen — Details in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
        <button class="btn btn-voll" data-youtube="${esc(youtubeId)}" data-titel="${esc(p.titel)}">▶ Video laden</button>
      </div>`;
  }

  lbPlayer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-youtube]");
    if (!btn) return;
    const id = btn.dataset.youtube;
    const titel = btn.dataset.titel;
    lbPlayer.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0"
        title="YouTube-Video: ${esc(titel)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>`;
  });

  function lightboxOeffnen(p, opener) {
    zuletztFokussiert = opener || document.activeElement;

    playerRendern(p);
    lbTitel.textContent = p.titel;
    lbAwardSlot.innerHTML = p.award
      ? `<span class="lightbox-award">★ ${esc(p.award)}</span>`
      : "";
    lbMeta.innerHTML = [p.jahr, KATEGORIEN[p.kategorie], p.ort, p.kunde]
      .filter(Boolean)
      .map((teil) => `<span>${esc(teil)}</span>`)
      .join("");
    lbBesch.textContent = p.beschreibung;
    lbCredits.innerHTML = [
      ["Rolle", p.rolle],
      ["Equipment", p.equipment],
      ["Software", p.software],
    ]
      .filter(([, wert]) => Boolean(wert))
      .map(([label, wert]) => `<div><dt>${label}</dt><dd>${esc(wert)}</dd></div>`)
      .join("");

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.scrollTop = 0;
    lbSchliessenBtn.focus();
  }

  function lightboxSchliessen() {
    lightbox.hidden = true;
    lbPlayer.innerHTML = ""; // stoppt laufende YouTube-Wiedergabe
    document.body.style.overflow = "";
    if (zuletztFokussiert) zuletztFokussiert.focus();
  }

  lbSchliessenBtn.addEventListener("click", lightboxSchliessen);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightboxSchliessen();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") {
      lightboxSchliessen();
      return;
    }
    if (e.key === "Tab") {
      // Fokus in der Lightbox halten
      const fokussierbar = lightbox.querySelectorAll(
        'button, a[href], iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (!fokussierbar.length) return;
      const erstes = fokussierbar[0];
      const letztes = fokussierbar[fokussierbar.length - 1];
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    }
  });

  /* ---------- Fokus-Reticle (Cursor) ----------
     Kamera-Autofokus-Ästhetik: vier Eck-Klammern folgen dem Zeiger und ziehen
     sich beim Hover über klickbare Elemente enger zusammen ("Fokus verriegelt").
     Nur auf echten Maus-Geräten aktiv (hover:hover + pointer:fine) und nie bei
     reduzierter Bewegung — html.reticle-aktiv/.reticle.ist-aktiv werden
     ausschließlich hier per JS gesetzt, nie pur per CSS, damit Seiten ohne
     main.js (impressum.html, datenschutz.html) automatisch unangetastet
     bleiben. */

  const feinerZeiger = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reticle = $("#reticle");

  if (reticle) {
    let reticleAktiv = false;
    const KLICKBAR = "a, button, [role='button'], input, select, textarea, label";
    // Flächen, die neon-gelb gefüllt sind (oder es im Hover werden, wie
    // .btn-linie): darüber flippt das gelbe Reticle per .ist-negativ auf
    // Schwarz, sonst wäre es unsichtbar. Bei neuen Gelb-Flächen ergänzen.
    const GELB_FLAECHEN =
      ".btn-voll, .btn-linie, .eyebrow, .kennzahlen-karte, .filter-btn[aria-pressed='true'], .karte-play, .hero-nachname";

    function reticleAktivierungPruefen() {
      reticleAktiv = feinerZeiger.matches && !reduzierteBewegung.matches;
      document.documentElement.classList.toggle("reticle-aktiv", reticleAktiv);
      reticle.classList.toggle("ist-aktiv", reticleAktiv);
    }

    reticleAktivierungPruefen();
    feinerZeiger.addEventListener("change", reticleAktivierungPruefen);
    reduzierteBewegung.addEventListener("change", reticleAktivierungPruefen);

    // Kein rAF-Batching: schreibt nur einen Transform ohne Layout-Read (anders
    // als Ruler/3D-Stack), rAF würde hier nur eine Frame Latenz addieren.
    // Der Negativ-Toggle läuft bewusst hier statt in pointerover: so stimmt
    // die Farbe auch, wenn eine Fläche unter dem stehenden Cursor gelb WIRD
    // (z. B. Filter-Klick), spätestens bei der nächsten Mikro-Bewegung.
    document.addEventListener("pointermove", (e) => {
      if (!reticleAktiv) return;
      reticle.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const ziel = e.target instanceof Element ? e.target : null;
      reticle.classList.toggle("ist-negativ", Boolean(ziel && ziel.closest(GELB_FLAECHEN)));
    });

    document.addEventListener("pointerover", (e) => {
      if (!reticleAktiv) return;
      if (e.target.closest(KLICKBAR)) reticle.classList.add("ist-hover");
    });

    document.addEventListener("pointerout", (e) => {
      if (!reticleAktiv) return;
      if (!e.target.closest(KLICKBAR)) return;
      const naechstes = e.relatedTarget;
      if (naechstes && naechstes.closest && naechstes.closest(KLICKBAR)) return;
      reticle.classList.remove("ist-hover");
    });

    document.addEventListener("pointerdown", () => {
      if (!reticleAktiv) return;
      reticle.classList.add("ist-klick");
    });

    document.addEventListener("pointerup", () => {
      reticle.classList.remove("ist-klick");
    });

    // lbPlayer ist von Seitenlade an im DOM (nur die Lightbox selbst ist
    // hidden) — funktioniert unabhängig davon, ob/wann das YouTube-iframe
    // später hineingerendert wird.
    lbPlayer.addEventListener("mouseenter", () => {
      if (!reticleAktiv) return;
      reticle.classList.add("ist-versteckt");
    });

    lbPlayer.addEventListener("mouseleave", () => {
      reticle.classList.remove("ist-versteckt");
    });

    // Härtung: Reticle nicht sichtbar hängen lassen, wenn die Maus den
    // Browser komplett verlässt.
    document.documentElement.addEventListener("mouseleave", () => {
      reticle.classList.add("ist-versteckt");
    });

    document.documentElement.addEventListener("mouseenter", () => {
      reticle.classList.remove("ist-versteckt");
    });
  }

  /* ---------- Hero: Dither-Porträt ----------
     Das Porträt wird in Zellen von 6px gerastert und per Bayer-Dithering
     auf 4 Graustufen + Leer quantisiert — die dunkelste Stufe wird nicht
     gezeichnet, das Bild materialisiert sich also direkt aus dem
     Seiten-Schwarz. Beim ersten Laden baut sich das Raster einmal in
     Bayer-Reihenfolge auf ("Signal rastet ein"). Beim Hover öffnet sich
     unterm Cursor eine Fokus-Linse: Dort rastet das Bild in die doppelt
     so feine Teilung ein — ein Autofokus, der Schärfe zieht, passend
     zum Reticle-Cursor der Seite. Läuft nur auf Maus-Geräten und nie
     bei reduzierter Bewegung; ohne Interaktion läuft kein rAF-Loop. */

  const BAYER8 = [
     0, 32,  8, 40,  2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44,  4, 36, 14, 46,  6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
     3, 35, 11, 43,  1, 33,  9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47,  7, 39, 13, 45,  5, 37,
    63, 31, 55, 23, 61, 29, 53, 21,
  ];

  function heroDitherEinrichten() {
    const canvas = $("#hero-dither");
    const hero = $("#hero");
    if (!canvas || !hero || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");

    const ZELLE = 6;                  // Rasterschritt in px (Quadrat 5px + 1px Fuge)
    const FEIN_ZELLE = 3;             // Raster in der Fokus-Linse: halbe Teilung = "scharf"
    const GRAU = ["#222226", "#4a4a50", "#87878d", "#e4e4de"];
    const FOKUS_Y = 0.38;             // Crop-Anker: hält die Augenpartie im Bild
    const REVEAL_MS = 900;
    const LINSE_RADIUS = 130;         // Radius des Fokusfelds (px)
    const LINSE_HALBWERT_MS = 140;    // Öffnen/Schließen der Linse (Halbwertszeit)
    const NACHLAUF_HALBWERT_MS = 90;  // Linse zieht dem Cursor leicht hinterher (AF-Motor)

    const bild = new Image();
    const statisch = document.createElement("canvas");   // Grobraster (Ruhezustand)
    const sctx = statisch.getContext("2d");
    const scharf = document.createElement("canvas");     // Feinraster (Inhalt der Linse)
    const schctx = scharf.getContext("2d");

    let cols = 0;
    let rows = 0;
    let basis = null;                 // Uint8Array: Tonstufe 0..4 je Grobzelle
    let enthuellt = false;
    let revealStart = 0;
    let loopLaeuft = false;
    let mx = 0;                       // Mausziel in Canvas-Koordinaten
    let my = 0;
    let linseX = 0;                   // Ist-Position der Linse (zieht dem Ziel nach)
    let linseY = 0;
    let linse = 0;                    // Ist-Präsenz der Linse 0..1 (skaliert den Radius)
    let linseZiel = 0;
    let letzterTick = 0;              // rAF-Zeitstempel des letzten Animations-Ticks

    function rasterZeichnen(ziel, toene, spalten, zellPx, filter) {
      for (let stufe = 1; stufe <= 4; stufe += 1) {
        ziel.fillStyle = GRAU[stufe - 1];
        for (let i = 0; i < toene.length; i += 1) {
          if (toene[i] !== stufe) continue;
          if (filter && !filter(i)) continue;
          ziel.fillRect((i % spalten) * zellPx, Math.floor(i / spalten) * zellPx, zellPx - 1, zellPx - 1);
        }
      }
    }

    // Foto "cover"-beschnitten in gegebener Zellauflösung abtasten und per
    // Bayer-Matrix auf 4 Graustufen + Leer quantisieren. Wirft bei file://
    // (tainted canvas) — der Aufrufer fängt das ab.
    function rasterAbtasten(zellPx, sx, sy, sw, sh, w, h) {
      const spalten = Math.ceil(w / zellPx);
      const zeilen = Math.ceil(h / zellPx);
      const tmp = document.createElement("canvas");
      tmp.width = spalten;
      tmp.height = zeilen;
      const tctx = tmp.getContext("2d");
      tctx.drawImage(bild, sx, sy, sw, sh, 0, 0, spalten, zeilen);
      const px = tctx.getImageData(0, 0, spalten, zeilen).data;
      // Untere Kante: Tonwerte laufen über die letzten ~150px gegen Null,
      // das Bild zerfällt ins Raster statt hart am Fold zu enden — und die
      // Fakten-Zeile bleibt über der hellen Shirt-Partie lesbar.
      const zerfall = Math.max(1, Math.round(150 / zellPx));
      const toene = new Uint8Array(spalten * zeilen);
      for (let i = 0; i < toene.length; i += 1) {
        // s/w-Aufnahme: ein Kanal genügt. Tonwerte spreizen, weil das
        // Low-Key-Porträt sonst fast komplett in Stufe 0 abtaucht.
        let t = Math.min(1, Math.max(0, (px[i * 4] - 14) / 194));
        const restZeilen = zeilen - 1 - Math.floor(i / spalten);
        if (restZeilen < zerfall) t *= 0.08 + 0.92 * (restZeilen / zerfall);
        const b = BAYER8[(Math.floor(i / spalten) % 8) * 8 + ((i % spalten) % 8)] / 64;
        toene[i] = Math.min(4, Math.floor(t * 4 + b));
      }
      return { toene, spalten, zeilen };
    }

    function aufbauen() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!bild.naturalWidth || w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;

      // Cover-Crop einmal berechnen — Grob- und Feinraster tasten exakt
      // denselben Ausschnitt ab und liegen dadurch deckungsgleich.
      const scale = Math.max(w / bild.naturalWidth, h / bild.naturalHeight);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (bild.naturalWidth - sw) / 2;
      const sy = (bild.naturalHeight - sh) * FOKUS_Y;

      let feinRaster;
      try {
        const grobRaster = rasterAbtasten(ZELLE, sx, sy, sw, sh, w, h);
        basis = grobRaster.toene;
        cols = grobRaster.spalten;
        rows = grobRaster.zeilen;
        feinRaster = rasterAbtasten(FEIN_ZELLE, sx, sy, sw, sh, w, h);
      } catch (fehler) {
        // Direkt geöffnete Datei (file://): Browser stufen das lokale Foto
        // als fremde Quelle ein (tainted canvas) und blockieren getImageData.
        // Fallback: Porträt wenigstens ungerastert zeigen. basis bleibt null,
        // dadurch greifen alle Guards (kein Reveal, keine Fokus-Linse).
        // Der echte Dither-Look braucht http(s) — „Vorschau starten.command".
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(bild, sx, sy, sw, sh, 0, 0, w, h);
        console.warn("Dither-Porträt: Bilddaten unter file:// nicht lesbar — bitte über einen lokalen Server öffnen (Doppelklick auf „Vorschau starten.command“).", fehler);
        return;
      }

      statisch.width = w;
      statisch.height = h;
      sctx.clearRect(0, 0, w, h);
      rasterZeichnen(sctx, basis, cols, ZELLE, null);

      scharf.width = w;
      scharf.height = h;
      schctx.clearRect(0, 0, w, h);
      rasterZeichnen(schctx, feinRaster.toene, feinRaster.spalten, FEIN_ZELLE, null);

      if (!enthuellt) {
        enthuellt = true;
        if (!reduzierteBewegung.matches) revealStart = performance.now();
      }
      if (revealStart > 0) {
        loopAnfordern();
      } else {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(statisch, 0, 0);
      }
    }

    function tick(now) {
      loopLaeuft = false;
      if (!basis) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (revealStart > 0) {
        // Aufbau in Bayer-Reihenfolge: wirkt wie ein einrastendes Signal
        const p = Math.min(1, (now - revealStart) / REVEAL_MS);
        rasterZeichnen(ctx, basis, cols, ZELLE, (i) =>
          BAYER8[(Math.floor(i / cols) % 8) * 8 + ((i % cols) % 8)] / 64 <= p
        );
        if (p >= 1) revealStart = 0;
      } else {
        // Linse zeitbasiert nachziehen — gleiches Tempo auf 60 wie 120 Hz;
        // dt ist gedeckelt, damit Render-Pausen keine Sprünge verursachen.
        const dt = letzterTick > 0 ? Math.min(50, now - letzterTick) : 17;
        letzterTick = now;
        const oeffnen = 1 - Math.pow(0.5, dt / LINSE_HALBWERT_MS);
        const nachlauf = 1 - Math.pow(0.5, dt / NACHLAUF_HALBWERT_MS);
        linse += (linseZiel - linse) * oeffnen;
        if (Math.abs(linseZiel - linse) < 0.01) linse = linseZiel;
        linseX += (mx - linseX) * nachlauf;
        linseY += (my - linseY) * nachlauf;
        if (Math.abs(mx - linseX) < 0.5 && Math.abs(my - linseY) < 0.5) {
          linseX = mx;
          linseY = my;
        }

        ctx.drawImage(statisch, 0, 0);

        if (linse > 0) {
          // Fokusfeld: Grobzellen im Radius zeigen stattdessen das Feinraster.
          // Die Maske rastet bewusst aufs 6px-Raster (blockiger Kreis) —
          // harte Kanten statt weicher Vignette, passend zum Rest der Seite.
          const r = LINSE_RADIUS * linse;
          const x0 = Math.max(0, Math.floor((linseX - r) / ZELLE));
          const x1 = Math.min(cols - 1, Math.ceil((linseX + r) / ZELLE));
          const y0 = Math.max(0, Math.floor((linseY - r) / ZELLE));
          const y1 = Math.min(rows - 1, Math.ceil((linseY + r) / ZELLE));
          ctx.save();
          ctx.beginPath();
          for (let y = y0; y <= y1; y += 1) {
            for (let x = x0; x <= x1; x += 1) {
              const d = Math.hypot(x * ZELLE + ZELLE / 2 - linseX, y * ZELLE + ZELLE / 2 - linseY);
              if (d > r) continue;
              ctx.rect(x * ZELLE, y * ZELLE, ZELLE, ZELLE);
            }
          }
          ctx.clip();
          // clearRect, damit in Fugen und Stufe-0-Zellen das Seiten-Schwarz
          // durchscheint statt des darunterliegenden Grobrasters
          ctx.clearRect(x0 * ZELLE, y0 * ZELLE, (x1 - x0 + 1) * ZELLE, (y1 - y0 + 1) * ZELLE);
          ctx.drawImage(scharf, 0, 0);
          ctx.restore();
        }
      }

      const linseInBewegung =
        linse !== linseZiel || (linse > 0 && (linseX !== mx || linseY !== my));
      if (revealStart > 0 || linseInBewegung) loopAnfordern();
    }

    function loopAnfordern() {
      if (loopLaeuft) return;
      loopLaeuft = true;
      requestAnimationFrame(tick);
    }

    // Die Linse folgt dem Cursor; ist sie eingeschwungen und die Maus ruht,
    // bleibt der letzte Frame stehen und der rAF-Loop endet von selbst.
    hero.addEventListener("pointermove", (e) => {
      if (!feinerZeiger.matches || reduzierteBewegung.matches || !basis) return;
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (linse === 0) {
        // Erster Kontakt: Linse direkt unterm Cursor öffnen, kein Anflug
        linseX = mx;
        linseY = my;
      }
      linseZiel = 1;
      loopAnfordern();
    });

    hero.addEventListener("pointerleave", () => {
      // Linse irisiert zu; der Loop läuft nur noch bis zum Abklingen
      linseZiel = 0;
      loopAnfordern();
    });

    // Rebuild bei Größenänderung (debounced). Läuft ein Reveal, übersteht
    // er den Rebuild, weil er rein zeitbasiert ist — kein hartes Umspringen.
    let resizeTimer = 0;
    const groessePruefen = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(aufbauen, 160);
    };
    if ("ResizeObserver" in window) {
      new ResizeObserver(groessePruefen).observe(canvas);
    } else {
      window.addEventListener("resize", groessePruefen);
    }

    bild.decoding = "async";
    bild.onload = aufbauen;
    bild.src = "assets/img/felix-remmen-hero.jpg";
  }

  /* ---------- Hero: Buchstaben-Hover der Wortmarke ----------
     Beide Namenszeilen werden in Einzel-Spans zerlegt; in Mausnähe
     tauschen die Buchstaben ihr Gewicht (Vorname 500→900, Nachname
     900→500), mit Distanz-Falloff über die Nachbarn — stufenlos über
     die Archivo-Variable-Font, die CSS-Transition glättet die Welle.
     Nur auf Maus-Geräten und nie bei reduzierter Bewegung; ohne JS
     (oder auf Touch) bleibt die Wortmarke unzerlegt stehen. */

  function heroWortmarkeEinrichten() {
    const name = $(".hero-name");
    if (!name || !feinerZeiger.matches || reduzierteBewegung.matches) return;
    const zeilen = Array.from(name.querySelectorAll(".hero-vorname, .hero-nachname"));
    if (!zeilen.length) return;

    // Screenreader lesen weiter den ganzen Namen, nicht 13 Einzel-Spans
    name.setAttribute("aria-label", zeilen.map((z) => z.textContent.trim()).join(" "));

    const buchstaben = [];
    zeilen.forEach((zeile) => {
      const grund = zeile.classList.contains("hero-nachname") ? 900 : 500;
      const ziel = grund === 900 ? 500 : 900;
      const text = zeile.textContent;
      zeile.textContent = "";
      zeile.setAttribute("aria-hidden", "true");
      for (const zeichen of text) {
        const span = document.createElement("span");
        span.className = "hero-buchstabe";
        span.textContent = zeichen;
        zeile.appendChild(span);
        buchstaben.push({ el: span, grund, ziel });
      }
    });

    const RADIUS_MIN = 150;           // horizontaler Mindest-Wirkradius (px)
    let px = 0;
    let py = 0;
    let letzterLauf = 0;

    function anwenden() {
      // Erst ALLE Positionen lesen, dann ALLE Gewichte schreiben —
      // sonst zwingt jedes Gewicht ein neues Layout fürs nächste Rect.
      const rects = buchstaben.map((b) => b.el.getBoundingClientRect());
      buchstaben.forEach((b, i) => {
        const r = rects[i];
        let f = 0;
        // Nur die Zeile, über der die Maus wirklich steht (±24px Toleranz),
        // sonst würde ein Hover auf FELIX auch REMMEN. darunter erfassen.
        if (py >= r.top - 24 && py <= r.bottom + 24) {
          // Radius wächst mit der Schriftgröße (rect.height ≈ Zeilenhöhe),
          // sonst erfasst die Welle beim riesigen Nachnamen nur einen
          // einzigen Buchstaben statt der Nachbarn.
          const radius = Math.max(RADIUS_MIN, r.height * 1.35);
          const dx = Math.abs(px - (r.left + r.width / 2));
          if (dx < radius) f = Math.pow(1 - dx / radius, 1.7);
        }
        b.el.style.fontWeight = f > 0.02 ? String(Math.round(b.grund + (b.ziel - b.grund) * f)) : "";
      });
    }

    // Zeit- statt rAF-Drosselung: gleiche Rate (~60/s), aber ohne offenen
    // rAF-Zustand — der bliebe in unsichtbaren Tabs hängen. Der maximal
    // 16ms alte Sample-Fehler wird von der CSS-Transition geschluckt.
    name.addEventListener("pointermove", (e) => {
      px = e.clientX;
      py = e.clientY;
      const jetzt = performance.now();
      if (jetzt - letzterLauf < 16) return;
      letzterLauf = jetzt;
      anwenden();
    });

    name.addEventListener("pointerleave", () => {
      buchstaben.forEach((b) => {
        b.el.style.fontWeight = "";
      });
    });
  }

  /* ---------- Scroll-Reveals ---------- */

  function revealsEinrichten() {
    const elemente = document.querySelectorAll(".reveal");
    if (!elemente.length) return;
    if (!("IntersectionObserver" in window)) {
      elemente.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((eintrag) => {
          if (eintrag.isIntersecting) {
            eintrag.target.classList.add("in");
            io.unobserve(eintrag.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    elemente.forEach((el) => io.observe(el));

    // Sicherheitsnetz: In manchen Browser-Kontexten (z. B. Tabs ohne Fokus)
    // feuert IntersectionObserver nicht zuverlässig, Inhalte blieben sonst
    // dauerhaft unsichtbar. Bereits im Viewport stehende Elemente daher nach
    // kurzer Zeit notfalls direkt einblenden.
    setTimeout(() => {
      elemente.forEach((el) => {
        if (!el.classList.contains("in") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("in");
        }
      });
    }, 1200);
  }

  /* ---------- Arbeitsweise: Punkt läuft die Prozess-Linie entlang ----------
     Scroll-Fortschritt durch .prozess-timeline treibt Füllung + Punkt-
     Position (gleiche rAF-Drossel wie rulerUpdate). Jede Station blendet
     ein, sobald der Punkt sie erreicht, und bleibt danach sichtbar. */

  const prozessTimeline = $("#prozess-timeline");
  const prozessFortschritt = $(".prozess-fortschritt");
  const prozessPunkt = $(".prozess-punkt");
  const prozessSchritte = Array.from(document.querySelectorAll(".prozess-schritt"));

  function prozessAktualisieren() {
    if (!prozessTimeline || !prozessFortschritt || !prozessPunkt) return;

    if (reduzierteBewegung.matches) {
      prozessFortschritt.style.height = "100%";
      prozessPunkt.style.top = "100%";
      prozessSchritte.forEach((el) => el.classList.add("ist-aktiv"));
      return;
    }

    const rect = prozessTimeline.getBoundingClientRect();
    if (rect.height <= 0) return;
    // Punkt orientiert sich an der Bildschirmmitte: 0, sobald die Timeline von
    // unten dort eintrifft, 1, sobald sie oben darüber hinausgescrollt ist.
    const ziel = window.innerHeight * 0.5;
    const fortschritt = Math.min(1, Math.max(0, (ziel - rect.top) / rect.height));
    const dotY = fortschritt * rect.height;

    prozessFortschritt.style.height = `${dotY}px`;
    prozessPunkt.style.top = `${dotY}px`;

    prozessSchritte.forEach((el) => {
      if (el.classList.contains("ist-aktiv")) return;
      const mitte = el.offsetTop + el.offsetHeight / 2;
      if (dotY >= mitte) el.classList.add("ist-aktiv");
    });
  }

  /* ---------- Aktiver Nav-Link ---------- */

  const navLinks = Array.from(document.querySelectorAll(".hauptnav a"));
  const navZiele = navLinks
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  function navAktivUpdate() {
    const marke = window.scrollY + window.innerHeight * 0.35;
    let aktuell = null;
    navZiele.forEach((sektion) => {
      if (sektion.offsetTop <= marke) aktuell = sektion.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("aktiv", a.getAttribute("href") === `#${aktuell}`);
    });
  }

  /* ---------- Mobile-Menü ---------- */

  const menuBtn = $("#menu-btn");
  const mobilnav = $("#mobilnav");

  function menuSetzen(offen) {
    document.body.classList.toggle("menu-offen", offen);
    menuBtn.setAttribute("aria-expanded", String(offen));
    menuBtn.setAttribute("aria-label", offen ? "Menü schließen" : "Menü öffnen");
  }

  menuBtn.addEventListener("click", () => {
    menuSetzen(!document.body.classList.contains("menu-offen"));
  });

  mobilnav.addEventListener("click", (e) => {
    if (e.target.closest("a")) menuSetzen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) menuSetzen(false);
  });

  /* ---------- Start ---------- */

  gridRendern();
  revealsEinrichten();
  heroDitherEinrichten();
  heroWortmarkeEinrichten();
  rulerUpdate();
})();
