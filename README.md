# NORD — Vanilla JavaScript webshop

En lille responsiv clothing-shop bygget med HTML, CSS og vanilla JavaScript.

## Funktioner
- Produktliste fra KEA T7 API
- Kategorifilter
- Sortering efter pris og navn
- Produktdetaljeside med URL-parametret ?id=
- Responsivt grid
- Lokal indkøbskurv med localStorage

## API
https://kea-alt-del.dk/t7/api

Brugte endpoints:
- /categories
- /productlist/{category}?limit=20
- /product/{id}

Produktbilleder:
https://kea-alt-del.dk/t7/images/webp/640/{id}.webp
https://kea-alt-del.dk/t7/images/webp/1000/{id}.webp

## Kør lokalt
Åbn projektet via en lokal server, fx VS Code Live Server, eller:
npx serve .
