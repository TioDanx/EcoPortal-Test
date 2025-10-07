# Coolmovies Web Challenge - Reviews Feature


## What’s in this PR

Implements the **/reviews** endpoint for the existing **coolmovies-frontend** using the required stack: **Next.js**, **MUI**, **Redux Toolkit**, **Redux-Observable**, and **Apollo GraphQL**.
Users can browse movies, view reviews, and **add a new review with a rating**.

---

## Demo flow

* **Route**: `/reviews`
* **Tabs** to switch between movies
* **Header** shows poster, release year, average rating, and review count
* **Review feed** with per-review rating; on mobile, long bodies collapse with “Read more”
* **Add Review** floating button → a modern dialog with validation
* **Sorting**: “Rating ↑/↓” to order reviews ascending/descending

---

## Architecture

```
src/
  features/
    reviews/
      components/
        AddReviewDialog.tsx     # modal to submit a review
        ReviewFeed.tsx          # responsive review list + sorter
      state/
        slice.ts                # Redux Toolkit slice
        epics.ts                # Redux-Observable epics (movies, users, add review)
      templates/
        ReviewsTemplate.tsx     # page-level composition
  pages/
    reviews/index.tsx           # Next.js page exports ReviewsTemplate
```

### Data flow (Redux + Apollo)

* **fetchMoviesEpic**: `AllMovies` query → stores **movies**
* **fetchUsersEpic**: `AllUsers` query → stores **users**
* **addReviewEpic**: `CreateMovieReview` mutation → on success, prepends review in state
* **Random user** for the new review:

  1. pick a random user from `allUsers`;
  2. fallback to first reviewer in the selected movie;
  3. final fallback to a fixed UUID

This preserves the test’s no-auth requirement while keeping reviews “owned” by a plausible user.

---

## UI/UX decisions (Acceptance Criteria)

* **Prototype-level polish**: mobile-first, clean spacing, strong hierarchy
* **Non-default MUI blue**: custom dark theme in `theme.ts` (brand primary/secondary, text, paper)
* **A11y** (WCAG 2.1 focus on errors):

  * Proper roles (`aria-labelledby`, `aria-expanded`, `aria-pressed`)
  * Keyboard reachable dialogs/buttons
  * Sufficient color contrast in dark mode
* **Sorting & collapsing** for better information density

---

## Environment & GraphQL proxy (CORS-safe)

* Apollo client points to **`NEXT_PUBLIC_GRAPHQL_URL`** (defaults to `/graphql`).
* Next.js rewrite proxies `/graphql` to the mock API; this avoids CORS issues.

Create `.env.local`:

```env
# Apollo Client
NEXT_PUBLIC_GRAPHQL_URL=/graphql

# Next rewrite target (used by next.config.js)
GRAPHQL_PROXY_TARGET=http://localhost:5001/graphql
```

`next.config.js`:

```js
/** @type {import('next').NextConfig} */
module.exports = {
  compiler: { emotion: true },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: process.env.GRAPHQL_PROXY_TARGET || 'http://localhost:5001/graphql',
      },
    ];
  },
  reactStrictMode: true,
};
```

This satisfies “**Make the proxied GraphQL URL an environment variable**” while keeping local dev CORS-free.

---

## Codegen (GraphQL Code Generator)

Make sure the mock API is running, then:

```bash
yarn graphql-types
```

This generates typed queries/mutations and React hooks under `src/generated/`.

---

## Getting started

```bash
# 1) Install deps
yarn

# 2) Start the mock GraphQL server (provided by the challenge)
#    (Follow the backend’s README; default at http://localhost:5001/graphql)

# 3) Generate GraphQL types
yarn graphql-types

# 4) Start the app
yarn dev

# App at http://localhost:3000
# Reviews page at http://localhost:3000/reviews
```

---

## Testing

Basic unit tests (reducers, epics, and a lightweight component test):

```bash
yarn test
```

Jest is configured with `jest-environment-jsdom` and `ts-jest`.
If you modify GraphQL types, re-run `yarn graphql-types` and tests.

---

## Theming & typography

* Theme lives in `src/theme.ts`: dark palette, custom primary/secondary, rounded corners
* Font: **Plus Jakarta Sans** via Next Font; applied at app root (`_app.tsx`) for consistent rendering

---

## Accessibility checklist (ARC Toolkit suggested)

* Configure ARC Toolkit to **WCAG 2.1**
* Check:

  * Labels/roles on toggles (“Read more”), sort button (`aria-pressed`)
  * Dialog focus trap and keyboard interaction
  * Color contrast on dark backgrounds

---

## What to review

* **/reviews** route behavior end-to-end
* **Redux + Epics** patterns mirror the provided example (see `src/pages/index.tsx`)
* **Environment-driven proxy** (no hardcoded URLs)
* **Passing unit tests** and type-safety on GraphQL responses

---

## Notes

* No authentication required for the challenge; random user assignment is deliberate and documented.
* Components avoid inline styles; Emotion CSS uses **theme tokens** for consistency.
* Mobile: collapsed review bodies; Desktop: full bodies, hidden collapse button.

If you need anything else-scripts, extra tests, or more a11y affordances-I can extend this.
