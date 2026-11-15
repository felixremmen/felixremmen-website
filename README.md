# Felix Remmen — Portfolio

Persönliche Portfolio-Website von **Felix Remmen**, Videograf & Editor aus der Region Stuttgart. Statisch, dunkel-cinematisch, ohne Build-Schritt und ohne externe Abhängigkeiten.

**Live:** https://felixremmen.github.io/felixremmen-website/

## Aufbau

Reines HTML / CSS / Vanilla-JavaScript — kein Framework, kein Bundler, keine npm-Abhängigkeiten. Alle Schriften sind selbst gehostet (kein Google-Fonts-Request), YouTube-Videos laden erst nach aktivem Zwei-Klick-Consent über `youtube-nocookie.com` (DSGVO-freundlich).

```
index.html            Startseite (Hero, Projekte, Leistungen, Über mich, Kontakt)
impressum.html        Impressum
datenschutz.html      Datenschutzerklärung
css/style.css         Gesamtes Styling
js/
  projects-data.js    → Einzige Datei zum Pflegen der Projekte
  main.js             Interaktion: Grid, Filter, Lightbox, Timecode, Hero-Dither
assets/
  fonts/              Selbst gehostete Web-Fonts (.woff2)
  img/                Bilder & Thumbnails
  favicon.svg
```

## Projekte pflegen

Neue Projekte oder Änderungen ausschließlich in **`js/projects-data.js`** eintragen — die Reihenfolge im Array bestimmt die Anzeigereihenfolge, alles Weitere rendert `main.js` automatisch. Beim Feld `youtubeId` genügt der komplette YouTube-Link (auch Shorts) oder die reine Video-ID.

## Lokal ansehen

Die Seite über einen lokalen Server öffnen — **nicht** per Doppelklick auf `index.html`, da die YouTube-Embeds `file://` als Herkunft ablehnen:

```bash
python3 -m http.server 8000
# danach http://localhost:8000 im Browser öffnen
```

## Auf GitHub Pages veröffentlichen

Nach dem ersten Push: im GitHub-Repo unter **Settings → Pages** als Quelle **„Deploy from a branch"** auswählen, Branch **`main`**, Ordner **`/ (root)`**. Nach ein bis zwei Minuten ist die Seite unter `https://<dein-github-name>.github.io/<repo-name>/` erreichbar. Die leere Datei `.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert ausliefert (kein Jekyll-Build).
