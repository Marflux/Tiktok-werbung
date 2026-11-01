# TikTok-Affiliate-Videos: Arbeitsregeln für Claude

Mit Marflux auf **Deutsch** sprechen, einfach und ohne Fachjargon. Er schreibt per Spracheingabe (Tippfehler normal).
**Keine Tabellen** in Antworten oder Anleitungen (liest auf dem Handy). Lieber kurze Abschnitte mit fetten Überschriften.

## Wichtig

- **Nur in diesem Repo arbeiten** (`Marflux/Tiktok-werbung`). Das Repo `gptgenie_werbung` ist nur Referenz
  (Remotion-Aufbau, Stimme, Schnitt), dort nichts ändern oder committen. Anderer TikTok-Account als GPTGenie.
- Marflux redet nicht gern selbst (leichter Sprachfehler). Er filmt **stumm, nur Hände + Produkt, kein Gesicht**.
  Claude schreibt den Sprechtext, erzeugt die Stimme mit **ElevenLabs** (Marflux hat **Pro**, kommerzielle Nutzung
  erlaubt) und schneidet das Video.
- Komplett KI-generierte Videos: nein (Produkt muss echt gezeigt werden, TikTok-Shop-Regeln, Vertrauen).
- Beim Posten: „KI-generiert“ anhaken (KI-Stimme), „Werbung“/„Anzeige“ in den Text (Gratis-Muster).
- Keine erfundenen Versprechen im Sprechtext. Preise/Eigenschaften vorher mit Marflux klären.
- Kein Auto-Video (Marflux will nicht im Auto filmen).
- **Keine Haare filmen** (Marflux, ausdrücklich). Nur Hände + Dosen auf dem Tisch/der Decke.
- Song: keiner im Repo. Fassung ohne Musik liefern, Marflux legt in TikTok einen Trend-Sound leise drunter (oder schickt einen Song).
- Der ElevenLabs-Schlüssel in der Umgebung ist ein **Starter**-Konto (nicht Pro): kommerziell erlaubt, aber nur
  `mp3_44100_128` (192 kbps braucht Creator).

## Produkt 1: Red One Aqua Hair Wax Red (Full Force)

- Zwei Angebote im TikTok Shop: **3er-Pack** und **6er-Pack**. Marflux hat Muster (9 Dosen). Preise: noch offen.
- Wasserbasis (geht mit Wasser raus), roter Gel-Wachs, glänzend, starker Halt (Full Force).
- „Red One“ ist englisch: im Sprechtext so schreiben, dass die Stimme nicht in englischen Akzent rutscht.

## Vorbilder (von Marflux geschickt, nicht im Repo)

- **@selectdfinds** (44 s): Text oben „Mein Barbar zieht mich ab“, erstes Bild Löffel im roten Gel (ASMR), dann viele
  Dosen auf weißer Felldecke, Hand dreht/öffnet/stapelt sie, Stimme drüber, Endkarte. Kein Gesicht, keine Haare.
- **@sedindeals** (~22 s): Beifahrersitz im Auto, Autobahn draußen, Hand dreht eine Dose die ganze Zeit, viele Dosen
  im Ablagefach, kein Text, Stimme drüber. Kein Öffnen.
- Gemeinsam: nur Hand + Dose, schöner Hintergrund, ständige Bewegung, viele Dosen auf einmal.
- Marflux will **keinen Löffel** ins Gel stecken.

## Erfahrung vom GPTGenie-Account (übertragbar)

- Hits waren 15–23 s lang, längere Videos floppten. Ziel hier: **15–18 s**.
- Die meisten springen bei 0:01 ab: Bild 0 + erster Satz entscheiden. Bewegung und Ton ab dem ersten Bild.
- Hook = neue, konkrete Situation oder klarer Vorteil (Zahl, Preis), nicht werbig.
- Untertitel Wort für Wort, große Schrift. TikTok-sichere Bereiche: oben ~8 %, unten ~20 %, rechts unten frei lassen.
- Titelbild immer auf den Einstieg setzen.
- Bewährte Stimme: ElevenLabs-Bibliotheksstimme „Simon“ (`K5ZVtkkBnuPY6YqXs70E`, jung, deutsch, locker).

## Befehle

```bash
npm install
node voice.mjs [video] [--force|--reuse]   # Stimme (eine Aufnahme) -> public/voice/<video>.mp3 + src/<video>/voice.json
npx remotion render src/index.ts RedOne renders/RedOne_Barber.mp4 --concurrency=4 --crf=18
npx remotion render src/index.ts RedOne tools-cache/preview.mp4 --scale=0.5   # schnelle Vorschau
npx remotion studio
```

## Aufbau

- `src/<video>/script.mjs`: Sprechtext, eine Zeile = ein Schnitt (Clip + Startsekunde + Tempo), Text oben, gelbe Wörter.
  Schnitte liegen automatisch auf dem ersten Wort jeder Zeile.
- `src/<video>/Video.tsx`: Schnitt, Einschub-Zoom pro Schnitt, Text oben (ab Bild 0 sichtbar), Untertitel, Endkarte, Whoosh.
- `src/kit.tsx`: Schrift (Plus Jakarta Sans), TikTok-Untertitel (Wort für Wort, max ~26 Zeichen pro Pille).
- `public/clips/c1..c6.mp4`: Marflux' Aufnahmen (Hochformat, verkleinert). Originale nicht im Repo (`clips/` ignoriert).
- Chrome: `/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/` (`remotion.config.ts`).

## Clips vom 01.11. (blaue Decke, ~12 Dosen)

- c1: Dose aufdrehen (1–3 s), glänzendes Gel (3–9 s), Reihe vieler Dosen (9,5–11 s)
- c2: Dose drehen, Logo und Seite „AQUA HAIR WAX FULL FORCE“ (0–9 s)
- c3: Reihe von 12 Dosen, Turm bauen (2–9 s, im Zeitraffer gut), links 6er-Turm + rechts 3er-Turm, Finger zeigt auf 6 (21,5 s) und 3 (23 s)
- c4: drei Dosen im Dreieck, Finger tippt sie an (0,4–3 s)
- c5: Hände wuseln durch viele Dosen (unruhig, bisher nicht benutzt)
- c6: Finger ins Gel, Gel-Klumpen am Finger (scharf ab 17,3 s), Klumpen nah an der Kamera (25,5–27 s, unscharf aber stark)

## Videos

- `redone` → `renders/RedOne_Barber.mp4` (12,6 s): „Das rote Gel vom Barber… kennst du, oder? Hält richtig fest, glänzt,
  und geht mit Wasser einfach wieder raus. Gibt's im Dreierpack… oder gleich im Sechserpack. Link ist unten.“
  Endkarte „3er oder 6er?“ + „Link unten 👇“. Stimme Simon, eleven_v4, Tempo 1.1.

## Dreh-Plan

Siehe `DREHPLAN.md`.
