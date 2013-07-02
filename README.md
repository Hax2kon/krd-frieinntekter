# Frie inntekter
Visualisering av frie inntekter på nett

## Installation
1. Sjekk ut og naviger til prosjekt root
2. `npm install`
3. `bower install`
4. `grunt server` for å starte server, `grunt build` for å generere komprimerte js- og css-filer (havner i `dist`)

## Diverse
* Siden regjeringen.no bruker jQuery 1.5.1, har vi byttet ut `.on` og `.off` med `.bind` i magnific popup og jquery.collapse.
* Raphael.js sentrerer tekst vertikalt, lagt inn følgende fiks for å få align top: https://github.com/DmitryBaranovskiy/raphael/issues/713
* IE8 støtter ikke topojson, så de får en geosjon fil. Denne er litt stor, burde kanskje komprimeres.
