/*
 * Zentrale Projektliste — einzige Datei, die du für neue Arbeiten pflegen musst.
 *
 * youtubeId: einfach den YouTube-Link einfügen — alle Formate funktionieren:
 *            https://youtu.be/…, https://youtube.com/watch?v=…, Shorts-Links oder die reine ID.
 *            Leer lassen ("") solange kein Video verlinkt ist — die Seite zeigt dann "Video folgt".
 * thumb:     Pfad zum Vorschaubild (16:9). Aktuell die YouTube-Thumbnails (lokal gespeichert).
 *            Für eigene Filmstills: Datei in assets/img/ ersetzen oder Pfad hier anpassen.
 * kategorie: "imagefilm" | "werbefilm" | "social" | "kurzfilm"
 */

const KATEGORIEN = {
  imagefilm: "Werbevideos",
  werbefilm: "Werbefilm",
  social: "Social Media",
  kurzfilm: "Kurzfilm",
};

const PROJEKTE = [
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
];
