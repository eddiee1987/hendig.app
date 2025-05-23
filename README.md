# Driftig - Prosjektplanlegger med Supabase

Dette prosjektet er en prosjektplanlegger som bruker Supabase som backend for å lagre og hente prosjekter og planlagte prosjekter.

## Oppsett

### 1. Installer avhengigheter

```bash
npm install
```

### 2. Sett opp Supabase

1. Opprett en konto på [Supabase](https://supabase.com/) hvis du ikke allerede har en.
2. Opprett et nytt prosjekt i Supabase.
3. Gå til SQL Editor i Supabase-dashbordet.
4. Kopier innholdet fra `supabase/schema.sql` og kjør det i SQL Editor for å opprette nødvendige tabeller og policies.

### 3. Konfigurer miljøvariabler

1. Kopier `.env.local.example` til `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Åpne `.env.local` og fyll inn Supabase URL og anonym nøkkel:

```
NEXT_PUBLIC_SUPABASE_URL=din-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-supabase-anon-key
```

Du finner disse verdiene i Supabase-dashbordet under Settings > API.

### 4. Start utviklingsserveren

```bash
npm run dev
```

Besøk [http://localhost:3000](http://localhost:3000) for å se applikasjonen.

## Funksjonalitet

### Prosjekter

- Opprett, rediger og slett prosjekter
- Filtrer prosjekter basert på status (aktiv, fullført, arkivert)
- Sett prioritet på prosjekter (lav, medium, høy)

### Prosjektplanlegger

- Dra prosjekter fra listen til kalenderen for å planlegge dem
- Vis planlagte prosjekter i måned-, uke- eller dagvisning
- Fjern prosjekter fra kalenderen

## Databasestruktur

### Tabeller

1. **projects** - Lagrer informasjon om prosjekter
   - id (UUID, primærnøkkel)
   - name (TEXT, påkrevd)
   - description (TEXT)
   - client (TEXT, påkrevd)
   - status (TEXT, påkrevd: 'active', 'completed', 'archived')
   - start_date (DATE, påkrevd)
   - end_date (DATE)
   - budget (NUMERIC)
   - priority (TEXT, påkrevd: 'low', 'medium', 'high')
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **scheduled_projects** - Lagrer informasjon om planlagte prosjekter
   - id (UUID, primærnøkkel)
   - project_id (UUID, fremmednøkkel til projects.id)
   - scheduled_date (DATE, påkrevd)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

## Teknologier

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [React Hot Toast](https://react-hot-toast.com/)
#   h e n d i g  
 #   h e n d i g - a p p  
 #   h e n d i g  
 #   t e s t e  
 #   t e s t e  
 #   h e n d i g . a p p  
 