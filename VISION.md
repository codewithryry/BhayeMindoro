# Bhaye Mindoro — Vision

> **Status: paused.** The foundation is built (web + Android app shell, database schema, fare
> logic). Feature work has not started. This document records what the project is for, so it
> can be picked up again later.

## The problem

Commuters in Mindoro often don't know the right fare before they ride. Fares for vans,
jeepneys, buses, ferries, and especially tricycles are set by LGU ordinances and operators, but
that information is scattered: posted at a terminal, buried in a municipal ordinance, or only
known by word of mouth. As a result:

- First-time visitors and students get overcharged and can't tell that it happened.
- Students, senior citizens, and PWDs often don't get the 20% fare discount the law gives them.
- Global trip planners (Rome2Rio, Google Maps) show routes but only rough fare estimates, with
  no source, no tricycle fares, and no local discount rules.

## The vision

**A trusted, offline-first fare and route guide for Mindoro, built on verified data.**

When someone in Mindoro asks _"Magkano ang pamasahe?"_, Bhaye Mindoro should give an answer
they can trust and show where it came from.

## Principles

1. **Verified data only.** No guessed fares, routes, terminals, schedules, or coordinates. If
   there is no verified data, the app says so.
2. **Every fare shows its source.** Source, last-updated date, and effective date are shown with
   every fare. The database requires them.
3. **Works offline.** Signal is unreliable on the road, so data is cached on the device.
4. **Made for local commuters.** Filipino-first wording, large touch targets, simple screens,
   and fast loading on low-end Android phones.
5. **No account required.** Everything public works in guest mode. Reporting is anonymous.
6. **A guide, not an authority.** _Gabay lamang ang fare. Sundin ang official na taripa ng LGU o
   transport operator._

## What it will do

| Feature              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| Hanap Ruta           | Routes between municipalities, by mode (van, jeep, bus, tricycle, ferry) |
| Fare and travel time | Regular fare plus estimated travel time, each with its source            |
| Tricycle Calculator  | Tricycle fares per municipality, from LGU ordinances                     |
| 20% discount         | Automatic student / senior / PWD fare (RA 11314, RA 9994, RA 10754)      |
| Mga Terminal         | Where to catch each ride, with verified locations                        |
| Report Fare Concern  | Anonymous overcharging reports, reviewed before any data changes         |
| Offline mode         | Cached fares and routes when there is no signal                          |

## Who it's for

- **Daily commuters** checking that they're paying the right fare
- **Students, seniors, and PWDs** who are entitled to the discount
- **Visitors and tourists** arriving at Calapan port or Puerto Galera for the first time
- **LGUs and transport groups**, as a public, easy-to-read copy of their official fares

## Starting scope

Phase one covers four Oriental Mindoro municipalities: **Calapan, Naujan, Pinamalayan, and
Puerto Galera.** The rest of Mindoro (Oriental and Occidental) comes after the data process is
proven on these four.

## Roadmap

1. **Foundation** ✅ — Vite + React + Capacitor app, Supabase schema with Row Level Security,
   fare calculation, offline cache layer, guest mode and login, responsive UI.
2. **First verified data** — Collect tricycle fare ordinances and terminal fares for the four
   starting municipalities, record their sources, and connect the Supabase → device sync.
3. **Usable MVP** — Route search over cached data, fare results with sources, terminal list,
   and an Android release on Google Play.
4. **Trust loop** — An admin review queue for reports and a process for updating data when
   ordinances change.
5. **Expansion** — More municipalities, terminal maps, and partnerships with LGUs and transport
   cooperatives.

## How success looks

- A commuter can check a fare in under 10 seconds, even offline.
- Every fare in the app can be traced to an ordinance, operator, or field check.
- Overcharging reports lead to corrected data or a flagged concern, not silence.

## Picking it back up

See [README.md](README.md) for setup. The recommended next step is **phase 2**: gather and
verify real fare data for one municipality (Calapan) end to end, from source document to
database to app screen, before building more features.
