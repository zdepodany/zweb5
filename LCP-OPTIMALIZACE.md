# LCP optimalizace – shrnutí

## Co bylo nalezeno a opraveno

### 1. **Google Fonts – render-blocking**
- **Problém:** Odkaz na font v `<head>` blokoval vykreslení stránky až do načtení fontu
- **Řešení:** Asynchronní načítání pomocí `media="print" onload="this.media='all'"` + `preload` pro prioritu
- **Dopad:** Stránka se vykreslí ihned s fallback fontem, vlastní font se načte na pozadí

### 2. **Hero animace – zpoždění LCP**
- **Problém:** Hero title (LCP element) začínal s `opacity: 0` a animací 0.6s + 0.1s delay = obsah viditelný až po ~0.7s
- **Řešení:** Zkrácení animace na 0.4s, odstranění delay u hero-title
- **Dopad:** LCP element se zobrazí cca o 0.3s dříve

### 3. **JavaScript**
- **Problém:** Script bez `defer` – na konci body je sice OK, ale `defer` zajišťuje paralelní načítání
- **Řešení:** Přidán atribut `defer` na `<script>`
- **Dopad:** Script se načítá paralelně, neblokuje parsing

## Co není problém

- **CSS:** `styles.css` je nutný pro render – je to kritický resource
- **Reveal efekt:** `.reveal` se aplikuje jen na sekce pod foldem, hero není v reveal
- **JSON-LD:** `application/ld+json` neblokuje render
- **Script:** Používá `DOMContentLoaded`, neblokuje LCP element

## Další možná vylepšení (volitelné)

1. **Critical CSS** – inline kritický CSS pro hero (nav, hero) v `<head>` – složitější implementace
2. **Redukce font weights** – načítat jen 400, 600, 700 místo 5 vah – úspora ~50 KB
3. **Self-hosted font** – hostovat font lokálně – eliminuje request na Google
4. **Preload hlavní CSS** – `<link rel="preload" href="styles.css" as="style">` – může pomoci při pomalé síti
