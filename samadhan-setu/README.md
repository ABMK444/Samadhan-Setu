# Samadhan Setu

A functional frontend demonstration of a societal innovation collaboration portal in the Government of Jharkhand context. This is **not an official government service**. Institution names provide context; project, faculty, team and community records are fictional. The neutral Lucide building symbol is not an official emblem.

## Quick start

Use Node.js 20.19+ or 22.12+ and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. Do not double-click `index.html`: this is a React application and needs a development or static web server.

```bash
npm run build      # Strict TypeScript check + production build into dist/
npm run preview    # Serve the production build locally
npm test           # Cross-role service workflow and failure-path tests
npm run format     # Format editable source and tests
```

The ZIP includes source, lockfile, tests and a compiled `dist/`. `node_modules` is excluded. To deploy `dist/` independently, configure the web server to serve `index.html` for application routes, such as `/university/projects/...`. The prototype was prepared as project files; no public deployment or external database is configured.

## Demo sign-in

All demo accounts use **Demo@123**. Select the corresponding role and sign in, or use the single demonstration button below the form.

| Role                     | Email              |
| ------------------------ | ------------------ |
| Citizen                  | citizen@demo.in    |
| University / HEI         | university@demo.in |
| Industry Partner         | industry@demo.in   |
| Government Administrator | government@demo.in |

The university account represents Birla Institute of Technology, Mesra (`UNI001`). IIT (ISM), Dhanbad is a second fixture for matching and institution inspection. A second institution login is not included.

Remember me uses localStorage; otherwise the session uses sessionStorage. Password recovery is explicitly a placeholder. This frontend authentication and its role guards provide demonstration behavior only; they are not an authorization boundary.

## What is implemented

- Role-based routes, login, logout, responsive sidebar drawer and breadcrumbs.
- University dashboard with live counts, match percentages, search, filters and sorting.
- Challenge details, government review, request-information and rejection notes.
- Mock match results separated from high-match notification triggering.
- Confirmed uptake that creates a project and assigns the challenge atomically.
- Team creation/editing, mentor/lab descriptions and member addition/removal/editing.
- Editable university profile and government institution directory.
- Solution proposals, chronological editable updates, status changes and status history.
- Editable milestones with due dates, statuses and percentage completion.
- Testing and validation findings, proposal/update/testing attachments and image galleries.
- Citizen challenge submission, evidence upload and tracking linked to project progress.
- Government dashboard, domain chart, review queue, attention/high-impact/completed records.
- Industry opportunities, persisted expressions of interest and university notifications.
- Notification read/unread controls and links to relevant records.
- Required-field and percentage validation, upload validation, empty/invalid/error/loading states.
- Confirmed demo reset on the login page. Set `VITE_DEMO_MODE=false` to hide it.

## A complete university demonstration

1. Sign in as University. Open Notifications and the **91%** arsenic challenge.
2. Visit Matched Challenges, filter by Water Resources or minimum match, and open `JSI-2026-0142`.
3. Create a new team in Teams if desired, or use the seeded Rural Systems Innovation Group.
4. Click **Take Up Challenge** and complete the project title, department, faculty mentor, team, duration and initial approach. Confirm uptake.
5. Open Solution Proposal and save a proposal. Include `Funding, Testing` in collaboration required to show the project to industry.
6. Add milestones, then add a progress update with an image or PDF. Edit the update if needed.
7. Change the stage to Research, then Prototype Development. Update completion and save.
8. Complete a milestone, record testing results, and inspect Status History.
9. Sign out and sign in as Government. The project and progress are reflected immediately.
10. Sign in as Industry, browse Collaboration Projects, open the project’s Collaboration section and express interest. Sign back in as University to see the notification.

## Citizen-to-university demonstration

1. Sign in as Citizen. Submit a challenge with its location, description, affected population and photograph.
2. Open the new tracking page. It shows Pending Review.
3. Sign in as Government, open Challenge Review and validate the new challenge.
4. Mock matching returns 91% for BIT Mesra and 68% for IIT (ISM). A notification is created only for the score at or above 75%.
5. Sign in as University and take up the new challenge. Citizen tracking then displays the university and current project progress.

Use the same browser and origin for all demo roles. Records persist through refresh and logout; separate browsers do not share data. Changes in another tab refresh subscribed views. Repeated validation does not duplicate the high-match notification. Declining hides a match from the default list and prevents uptake; it does not reject the citizen’s challenge globally.

## Project structure

```text
src/
  components/   Shared fields, tables, dialogs, uploads and project editors
  context/      AuthContext (current signed-in demonstration user)
  data/         Realistic seed records and option lists
  hooks/        Database change subscription
  layouts/      Portal sidebar, header and breadcrumbs
  pages/        Role dashboards, lists, details and forms
  services/     Auth, challenges, universities, solutions, teams, notifications
  types/        Shared TypeScript interfaces and project status definitions
  styles.css    Institutional navy/teal design and responsive layout
  App.tsx       Lazy-loaded routes and role guards
  main.tsx      React entrypoint
```

Components read through the shared repository subscription. Mutations are isolated in services; UI components do not modify seed datasets or write challenge/project records directly to localStorage. Editors keep only unsaved drafts in React state. Service-level role and ownership checks prevent accidental cross-role edits within the demonstration.

## Mock repository and future API integration

`src/services/storage.ts` stores the entire versioned demonstration database under `samadhan-setu-v1`. `readDB()` returns a snapshot, and `mutate()` commits one document after all workflow steps succeed. A failed storage write does not publish new UI state. `src/data/seed.ts` generates the initial records only when none exist. Reset recreates them.

Replace repository operations with real asynchronous API calls and update the subscription hook to fetch/loading/error handling. Example boundaries:

| Service              | Future endpoint examples                                           |
| -------------------- | ------------------------------------------------------------------ |
| authService          | POST /api/auth/login; GET /api/auth/me; POST /api/auth/logout      |
| challengeService     | GET/POST /api/challenges; PATCH /api/challenges/:id/review         |
| universityService    | GET/PATCH /api/universities/:id; GET /api/universities/:id/matches |
| solutionService      | POST /api/challenges/:id/uptake; GET/PATCH /api/projects/:id       |
| teamService          | GET/POST/PATCH /api/teams                                          |
| notificationService  | GET /api/notifications; PATCH /api/notifications/:id/read          |
| collaborationService | POST /api/projects/:id/collaborations                              |

On a real backend, enforce authentication, ownership, validation, review transitions and duplicate-uptake prevention on the server. Use a transaction for project creation + challenge assignment. Store audit actors and timestamps server-side. Add pagination as datasets grow. Do not use browser-held role claims as authority.

## Matching integration

`UniversityMatch` is defined in `src/types/index.ts`. `createMockMatches()` in `universityService.ts` is the documented **MATCHING ALGORITHM INTEGRATION POINT**. It returns fixed fixtures and does not infer quality or calculate AI scores. Seeded challenges have varied predefined scores for demonstrations.

Replace the fixture generation with:

```http
POST /api/challenges/{id}/match
```

```json
[
  {
    "universityId": "UNI001",
    "challengeId": "JSI-2026-0142",
    "matchScore": 91,
    "matchingDomains": ["Water Resources"],
    "matchingExpertise": ["Water Quality Monitoring", "Sensor Systems"]
  }
]
```

Validate real scores as finite numbers from 0 to 100 before persisting them. Profile fields such as departments, research areas, laboratories and equipment are ready to supply future matching inputs. Keep the model on the backend; the UI consumes its output.

`MATCH_NOTIFICATION_THRESHOLD = 75` is exported from `notificationService.ts`. `notifyUniversityOfMatch()` is separate from match creation. Its deduplication key prevents repeated match alerts. Replace `addNotification()` with backend notification persistence and workers for email/SMS/push; do not send credentials from the frontend. The demo has no external email delivery, live websocket or scheduled milestone reminder worker. The notification schema accepts categories including Milestone Due for that future integration.

## Authentication replacement

Replace public demo credentials with a backend identity service. Prefer secure HttpOnly session cookies with CSRF protection as appropriate. Obtain role and institution from a verified server session. Keep React context for display state and route convenience, and enforce permissions again on every API operation.

## Uploads

`ImageUpload.tsx` is reused for challenges, proposals, updates and test results. It supports selection/drop, multiple files, previews, editable image descriptions, removal and validation. JPEG, PNG and WebP are supported; document-enabled forms also accept PDF and Word.

For persistent local demonstrations, browser FileReader creates capped data URLs: **500 KB per file, 1.5 MB per form**. These are selected user files, not images embedded in the source. This intentional adaptation lets images survive refresh without cloud storage. The shared browser storage budget is still limited; a quota error is shown instead of pretending the save succeeded. Demo seed records have no invented field photographs; upload a sample photo to demonstrate evidence and previews.

For production, replace FileReader with signed upload URLs to object storage, keep only attachment metadata/URLs in the database, validate MIME/content server-side, scan documents and apply access controls. Never use this demo for confidential data. Video upload is labeled as a future capability.

## Validation performed

- `npm run build`: strict TypeScript checking and Vite production build.
- `npm test`: citizen submission → government validation → matching/threshold/deduplication → team creation → uptake → proposal/update/milestone/testing → industry notification → completion and citizen tracking.
- Tests also cover wrong credentials/role, duplicate uptake/interest, declined records, progress bounds, persistence/reset and failed storage writes.

Browser visual and interaction testing was not performed. Native HTML form constraints and modal dialogs provide keyboard behavior, focus containment, Escape dismissal and labels. Mobile styles adapt the sidebar, forms and tables; tables scroll horizontally when needed.
