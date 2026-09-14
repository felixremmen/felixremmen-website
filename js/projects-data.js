/*
 * Zentrale Projektliste — einzige Datei, die du für neue Arbeiten pflegen musst.
 *
 * youtubeId: einfach den YouTube-Link einfügen — alle Formate funktionieren:
 *            https://youtu.be/…, https://youtube.com/watch?v=…, Shorts-Links oder die reine ID.
 *            Leer lassen ("") solange kein Video verlinkt ist — die Seite zeigt dann "Video folgt".
 * thumb:     Pfad zum Vorschaubild (16:9). Aktuell die YouTube-Thumbnails (lokal gespeichert).
 *            Für eigene Filmstills: Datei in assets/img/ ersetzen oder Pfad hier anpassen.
 * kategorie: "imagefilm" | "werbefilm" | "social" | "kurzfilm" | "ai"
 *
 * Optionale Felder:
 * workflow:      Arbeitsweise/Pipeline — steht im Modal zwischen Rolle und Software.
 * softwareLabel: Überschrift der Software-Spalte, falls "Software" nicht passt
 *                (z. B. "Software / AI Tools"). Default: "Software".
 * sheets:        Referenzbilder für den Block unter den Projektinfos:
 *                { titel, bild, text, breit }.
 *                breit: true → Bild läuft auf Desktop über die volle Breite.
 * sheetsTitel:   Überschrift dieses Blocks, falls „Development / Reference
 *                Sheets" nicht passt (z. B. „Storyboard / Previsualization").
 */

const KATEGORIEN = {
  imagefilm: "Werbevideos",
  werbefilm: "Werbefilm",
  social: "Social Media",
  kurzfilm: "Kurzfilm",
  ai: "Generative AI",
};

const PROJEKTE = [
  {
    id: "rotten-angel-tattoo",
    titel: "Rotten Angel Tattoo",
    kategorie: "imagefilm",
    jahr: 2026,
    ort: "Wuppertal",
    kunde: "Rotten Angel Tattoo",
    rolle: "Kamera, Schnitt, Postproduktion, Animation, Sounddesign",
    beschreibung:
      "Imagefilm für ein Tattoo-Studio: cleane Bildsprache, detailreiche Aufnahmen und präzises Sounddesign zeigen hygienische Abläufe und handwerkliche Qualität. Tattoo-Cinematografie lebt von Präzision, Atmosphäre und Vertrauen.",
    equipment: "Blackmagic Pocket Cinema 6K",
    software: "Adobe Premiere Pro, After Effects",
    youtubeId: "https://youtu.be/9XEMB-nS2Qg",
    thumb: "assets/img/rotten-angel-tattoo.jpg",
  },
  {
    id: "blossomwork",
    titel: "Blossomwork",
    kategorie: "imagefilm",
    jahr: 2026,
    ort: "Böblingen",
    kunde: "Blossomworks",
    rolle: "Kamera, Schnitt, Sounddesign, Animation",
    beschreibung:
      "Industrie-Cinematografie für Blossomworks: die Herstellung von Spezialbauteilen, erzählt über detailreiche Nahaufnahmen und dynamische Kamerabewegungen. Ziel war, technische Präzision und handwerkliche Prozesse ästhetisch erlebbar zu machen.",
    equipment: "Blackmagic Pocket Cinema 6K",
    software: "Adobe Premiere Pro, After Effects",
    youtubeId: "https://youtu.be/pC5SkPwXZzk",
    thumb: "assets/img/blossomwork.jpg",
  },
  {
    id: "steinhof-sauna",
    titel: "Steinhof Sauna",
    kategorie: "social",
    jahr: 2026,
    ort: "Gärtringen",
    kunde: "Steinhof Sauna",
    rolle: "Konzept, Kamera, Schnitt",
    beschreibung:
      "Kurzes Social-Media-Reel zur neuen Saunalandschaft im Steinhof Fitnesscenter: eine KI-generierte Hook als Aufhänger, verwoben mit echten Aufnahmen der Räume — KI-Bilder und reale Aufnahmen kombiniert zu einem modernen Kurzformat.",
    equipment: "Blackmagic Pocket Cinema 6K, iPhone 15 Pro",
    software: "Adobe Premiere Pro, After Effects",
    youtubeId: "https://youtube.com/shorts/gacOGSQdC6U?feature=share",
    thumb: "assets/img/steinhof-sauna.jpg",
  },
  {
    id: "aposto-restaurant",
    titel: "Aposto Restaurant",
    kategorie: "social",
    jahr: 2026,
    ort: "Wuppertal",
    kunde: "Aposto Restaurant",
    rolle: "Konzeption, Kamera, Schnitt, Postproduktion, Sounddesign",
    beschreibung:
      "Social-Media-Content aus einer modernen Restaurantküche: schnelle Schnitte, präzise Kamerabewegungen und cleane Kompositionen verdichten die Zubereitung — Geschwindigkeit, Frische und Professionalität im zeitgemäßen Kurzformat.",
    equipment: "Blackmagic Pocket Cinema 6K",
    software: "Adobe Premiere Pro, After Effects",
    youtubeId: "https://youtube.com/shorts/VzReXujgjhk?feature=share",
    thumb: "assets/img/aposto-restaurant.jpg",
  },
  {
    id: "axe-ad",
    titel: "AXE Produkt Ad",
    kategorie: "social",
    jahr: 2026,
    ort: "Stuttgart",
    kunde: "Spec Work — eigenes Konzept",
    rolle: "Konzept, Kamera, Schnitt",
    beschreibung:
      "Eigenständiges Produktvideo in moderner Werbeästhetik: Makroaufnahmen, gezieltes Licht und sanfte Kamerabewegungen, montiert mit präzisem Schnitt und hochwertigem Sounddesign — orientiert an großen Kampagnen.",
    equipment: "iPhone 15 Pro",
    software: "Adobe After Effects, Nano Banana Pro, Kling 3.0",
    youtubeId: "https://youtube.com/shorts/abqrBHcak_c?feature=share",
    thumb: "assets/img/axe-ad.jpg",
  },
  {
    id: "oblatio",
    titel: "Oblatio",
    kategorie: "kurzfilm",
    jahr: 2025,
    ort: "Calw",
    kunde: "Eigenes Projekt",
    rolle: "Buch, Regie, Produktion, Kamera, Schnitt, Sounddesign",
    beschreibung:
      "Ein psychologischer Horror-Kurzfilm über einen Wanderer, der sich im Wald verirrt. Isolation, Orientierungslosigkeit und eine düstere Atmosphäre, erzählt in cineastischer Bildsprache mit gezieltem Sounddesign und bewusst gesetzter Stille.",
    equipment: "iPhone 15 Pro",
    software: "Adobe Premiere Pro, After Effects, Photoshop",
    award: "Nominiert — Baden-Württembergischer Publikumsfilmpreis 2025",
    youtubeId: "https://youtu.be/way3XK4F_vM",
    thumb: "assets/img/oblatio.jpg",
  },
  {
    id: "signal",
    titel: "Signal",
    kategorie: "kurzfilm",
    jahr: 2026,
    ort: "Nufringen",
    kunde: "Eigenes Projekt",
    rolle: "Buch, Regie, Kamera, Postproduktion, Sounddesign, Color Grading, Animation",
    beschreibung:
      "Ein atmosphärischer Science-Fiction-Horror über eine rätselhafte außerirdische Botschaft. Eigens entwickeltes Sounddesign, intensive Klangflächen und gezielte Stille treffen auf düstere Farbwelten und subtile Animationen.",
    equipment: "Blackmagic Pocket Cinema 6K",
    software: "Adobe Premiere Pro, After Effects, Photoshop",
    youtubeId: "https://youtu.be/-7dlFblGMNU",
    thumb: "assets/img/signal.jpg",
  },
  {
    id: "icebound",
    titel: "ICEBOUND",
    kategorie: "ai",
    jahr: 2026,
    ort: "Gärtringen",
    rolle: "Konzept, AI Art Direction, Referenzgenerierung, Prompting, Animation, Editing, Sounddesign",
    beschreibung:
      "Ein cineastischer AI-Kurzfilm in einer extremen Eislandschaft. Um über unterschiedliche Einstellungen, Perspektiven und Sequenzen hinweg eine möglichst hohe visuelle Konsistenz zu gewährleisten, wurden für das Projekt eigene Character Sheets und Location Sheets entwickelt und als visuelle Referenzen verwendet. Das Projekt verbindet KI-generierte Bilder und Videos mit filmischer Bildgestaltung, Editing und Sounddesign und zeigt einen workfloworientierten Einsatz generativer KI innerhalb einer zusammenhängenden visuellen Erzählung.",
    workflow: "Character Sheets, Location Sheets, Image-to-Video, Text-to-Image",
    softwareLabel: "Software / AI Tools",
    software: "Nano Banana Pro, Seedance 2.0, Kling 3.0, Adobe Premiere Pro, After Effects",
    youtubeId: "https://youtu.be/t5Es5td5Ncs",
    thumb: "assets/img/icebound.jpg",
    sheets: [
      {
        titel: "Character Sheet — Bergsteiger",
        bild: "assets/img/Character Sheet – Bergsteiger.jpeg",
        text: "Visuelle Referenz zur konsistenten Darstellung der Hauptfigur über unterschiedliche Einstellungen und Perspektiven hinweg.",
      },
      {
        titel: "Character Sheet — Cyborg",
        bild: "assets/img/Character Sheet – Cyborg.jpeg",
        text: "Referenz zur Wahrung einer konsistenten Formensprache, Silhouette und Materialität des Cyborgs.",
      },
      {
        titel: "Location Sheet — Eislandschaft",
        bild: "assets/img/Location Sheet – Eislandschaft.jpeg",
        text: "Visuelle Referenz zur Definition der Umgebung und einer konsistenten Bildsprache der Eislandschaft.",
        breit: true,
      },
    ],
  },
  {
    id: "inside-the-mirror",
    titel: "INSIDE THE MIRROR",
    kategorie: "ai",
    jahr: 2026,
    rolle: "Konzept, Storyboarding, AI Art Direction, Prompting, Animation, Editing, Sounddesign",
    beschreibung:
      "Für die Entwicklung der Sequenz wurden zunächst mit GPT Image 2 vollständige Storyboard-Sheets erstellt, um Bildkomposition, Kameraperspektiven, Handlung und Timing der einzelnen Einstellungen visuell festzulegen. Die daraus entstandenen Storyboard-Frames wurden anschließend mit Seedance 2.0 animiert und zu einer zusammenhängenden filmischen Sequenz ausgearbeitet. Dieser Workflow eignet sich besonders gut, um eine Idee schnell zu visualisieren oder ein Konzept bereits vor der finalen Produktion in eine cineastische Sequenz zu übersetzen.",
    workflow: "AI Storyboarding, Text-to-Image, Image-to-Video, Shot Planning, Editing",
    softwareLabel: "Software / AI Tools",
    software: "GPT Image 2, Seedance 2.0, Adobe Premiere Pro, After Effects",
    youtubeId: "https://youtu.be/vM9FoaeVVas",
    thumb: "assets/img/inside-the-mirror.jpg",
    sheetsTitel: "Storyboard / Previsualization",
    sheets: [
      {
        titel: "Storyboard Sheet 1 — Die Abweichung",
        bild: "assets/img/storyboard-1.jpg",
        text: "Erste Phase der Previsualisierung: Aufbau der Location, Einführung der Figur und schrittweise Entwicklung der ersten Abweichung zwischen Realität und Spiegelbild.",
        breit: true,
      },
      {
        titel: "Storyboard Sheet 2 — Der Spiegel",
        bild: "assets/img/storyboard-2.jpg",
        text: "Zweite Phase der Previsualisierung: Eskalation der Handlung und visuelle Entwicklung der surrealen Interaktion zwischen Figur und Spiegel.",
        breit: true,
      },
    ],
  },
];
