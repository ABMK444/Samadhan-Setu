You are a senior frontend engineer, UX designer, and software architect.

Build a complete, polished, functional frontend prototype for a government-oriented societal innovation platform called:

# SAMADHAN SETU

### Connecting Societal Challenges with Academic and Industry Solutions

The platform is intended for the Government of Jharkhand and connects:

1. Citizens / community organisations / local bodies / government departments
2. Universities / Higher Education Institutions (HEIs)
3. Industry / startups / MSMEs / CSR organisations
4. Government administrators

The application should look like a serious, credible Indian government/academic platform — minimalist, structured, professional, accessible, and modern.

Do NOT make it look like:

- a startup landing page
- a flashy SaaS dashboard
- a hackathon website
- a highly animated marketing website
- a generic AI-generated purple-gradient interface

The priority is clarity, institutional credibility, usability, and ease of future development.

---

# 1. TECH STACK

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React icons
- Recharts only where charts are required

Do not introduce complicated state-management libraries unless genuinely necessary.

Use straightforward React:

- components
- hooks
- context where needed
- typed interfaces
- service functions

Keep the code easy enough for an undergraduate/intermediate programmer to modify.

Write clear comments explaining:

- what each important component does
- where mock data is being used
- where backend/API/database calls should later be inserted
- how authentication could later be replaced
- where the university matching algorithm should later be connected

Do not over-engineer the project.

---

# 2. IMPORTANT ARCHITECTURAL REQUIREMENT

This is currently a FRONTEND PROTOTYPE.

Do not build a real database.

Instead, structure the code so that a real backend/database can be connected later with minimal changes.

Create a structure similar to:

src/
components/
pages/
layouts/
services/
data/
types/
hooks/
context/
utils/

Create service files such as:

- authService.ts
- challengeService.ts
- universityService.ts
- solutionService.ts
- notificationService.ts

For now these services should read/write mock data or localStorage.

UI components should NOT directly manipulate hardcoded datasets wherever possible.

For example:

challengeService.getChallenges()
challengeService.getChallengeById()
challengeService.createChallenge()
solutionService.updateSolution()
universityService.getRecommendedUniversities()

This way these functions can later be replaced by real API calls.

Clearly comment places such as:

// TODO: Replace this mock implementation with API/database request.

Use realistic mock data throughout the application.

---

# 3. PRODUCT CONTEXT

Communities across Jharkhand encounter challenges relating to:

- Education
- Healthcare
- Agriculture
- Water Management
- Sanitation
- Environment
- Rural Livelihoods
- Accessibility
- Urban Infrastructure
- Energy
- Public Administration
- Public Service Delivery

Citizens are often the first people to identify these problems, but there is no unified mechanism for converting these observations into structured research and innovation projects.

Higher Education Institutions possess:

- faculty expertise
- students
- laboratories
- research centres
- innovation centres
- incubation facilities

Industries, startups and research organisations may contribute:

- funding
- technical expertise
- mentoring
- prototyping
- deployment
- technology transfer

Samadhan Setu connects these stakeholders.

The basic lifecycle is:

Challenge Submitted
→ Government/Authority Review
→ Categorisation
→ University Matching
→ University Notification
→ University Reviews Challenge
→ University Takes Up / Rejects Challenge
→ Team Formation
→ Solution Proposal
→ Solution Development
→ Milestone Updates
→ Testing / Validation
→ Deployment
→ Completed

---

# 4. USER ROLES

Implement four frontend roles:

### Citizen

Can:

- submit a societal challenge
- upload images
- provide location information
- see submitted challenges
- track challenge status

### University

Can:

- log in
- see challenges matched to the university
- see matching percentage
- receive notifications for strong matches
- inspect challenge details
- accept/take up a challenge
- decline a challenge
- create a project team
- describe the team
- add faculty mentor
- add student members
- describe a research group/lab/department
- upload solution proposal
- update solution/project progress
- upload images/documents
- update milestones
- update solution status
- view completed projects

### Industry Partner

Provide a basic but functional section where industry organisations can:

- browse projects seeking collaboration
- indicate interest
- offer mentorship/funding/prototyping support

This does not need to be as detailed as the University module.

### Government Administrator

Can:

- review submitted challenges
- validate/reject them
- inspect university matches
- monitor project progress
- view analytics/dashboard information
- view universities and projects
- monitor system-wide status

---

# 5. LOGIN

Create a professional login screen.

Include:

SAMADHAN SETU branding
Government of Jharkhand context
Username/email field
Password field
Role selector or demonstration login options

Roles:

- Citizen
- University
- Industry Partner
- Government Administrator

Since this is a frontend prototype, mock authentication.

Provide demo accounts or buttons such as:

"Login as University"
"Login as Government Administrator"

However, keep the UI serious and realistic.

After login, route the user to the appropriate dashboard.

Keep authentication logic isolated in authService.ts / AuthContext so real authentication can later replace it.

---

# 6. UNIVERSITY LOGIN AND DASHBOARD — HIGH PRIORITY

The University module is one of the most important sections.

Create a University Dashboard.

Header/sidebar should display:

- University name
- University logo placeholder
- Dashboard
- Matched Challenges
- Active Solutions
- Teams
- Notifications
- Completed Projects
- University Profile
- Logout

Example university:
Birla Institute of Technology, Mesra

Show summary cards such as:

Matched Challenges: 14
High Match Challenges: 5
Active Projects: 7
Teams: 6
Completed Solutions: 11

Avoid excessive decorative cards.

Prioritise readable information hierarchy.

---

# 7. UNIVERSITY MATCHING PAGE

Create a page called:

"Matched Challenges"

Show challenges that have been routed to the university.

Each challenge should contain:

- Challenge ID
- Challenge title
- Category
- District
- Submitted by
- Date submitted
- Priority
- Current status
- Match percentage
- concise description
- action button

Example:

JSI-2026-0142
Low-cost detection of arsenic contamination in rural drinking water

Domain: Water Resources
District: Sahibganj
Match: 91%
Priority: High

[View Challenge]

Match percentages should be visually clear but restrained.

For example:
91% Strong Match
76% Good Match
54% Moderate Match

Do NOT implement a complicated matching algorithm.

Instead create a clean interface such as:

getUniversityMatchScore(challenge, university)

or:

universityMatchService.getMatches(challengeId)

For mock data, matching scores may simply be predefined.

COMMENT CLEARLY:

// MATCHING ALGORITHM INTEGRATION POINT
// A future backend/AI matching system should return a numerical score
// between 0 and 100 based on university expertise, departments,
// faculty research, facilities, previous projects, etc.

Create an interface like:

interface UniversityMatch {
universityId: string;
challengeId: string;
matchScore: number;
matchingDomains: string[];
matchingExpertise: string[];
}

The frontend should simply consume this result.

Do not bury matching logic inside UI components.

---

# 8. HIGH-MATCH UNIVERSITY NOTIFICATION

Make it easy to implement automatic university notification.

Assume:

MATCH\_NOTIFICATION\_THRESHOLD = 75

If a match score is >= 75, the university may receive a notification.

For this prototype, simulate this using mock notifications.

Example:

"New high-relevance challenge available"
"Water purification challenge from Sahibganj matches your institution at 91%."

Create notificationService.ts.

Use something structurally similar to:

notifyUniversityOfMatch(universityId, challengeId, score)

For now it should create a mock/local notification.

Comment:

// TODO: Replace with backend notification/email/SMS/push service.

Do not implement email infrastructure.

The threshold should be a configurable constant so it is easy to change later.

---

# 9. CHALLENGE DETAIL PAGE

When a university opens a challenge, show a structured page.

Include:

Challenge title
Challenge ID
Status
Priority
Domain
District
Block
Location
Submitted by
Submission date
Detailed problem description
Affected population
Expected outcome
Photographs
Supporting documents
Government validation status

Include a small timeline:

Submitted
Validated
University Matching
Awaiting University Response
Project Initiated
Solution Development
Testing
Completed

University should have:

[Take Up Challenge]

and:

[Decline]

buttons.

---

# 10. SOLUTION UPTAKE

When university clicks "Take Up Challenge":

Open a confirmation modal.

Then create an Active Solution / Project.

The user should provide:

Project title
University department
Faculty mentor
Project team
Expected duration
Initial approach
Research group/lab
Optional notes

After submission:

Challenge status becomes:
"Taken Up by University"

Create a project/solution record.

Use mock persistence/localStorage.

Make the relevant service function easy to replace later:

solutionService.takeUpChallenge(challengeId, universityId, data)

---

# 11. TEAM MANAGEMENT

Universities must be able to create and describe a multidisciplinary team.

Create a Team section containing:

Team Name
Team Description
Department(s)
Research Group / Lab
Faculty Mentor
Co-Mentor
Student Members
Roles
Areas of Expertise

Example:

Team Name:
Rural Water Innovation Group

Description:
Multidisciplinary group working on low-cost water quality monitoring technologies for rural deployment.

Faculty Mentor:
Dr. Ananya Singh
Department of Environmental Engineering

Members:
Rahul Kumar — Electronics — Sensor Design
Priya Sharma — Computer Science — Data Processing
Ankit Das — Civil Engineering — Water Systems

Allow:

- Add member
- Remove member
- Edit member
- Edit team description

Keep implementation simple.

---

# 12. UNIVERSITY PROFILE

Create a University Profile page.

This information will eventually be important for matching.

Fields:

University Name
University Type
District
Website
Institution Description

Academic Departments
Research Areas
Faculty Expertise
Research Centres
Innovation Centres
Incubation Facilities
Laboratories
Major Equipment / Facilities
Previous Innovation Projects

Make these editable in the prototype.

Store them in mock state/localStorage.

Include comments explaining that this data may eventually be used as input to the university matching algorithm.

---

# 13. SOLUTION / PROJECT PAGE

Each accepted challenge becomes a solution project.

Create a detailed project page.

Sections:

Overview
Team
Solution Proposal
Milestones
Updates
Documents
Images
Testing & Validation
Collaboration
Status History

Display:

Project ID
Challenge ID
Project Name
University
Department
Faculty Mentor
Current Stage
Completion Percentage
Start Date
Target Completion Date

---

# 14. SOLUTION PROPOSAL UPLOAD

Allow university to submit a solution proposal.

Fields:

Proposal Title
Executive Summary
Proposed Solution
Technical Approach
Expected Impact
Resources Required
Estimated Timeline
Collaboration Required
Funding Required
Attachments

Support:
PDF/document upload UI
Image upload UI

For prototype purposes, show selected filenames/previews.

Do not attempt actual cloud storage.

Clearly comment where upload APIs/storage should later be connected.

---

# 15. SOLUTION UPDATE

University should be able to post progress updates.

Create:

"Add Project Update"

Fields:

Update title
Date
Description
Milestone
Progress percentage
Problems / blockers
Next steps
Images
Attachments

Example:

Prototype Sensor Completed
Progress: 45%
Milestone: Prototype Development

"Initial electrochemical sensing prototype has been fabricated and laboratory calibration has begun."

Updates should appear in chronological order.

Allow university to edit updates.

---

# 16. SOLUTION STATUS

Create clear project statuses.

Use:

Proposed
Team Formation
Research
Prototype Development
Testing
Pilot Deployment
Validation
Completed
On Hold
Cancelled

University should be able to change the current project status.

Display the current state prominently.

Also display status history:

12 Aug 2026 — Project Started
23 Aug 2026 — Research
04 Sep 2026 — Prototype Development

Keep the workflow implementation simple enough that backend validation rules can be introduced later.

---

# 17. MILESTONE MANAGEMENT

Each solution project should contain milestones.

Example:

Problem Analysis — Completed
Design Specification — Completed
Prototype Development — In Progress
Field Testing — Not Started
Community Validation — Not Started
Final Deployment — Not Started

Each milestone should have:

Title
Description
Due date
Status
Completion percentage

Allow adding/editing milestones.

---

# 18. IMAGE UPLOAD

Image uploads are required in multiple places:

Citizen Challenge Submission
Solution Proposal
Project Updates
Testing Results

Create a reusable:

Component.

Features:

- click to upload
- drag and drop if simple to implement
- multiple images
- image preview
- remove selected image
- accepted file types
- file size validation message

For frontend prototype, use browser File objects / object URLs.

Do not encode massive images into hardcoded source code.

Comment where cloud/file storage integration belongs.

---

# 19. CITIZEN CHALLENGE SUBMISSION

Create a polished challenge submission form.

Use a multi-section or step-based form.

Fields:

Challenge Title
Problem Description
Category
District
Block
Village / Ward
Location Description
Approximate number of people affected
How long the problem has existed
Current attempts to solve it
Expected outcome
Urgency
Images
Videos placeholder
Supporting documents
Contact information

Categories:

Education
Healthcare
Agriculture
Water Resources
Sanitation
Environment
Energy
Rural Livelihoods
Accessibility
Urban Development
Public Administration
Other

AI categorisation should NOT actually be implemented.

Instead make the service architecture ready for it.

Example:

classificationService.classifyChallenge()

For the prototype, category can be selected manually or returned from mock data.

Comment the future AI integration point.

---

# 20. CITIZEN STATUS TRACKING

Citizen dashboard should show:

My Submitted Challenges

Example:

JSI-2026-0142
Unsafe drinking water in Rajmahal block

Status:
Solution Development

University:
BIT Mesra

Current Project Progress:
45%

Provide a detailed tracking page with timeline.

---

# 21. GOVERNMENT ADMIN DASHBOARD

Create a serious administrative dashboard.

Display:

Total Challenges
Validated Challenges
Challenges Assigned
Active Projects
Completed Projects
Participating Universities
Industry Collaborations

Use charts sparingly.

Useful visualisations:

Challenges by Domain
Challenges by District
Project Status Distribution
Monthly Challenge Submissions
University Participation

Below charts, include tables showing:

Recent Challenges
Projects Requiring Attention
Highest Impact Projects
Recently Completed Projects

Government should also be able to open individual challenge/project records.

---

# 22. GOVERNMENT CHALLENGE REVIEW

Create a review queue.

Statuses:

Pending Review
Validated
Needs More Information
Rejected
Matched
Assigned

Government administrator should be able to:

View challenge
Validate
Reject
Request more information

No complicated permissions backend is required.

---

# 23. INDUSTRY MODULE

Create a lightweight Industry dashboard.

Show projects requiring:

Funding
Mentoring
Technical Partnership
Prototype Manufacturing
Field Testing
Technology Transfer

Industry may click:

"Express Interest"

and select:

Funding
Mentorship
Technical Expertise
Equipment
Manufacturing
Testing
Deployment

Store as mock collaboration data.

---

# 24. NOTIFICATION SYSTEM

Create a notification centre.

Notification categories:

New Challenge Match
Challenge Accepted
Government Review
Project Update
Milestone Due
Industry Interest
Validation Result
Project Completed

Include:

- read/unread
- timestamps
- related challenge/project link
- mark as read

Create a reusable notification architecture that can later connect to backend/websocket/email/push services.

---

# 25. SEARCH AND FILTERING

Tables should support useful frontend filtering.

Matched Challenges:

- domain
- district
- priority
- match score
- status

Projects:

- status
- department
- completion
- date

Government challenges:

- district
- domain
- status
- priority
- assigned university

Keep filtering understandable and maintainable.

---

# 26. UI DESIGN

Visual direction:

Indian government / public-sector digital platform
Modern but restrained
Minimalist
Institutional
Professional
High information clarity

Suggested palette:

Primary:
deep navy / dark blue

Secondary:
muted teal or government green

Background:
off-white / very light grey

Status colours only where semantically useful:
green = completed/success
amber = pending
red = urgent/problem
blue = active/info

Do not excessively use gradients.

Do not use huge rounded cards everywhere.

Use moderate border radius:
4px–8px

Use:

- thin borders
- clean typography
- whitespace
- data tables
- restrained shadows
- clear headings

The application should resemble a professionally commissioned government digital service.

Use a readable sans-serif font.

Provide a consistent:

- sidebar
- top header
- breadcrumb system
- page title pattern

Include "Samadhan Setu" prominently but professionally.

Header may contain:

Government of Jharkhand
Samadhan Setu
Societal Innovation Collaboration Portal

A Jharkhand-government emblem/logo can be represented by a neutral placeholder. Do not fabricate an official emblem.

---

# 27. RESPONSIVENESS

The application must work at:

Desktop
Laptop
Tablet
Mobile

Desktop dashboard can use sidebar navigation.

On smaller screens convert sidebar to a drawer/menu.

Tables should remain usable.

Forms must not overflow.

---

# 28. ACCESSIBILITY

Use:

semantic HTML
proper labels
keyboard-accessible buttons
visible focus states
reasonable colour contrast
alt text support
accessible modals
descriptive form errors

---

# 29. MOCK DATA

Generate realistic Jharkhand-oriented mock data.

Use districts such as:

Ranchi
Dhanbad
Bokaro
East Singhbhum
West Singhbhum
Hazaribagh
Deoghar
Dumka
Sahibganj
Godda
Palamu
Giridih
Ramgarh
Khunti

Example universities may include realistic institutions, but ensure mock project/faculty details are clearly fictional where necessary.

Example challenge types:

- arsenic/fluoride contamination
- rural irrigation monitoring
- agricultural pest detection
- inaccessible public buildings
- remote healthcare access
- school infrastructure
- waste management
- urban drainage
- rural road monitoring
- solar microgrid maintenance

Create enough mock records so tables/dashboard screens look realistic.

---

# 30. DATA TYPES

Create clean TypeScript interfaces.

At minimum:

User
Citizen
University
UniversityProfile
IndustryPartner
Challenge
ChallengeAttachment
UniversityMatch
Project
SolutionProposal
Team
TeamMember
ProjectUpdate
Milestone
Notification
CollaborationRequest

Do not use `any` unless unavoidable.

---

# 31. ROUTING

Implement routes approximately like:

/login

/citizen/dashboard
/citizen/challenges/new
/citizen/challenges/\:id

/university/dashboard
/university/matches
/university/challenges/\:id
/university/projects
/university/projects/\:id
/university/teams
/university/profile
/university/notifications

/government/dashboard
/government/challenges
/government/challenges/\:id
/government/projects
/government/universities

/industry/dashboard
/industry/projects
/industry/projects/\:id

Redirect users according to role.

---

# 32. EMPTY, LOADING AND ERROR STATES

Every important screen should account for:

loading
empty data
invalid item
failed operation

Even though this is mocked, components should be designed correctly.

For example:

"No matched challenges are currently available."

not an empty broken table.

---

# 33. VALIDATION

Forms should validate required fields.

Examples:

Challenge title required
Description minimum length
District required
Invalid email warning
Progress must be 0–100
Image type validation

Do not let obviously invalid values be submitted.

---

# 34. IMPORTANT MATCHING IMPLEMENTATION REQUIREMENT

DO NOT build a fake complicated AI algorithm into the frontend.

Instead make the architecture explicitly support:

POST /api/challenges/{id}/match

or equivalent future endpoint returning:

[
{
"universityId": "UNI001",
"matchScore": 91,
"matchingDomains": ["Water Resources", "Environmental Engineering"],
"matchingExpertise": ["Water Quality Monitoring", "Sensor Systems"]
}
]

The frontend then displays those results.

Also provide:

MATCH\_NOTIFICATION\_THRESHOLD = 75

and logically separate:

matching result
from
notification triggering

so they can later become backend services.

---

# 35. CODE QUALITY

This requirement is extremely important.

Code should be:

- simple
- understandable
- modular
- well named
- appropriately commented
- easy to edit
- easy to connect to a backend
- free of unnecessary abstractions

Do not create giant 800-line components.

Do not overuse clever TypeScript patterns.

Prefer readability.

Where backend integration is expected, leave comments such as:

// TODO BACKEND:
// Replace the localStorage implementation below with:
// POST /api/challenges

Comments should explain intent rather than narrating obvious syntax.

---

# 36. FUNCTIONALITY REQUIREMENT

Do not create buttons that visibly appear functional but do nothing.

For the prototype:

- Login must work
- Navigation must work
- Challenge creation must work locally
- University uptake must work locally
- Project creation must work locally
- Team editing must work locally
- Solution update creation must work locally
- Status changing must work locally
- Notifications must work locally
- Image selection/preview must work
- Filters must work
- Match percentage display must work

Use localStorage where useful so a browser refresh does not erase all prototype activity.

---

# 37. DEVELOPMENT / DEMO MODE

Provide a simple demo-data reset option.

Example:

"Reset Demo Data"

This should only be available in development/demo mode.

Include a README explaining:

1. installation
2. npm commands
3. project structure
4. mock login
5. mock-data architecture
6. where database/API integration should happen
7. how matching API should later be integrated
8. how real authentication should later be integrated
9. how uploads should later move to cloud/object storage
10. how notifications should later connect to backend services

---

# 38. QUALITY CONTROL BEFORE FINISHING

Before declaring the implementation complete, inspect the entire generated project.

Check for:

- TypeScript errors
- missing imports
- invalid routes
- duplicated routes
- non-working buttons
- broken React state
- missing keys
- inconsistent interfaces
- undefined mock values
- forms that reload the page unexpectedly
- inaccessible labels
- mobile overflow
- navigation dead ends
- inconsistent status names
- spelling mistakes
- accidental placeholder lorem ipsum
- unused critical components
- pages that were specified but not implemented

Run the build.

Fix all build errors.

Do not stop after generating the visual shell.

The deliverable should be a coherent working frontend application.

---

# 39. PRIORITY ORDER

If implementation scope becomes large, prioritise in this exact order:

1. Login and role routing
2. University dashboard
3. Matched challenge list + percentage matching
4. Challenge detail
5. Take Up Challenge workflow
6. Team creation/description
7. Solution proposal
8. Solution updates
9. Solution status
10. Notifications
11. Image upload
12. University profile
13. Government dashboard
14. Government challenge review
15. Citizen submission and tracking
16. Industry collaboration
17. Additional analytics

Do not sacrifice core workflows for decorative features.

---

# 40. FINAL EXPECTED RESULT

I should be able to demonstrate this flow:

University logs in
→ opens dashboard
→ receives a notification that a challenge is a 91% match
→ opens Matched Challenges
→ filters/sorts matches
→ opens challenge
→ reads problem and sees images
→ selects "Take Up Challenge"
→ creates/describes multidisciplinary team
→ submits initial solution proposal
→ project appears under Active Solutions
→ adds progress update
→ uploads project images
→ changes project from Research to Prototype Development
→ updates completion percentage
→ completes milestone
→ government dashboard reflects current project status

I should also be able to demonstrate:

Citizen logs in
→ submits challenge with image
→ challenge appears in citizen dashboard
→ government validates it
→ universities receive mock match results
→ high-scoring university receives notification

The matching algorithm itself does NOT need to exist.

The frontend should only provide a clean interface through which a future matching service can supply scores and explanations.

Build this as a serious prototype suitable for presentation to government officials, universities and a technical evaluation panel.