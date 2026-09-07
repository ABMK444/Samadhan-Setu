import type { Database, Challenge, Project, University } from "../types";
export const categories = [
  "Education",
  "Healthcare",
  "Agriculture",
  "Water Resources",
  "Sanitation",
  "Environment",
  "Energy",
  "Rural Livelihoods",
  "Accessibility",
  "Urban Development",
  "Public Administration",
  "Other",
];
export const districts = [
  "Ranchi",
  "Dhanbad",
  "Bokaro",
  "East Singhbhum",
  "West Singhbhum",
  "Hazaribagh",
  "Deoghar",
  "Dumka",
  "Sahibganj",
  "Godda",
  "Palamu",
  "Giridih",
  "Ramgarh",
  "Khunti",
];
export const demoUsers = [
  {
    id: "CIT001",
    name: "Asha Kumari",
    email: "citizen@demo.in",
    role: "citizen" as const,
  },
  {
    id: "UNI001",
    universityId: "UNI001",
    name: "Birla Institute of Technology, Mesra",
    email: "university@demo.in",
    role: "university" as const,
  },
  {
    id: "IND001",
    name: "Jharkhand Innovation Partners",
    email: "industry@demo.in",
    role: "industry" as const,
  },
  {
    id: "GOV001",
    name: "State Innovation Cell",
    email: "government@demo.in",
    role: "government" as const,
  },
];
const topics = [
  [
    "Low-cost detection of arsenic in rural drinking water",
    "Water Resources",
    "Sahibganj",
    "Rajmahal",
    "91",
  ],
  [
    "Smart irrigation monitoring for smallholder farms",
    "Agriculture",
    "Ranchi",
    "Angara",
    "86",
  ],
  [
    "Early identification of crop pests using field images",
    "Agriculture",
    "Khunti",
    "Torpa",
    "82",
  ],
  [
    "Accessible entrances for public service buildings",
    "Accessibility",
    "Dhanbad",
    "Govindpur",
    "76",
  ],
  [
    "Remote primary healthcare access for forest communities",
    "Healthcare",
    "West Singhbhum",
    "Manoharpur",
    "72",
  ],
  [
    "Reliable electricity for rural school laboratories",
    "Education",
    "Dumka",
    "Kathikund",
    "67",
  ],
  [
    "Decentralised organic waste processing",
    "Sanitation",
    "Bokaro",
    "Chas",
    "88",
  ],
  [
    "Low-cost urban drainage monitoring",
    "Urban Development",
    "East Singhbhum",
    "Jamshedpur",
    "79",
  ],
  [
    "Community solar microgrid fault detection",
    "Energy",
    "Godda",
    "Poraiyahat",
    "94",
  ],
  [
    "All-weather rural road condition reporting",
    "Urban Development",
    "Palamu",
    "Chainpur",
    "63",
  ],
  [
    "Cold storage for women-led producer groups",
    "Rural Livelihoods",
    "Giridih",
    "Bengabad",
    "78",
  ],
  [
    "Restoration monitoring for seasonal village ponds",
    "Environment",
    "Hazaribagh",
    "Ichak",
    "81",
  ],
  [
    "Offline access to public benefit applications",
    "Public Administration",
    "Ramgarh",
    "Gola",
    "74",
  ],
  [
    "Fluoride removal in community hand pumps",
    "Water Resources",
    "Deoghar",
    "Madhupur",
    "89",
  ],
];
const institution = (
  id: string,
  name: string,
  district: string,
): University => ({
  id,
  name,
  district,
  type: "Higher Education Institution",
  website: id === "UNI001" ? "https://www.bitmesra.ac.in" : "",
  description:
    "Demonstration institution profile. Research groups and project details shown here are fictional.",
  departments: "Environmental Engineering, Electronics, Computer Science",
  researchAreas: "Water quality, rural systems, sensor networks",
  facultyExpertise: "Sensor systems, community deployment",
  researchCentres: "Centre for Sustainable Systems (demo)",
  innovationCentres: "Student Innovation Centre (demo)",
  incubationFacilities: "Prototype mentoring and venture support",
  laboratories: "Water quality laboratory, embedded systems laboratory",
  facilities: "Electrochemical workstations, rapid prototyping",
  previousProjects: "Community water sensor pilot (fictional)",
});
export function createSeed(): Database {
  const challenges: Challenge[] = topics.map((t, i) => ({
    id: `JSI-2026-${String(142 + i).padStart(4, "0")}`,
    title: t[0],
    category: t[1],
    district: t[2],
    block: t[3],
    village: "Community ward 3",
    location: `Village cluster near ${t[3]} block office`,
    population: 450 + i * 170,
    duration: "More than two years",
    attempts:
      "Community volunteers collect reports manually; specialist equipment and sustained technical support are unavailable.",
    description:
      i === 0
        ? "Residents of village clusters in Rajmahal depend on hand pumps without regular water-quality screening. Sending samples to a district laboratory is expensive and delays action. The community needs a portable, low-cost arsenic screening method with clear instructions and a process for laboratory confirmation."
        : "Local communities report recurring service gaps that affect daily livelihoods. Existing manual methods are costly and difficult to maintain. A practical, locally maintainable solution should be developed with residents and tested under field conditions.",
    outcome:
      "An affordable, maintainable prototype validated with local residents, with training materials and a documented deployment plan.",
    priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
    citizenId: i % 2 === 0 ? "CIT001" : "CIT002",
    submittedBy:
      i % 2 === 0
        ? "Asha Kumari · Community volunteer"
        : "Local community organisation",
    contact: "community@example.org",
    date: `2026-08-${String(10 + i).padStart(2, "0")}`,
    reviewStatus: i > 10 ? "Pending Review" : "Matched",
    reviewNote:
      i > 10 ? "" : "Validated for institutional review (demonstration).",
    status: i > 10 ? "Submitted" : "Awaiting University Response",
    attachments: [],
    history: [
      {
        date: `2026-08-${String(10 + i).padStart(2, "0")}`,
        label: "Submitted",
      },
      ...(i <= 10
        ? [
            { date: "2026-08-27", label: "Validated" },
            { date: "2026-08-28", label: "University Matching" },
          ]
        : []),
    ],
  }));
  const projects: Project[] = [6, 8, 9].map((index, i) => {
    const c = challenges[index];
    c.universityId = "UNI001";
    c.reviewStatus = "Assigned";
    c.status = i === 2 ? "Completed" : "Solution Development";
    return {
      id: `PRJ-2026-00${i + 1}`,
      challengeId: c.id,
      universityId: "UNI001",
      title: c.title,
      department: i === 1 ? "Electronics" : "Environmental Engineering",
      mentor: "Dr. Ananya Singh (demo)",
      teamId: "TEAM001",
      duration: 6,
      approach:
        "Co-design with communities, build a field-ready prototype and validate through a supervised pilot.",
      lab: "Sustainable Systems Lab (demo)",
      notes: "Seeded demonstration project.",
      status:
        i === 2 ? "Completed" : i === 1 ? "Testing" : "Prototype Development",
      progress: i === 2 ? 100 : i === 1 ? 70 : 45,
      startDate: "2026-08-01",
      targetDate: "2026-12-15",
      milestones: [
        {
          id: `MS${i}1`,
          title: "Problem Analysis",
          description: "Map community needs and baseline conditions.",
          dueDate: "2026-08-20",
          status: "Completed",
          progress: 100,
        },
        {
          id: `MS${i}2`,
          title: "Prototype Development",
          description: "Build and calibrate the first prototype.",
          dueDate: "2026-09-30",
          status: i === 2 ? "Completed" : "In Progress",
          progress: i === 2 ? 100 : 45,
        },
        {
          id: `MS${i}3`,
          title: "Community Validation",
          description: "Field testing with residents.",
          dueDate: "2026-12-01",
          status: i === 2 ? "Completed" : "Not Started",
          progress: i === 2 ? 100 : 0,
        },
      ],
      updates: [],
      history: [
        { date: "2026-08-01", label: "Proposed" },
        {
          date: "2026-08-15",
          label:
            i === 2
              ? "Completed"
              : i === 1
                ? "Testing"
                : "Prototype Development",
        },
      ],
      testing: { description: "", result: "Not yet recorded", attachments: [] },
      collaborationRequired:
        i === 2 ? [] : ["Funding", "Mentorship", "Testing"],
    };
  });
  const matches = challenges
    .filter((c) => c.reviewStatus !== "Pending Review")
    .flatMap((c) => [
      {
        universityId: "UNI001",
        challengeId: c.id,
        matchScore: Number(topics[challenges.indexOf(c)][4]),
        matchingDomains: [c.category],
        matchingExpertise: ["Applied research", "Field validation"],
      },
      {
        universityId: "UNI002",
        challengeId: c.id,
        matchScore: 68,
        matchingDomains: [c.category],
        matchingExpertise: ["Community research"],
      },
    ]);
  return {
    challenges,
    projects,
    matches,
    universities: [
      institution("UNI001", "Birla Institute of Technology, Mesra", "Ranchi"),
      institution("UNI002", "IIT (ISM), Dhanbad", "Dhanbad"),
    ],
    teams: [
      {
        id: "TEAM001",
        universityId: "UNI001",
        name: "Rural Systems Innovation Group",
        description:
          "Multidisciplinary group developing practical technologies for rural deployment. All members are fictional.",
        departments: "Environmental Engineering, Electronics, Computer Science",
        lab: "Sustainable Systems Lab",
        mentor: "Dr. Ananya Singh (demo)",
        coMentor: "Dr. Vivek Das (demo)",
        expertise: "Sensors, water systems, field research",
        members: [
          {
            id: "MEM001",
            name: "Rahul Kumar (demo)",
            department: "Electronics",
            role: "Sensor Design",
          },
          {
            id: "MEM002",
            name: "Priya Sharma (demo)",
            department: "Computer Science",
            role: "Data Processing",
          },
        ],
      },
    ],
    notifications: matches
      .filter(
        (m) =>
          m.matchScore >= 75 &&
          !challenges.find((c) => c.id === m.challengeId)?.universityId,
      )
      .map((m, i) => ({
        id: `NOT${i}`,
        recipientId: m.universityId,
        category: "New Challenge Match",
        message: `${challenges.find((c) => c.id === m.challengeId)?.title} matches your institution at ${m.matchScore}%.`,
        date: "2026-08-28T09:00:00.000Z",
        read: false,
        path: `/university/challenges/${m.challengeId}`,
        dedupeKey: `match:${m.universityId}:${m.challengeId}`,
      })),
    collaborations: [],
  };
}
