export type Person = {
  id: string;
  name: string;
  photo: string;
  formerRole: string;
  city: string;
  interests: string[];
  causes: string[];
  availability: string[];
  bio: string;
};

export const people: Person[] = [
  {
    id: "maya",
    name: "Maya Ellison",
    photo: "/people/p3.jpg",
    formerRole: "Staff Engineer, laid off in February",
    city: "Berkeley, CA",
    interests: ["Food security", "Cooking", "Cycling", "Documentaries"],
    causes: ["Food security"],
    availability: ["Saturday mornings"],
    bio: "Twelve years shipping backend systems. Now learning to cook for twenty people at once.",
  },
  {
    id: "daniel",
    name: "Daniel Okafor",
    photo: "/people/p12.jpg",
    formerRole: "Engineering Manager, laid off in January",
    city: "Oakland, CA",
    interests: ["Mentoring youth", "Basketball", "Jazz", "Gardening"],
    causes: ["Mentoring youth"],
    availability: ["Saturday mornings"],
    bio: "Missing the part of management I actually loved: helping people find their footing.",
  },
  {
    id: "priya",
    name: "Priya Raghunathan",
    photo: "/people/p5.jpg",
    formerRole: "Data Scientist, laid off in March",
    city: "Alameda, CA",
    interests: ["Environment", "Trail running", "Baking", "Birding"],
    causes: ["Environment"],
    availability: ["Sunday mornings"],
    bio: "Trading dashboards for dirt under my fingernails, at least on weekends.",
  },
  {
    id: "james",
    name: "James Whitfield",
    photo: "/people/p1.jpg",
    formerRole: "Product Marketing Lead, laid off in April",
    city: "Emeryville, CA",
    interests: ["Housing", "Woodworking", "Live music", "Cooking"],
    causes: ["Housing"],
    availability: ["Saturday afternoons"],
    bio: "Good at organizing things. Currently organizing my own week.",
  },
  {
    id: "sofia",
    name: "Sofia Marchetti",
    photo: "/people/p10.jpg",
    formerRole: "UX Researcher, laid off in February",
    city: "Oakland, CA",
    interests: ["Animal welfare", "Gardening", "Pottery", "Hiking"],
    causes: ["Animal welfare"],
    availability: ["Saturday mornings"],
    bio: "I ask a lot of questions. Mostly the useful kind.",
  },
  {
    id: "tomas",
    name: "Tomás Herrera",
    photo: "/people/p4.jpg",
    formerRole: "iOS Engineer, laid off in March",
    city: "San Leandro, CA",
    interests: ["Food security", "Soccer", "Photography", "Cycling"],
    causes: ["Food security"],
    availability: ["Saturday mornings"],
    bio: "Quiet at first, then you can't get me to stop talking about bread.",
  },
  {
    id: "nina",
    name: "Nina Castellanos",
    photo: "/people/p11.jpg",
    formerRole: "Technical Program Manager, laid off in January",
    city: "Berkeley, CA",
    interests: ["Literacy", "Books", "Swimming", "Cooking"],
    causes: ["Literacy"],
    availability: ["Weekday evenings"],
    bio: "Spreadsheets by trade, story time by choice.",
  },
  {
    id: "ben",
    name: "Ben Turner",
    photo: "/people/p6.jpg",
    formerRole: "Security Engineer, laid off in April",
    city: "Oakland, CA",
    interests: ["Environment", "Kayaking", "Chess", "Coffee"],
    causes: ["Environment"],
    availability: ["Saturday mornings"],
    bio: "Happier outdoors than in a standup.",
  },
  {
    id: "grace",
    name: "Grace Lim",
    photo: "/people/p2.jpg",
    formerRole: "Design Systems Lead, laid off in March",
    city: "Alameda, CA",
    interests: ["Housing", "Running", "Ceramics", "Baking"],
    causes: ["Housing"],
    availability: ["Saturday mornings"],
    bio: "Rebuilding a week that has shape to it.",
  },
  {
    id: "omar",
    name: "Omar Haddad",
    photo: "/people/p8.jpg",
    formerRole: "Sales Engineer, laid off in February",
    city: "Oakland, CA",
    interests: ["Mentoring youth", "Cooking", "Cycling", "Podcasts"],
    causes: ["Mentoring youth"],
    availability: ["Weekday mornings"],
    bio: "I talk to strangers for a living. Turns out I missed doing it in person.",
  },
  {
    id: "hannah",
    name: "Hannah Brooks",
    photo: "/people/p7.jpg",
    formerRole: "Content Strategist, laid off in April",
    city: "Berkeley, CA",
    interests: ["Animal welfare", "Hiking", "Writing", "Gardening"],
    causes: ["Animal welfare"],
    availability: ["Sunday mornings"],
    bio: "Two rescue dogs, one very open calendar.",
  },
];

export const byId = (id: string) => people.find((p) => p.id === id) ?? people[0];

export type Organization = {
  id: string;
  name: string;
  cause: string;
  neighborhood: string;
  about: string;
  mission: string;
  volunteersThisMonth: number;
  cover: string;
  tags: string[];
};

export const organizations: Organization[] = [
  {
    id: "harvest-table",
    name: "Harvest Table Food Bank",
    cause: "Food security",
    neighborhood: "West Oakland",
    about:
      "Harvest Table packs and distributes 4,000 grocery boxes every week to families across Alameda County. Volunteer shifts run in small teams of six to eight so people actually get to know each other.",
    mission: "No family in Alameda County should have to choose between rent and groceries.",
    volunteersThisMonth: 214,
    cover: "harvest",
    tags: ["Weekend shifts", "Indoors", "Team of 6–8"],
  },
  {
    id: "creek-keepers",
    name: "Creek Keepers Alliance",
    cause: "Environment",
    neighborhood: "Berkeley",
    about:
      "Creek Keepers restores urban waterways across the East Bay: removing invasive ivy, planting natives, and monitoring water quality. Most work happens outdoors in the morning with a coffee break halfway through.",
    mission: "Bring the creeks that run under our cities back to life.",
    volunteersThisMonth: 138,
    cover: "creek",
    tags: ["Outdoors", "Morning shifts", "Physical"],
  },
  {
    id: "second-chapter",
    name: "Second Chapter Literacy",
    cause: "Literacy",
    neighborhood: "Downtown Oakland",
    about:
      "Second Chapter runs reading circles and homework help at four public libraries. Volunteers commit to the same library and the same kids, which is where the impact actually comes from.",
    mission: "Every child should have an adult who reads with them every week.",
    volunteersThisMonth: 96,
    cover: "books",
    tags: ["Recurring", "Indoors", "Kids"],
  },
  {
    id: "casa-verde",
    name: "Casa Verde Community Gardens",
    cause: "Gardening",
    neighborhood: "Fruitvale",
    about:
      "Eleven neighborhood garden plots tended by volunteers and residents. Produce goes straight to the families on the block and to the Fruitvale free fridge.",
    mission: "Grow food and neighbors at the same time.",
    volunteersThisMonth: 87,
    cover: "garden",
    tags: ["Outdoors", "Beginner friendly", "Family friendly"],
  },
  {
    id: "bayside-paws",
    name: "Bayside Paws Rescue",
    cause: "Animal welfare",
    neighborhood: "Alameda",
    about:
      "A foster-based rescue with no kennels. Volunteers help with weekend adoption events, transport runs, and the very serious job of socializing shy dogs.",
    mission: "Every animal in the East Bay deserves a soft place to land.",
    volunteersThisMonth: 112,
    cover: "paws",
    tags: ["Weekend shifts", "Animals", "Low intensity"],
  },
  {
    id: "keys-collective",
    name: "Keys Collective",
    cause: "Housing",
    neighborhood: "Emeryville",
    about:
      "Keys Collective builds and repairs transitional housing units and helps newly housed neighbors move in and furnish their homes. No construction experience required.",
    mission: "Housing is the floor everything else is built on.",
    volunteersThisMonth: 74,
    cover: "keys",
    tags: ["Hands on", "Training provided", "Saturdays"],
  },
];

export const orgById = (id: string) => organizations.find((o) => o.id === id) ?? organizations[0];

export type VolunteerEvent = {
  id: string;
  title: string;
  orgId: string;
  date: string;
  dateShort: string;
  time: string;
  location: string;
  address: string;
  description: string;
  spotsTotal: number;
  spotsFilled: number;
  cohortEvent?: boolean;
  bring: string[];
};

export const events: VolunteerEvent[] = [
  {
    id: "harvest-sat",
    title: "Saturday Grocery Box Pack",
    orgId: "harvest-table",
    date: "Saturday, August 8",
    dateShort: "Sat Aug 8",
    time: "9:00 – 11:30 AM",
    location: "Harvest Table Warehouse",
    address: "1420 Peralta St, Oakland, CA",
    description:
      "Your cohort works one packing line together for the full shift. You'll build grocery boxes for 180 families, rotate roles halfway through, and finish with coffee in the loading bay. Standing work, indoors, music on.",
    spotsTotal: 8,
    spotsFilled: 6,
    cohortEvent: true,
    bring: ["Closed-toe shoes", "Water bottle", "Layers — the warehouse is cool"],
  },
  {
    id: "creek-restore",
    title: "Strawberry Creek Ivy Removal",
    orgId: "creek-keepers",
    date: "Sunday, August 16",
    dateShort: "Sun Aug 16",
    time: "8:30 – 11:00 AM",
    location: "Strawberry Creek Park",
    address: "1260 Allston Way, Berkeley, CA",
    description:
      "Clear invasive ivy from the creek bank and plant native sedge in its place. Tools, gloves, and a genuinely good pastry break are provided. Expect mud and a real sense of before-and-after.",
    spotsTotal: 10,
    spotsFilled: 4,
    bring: ["Pants you can ruin", "Sunscreen", "Water bottle"],
  },
  {
    id: "reading-circle",
    title: "Thursday Reading Circle",
    orgId: "second-chapter",
    date: "Thursday, August 13",
    dateShort: "Thu Aug 13",
    time: "4:00 – 5:30 PM",
    location: "Cesar Chavez Branch Library",
    address: "3301 East 12th St, Oakland, CA",
    description:
      "Read one-on-one with 2nd and 3rd graders. A staff coordinator pairs you with the same reader each week. Short training happens in the first fifteen minutes.",
    spotsTotal: 6,
    spotsFilled: 5,
    bring: ["Photo ID for check-in", "Patience", "A book you loved as a kid"],
  },
  {
    id: "garden-beds",
    title: "Build Raised Beds at Casa Verde",
    orgId: "casa-verde",
    date: "Saturday, August 22",
    dateShort: "Sat Aug 22",
    time: "10:00 AM – 1:00 PM",
    location: "Casa Verde Plot 4",
    address: "1745 Fruitvale Ave, Oakland, CA",
    description:
      "Assemble six cedar beds, fill them, and plant the fall greens. Neighbors bring lunch and everyone eats together at the end, which is honestly the best part.",
    spotsTotal: 12,
    spotsFilled: 7,
    bring: ["Work gloves if you have them", "Hat", "Appetite"],
  },
  {
    id: "adoption-day",
    title: "Adoption Day Crew",
    orgId: "bayside-paws",
    date: "Sunday, August 9",
    dateShort: "Sun Aug 9",
    time: "11:00 AM – 2:00 PM",
    location: "Alameda South Shore Center",
    address: "2224 South Shore Center, Alameda, CA",
    description:
      "Set up the pen, walk dogs between meet-and-greets, and talk with families about fostering. Great first shift if large groups feel like a lot right now.",
    spotsTotal: 8,
    spotsFilled: 3,
    bring: ["Comfortable shoes", "Sunglasses", "Zero dog experience needed"],
  },
  {
    id: "move-in-day",
    title: "Move-In Day: Doyle Street Units",
    orgId: "keys-collective",
    date: "Saturday, August 29",
    dateShort: "Sat Aug 29",
    time: "9:00 AM – 12:00 PM",
    location: "Doyle Street Transitional Housing",
    address: "5900 Doyle St, Emeryville, CA",
    description:
      "Help four families move into their first stable housing in over a year: carry furniture, assemble beds, stock the kitchen. Lifting help is shared, nobody carries alone.",
    spotsTotal: 10,
    spotsFilled: 6,
    bring: ["Closed-toe shoes", "Gloves", "A friend if you'd like"],
  },
];

export const eventById = (id: string) => events.find((e) => e.id === id) ?? events[0];
export const eventsForOrg = (orgId: string) => events.filter((e) => e.orgId === orgId);

export const cohort = {
  name: "Saturday Crew · Harvest Table",
  memberIds: ["maya", "daniel", "priya", "james", "sofia", "tomas"],
  meetupSpot: "Blue awning by the loading bay, 1420 Peralta St",
  meetupTime: "8:45 AM, fifteen minutes before the shift",
};

export const cohortMembers = () => cohort.memberIds.map(byId);

export const introductions = [
  {
    personId: "maya",
    text: "Hi all — Maya. I was at a payments company for nine years and honestly haven't had a Saturday routine since. Excited for a reason to leave the apartment.",
    when: "Monday",
  },
  {
    personId: "daniel",
    text: "Daniel here. I'll be the one bringing too much coffee. Fair warning: I will ask everyone what they're reading.",
    when: "Monday",
  },
  {
    personId: "sofia",
    text: "Sofia. I'm a slow starter socially but I show up every week. See you Saturday at the blue awning.",
    when: "Tuesday",
  },
  {
    personId: "tomas",
    text: "Tomás. Bringing a loaf of sourdough for the break. It's the only thing keeping my mornings structured right now.",
    when: "Wednesday",
  },
];

export const icebreakers = [
  "What's one thing you're doing with your week now that you couldn't before?",
  "What did you think you'd miss about work, but don't?",
  "What's the smallest good thing that happened to you this week?",
  "If Saturday mornings were yours forever, how would you spend them?",
  "Who has been unexpectedly kind to you lately?",
];

export const conversationStarters = [
  "You both listed food security first. Ask what pulled her toward it.",
  "You were both laid off within a month of each other. Compare notes on what the first week felt like.",
  "She's learning to cook for a crowd. You cook for two. Trade one recipe each.",
];

export const seedCohortChat: { personId: string; text: string; time: string }[] = [
  { personId: "daniel", text: "Morning crew. Weather says 64 and clear for Saturday.", time: "Tue 8:12 AM" },
  { personId: "priya", text: "Perfect. I can take three people from the Rockridge BART lot at 8:15.", time: "Tue 8:31 AM" },
  { personId: "maya", text: "I'll take that seat if it's still open 🙋‍♀️", time: "Tue 8:40 AM" },
  { personId: "james", text: "Same, if there's room for one more.", time: "Tue 9:02 AM" },
  {
    personId: "sofia",
    text: "Also — last week's line record was 180 boxes. Just saying.",
    time: "Tue 11:15 AM",
  },
];

export const transportation = [
  { driverId: "priya", note: "Rockridge BART lot", departs: "8:15 AM", seatsTotal: 3, seatsTaken: 2 },
  { driverId: "daniel", note: "Lake Merritt, 12th St side", departs: "8:20 AM", seatsTotal: 2, seatsTaken: 0 },
];

export const timeline = [
  { time: "8:45 AM", title: "Meet at the blue awning", detail: "Sofia usually gets there first." },
  { time: "9:00 AM", title: "Line briefing", detail: "Two minutes, then you're packing." },
  { time: "9:15 AM", title: "First rotation", detail: "Produce, dry goods, sealing." },
  { time: "10:15 AM", title: "Coffee break", detail: "Tomás is bringing sourdough." },
  { time: "10:30 AM", title: "Second rotation", detail: "Swap stations with the person on your left." },
  { time: "11:30 AM", title: "Wrap and reflect", detail: "Box count, then five minutes together." },
];

export const badges = [
  { id: "first", name: "First Saturday", detail: "Show up for your first shift", icon: "sunrise" },
  { id: "three", name: "Three in a Row", detail: "Volunteer three times", icon: "repeat" },
  { id: "connector", name: "Said Hello", detail: "Start a conversation with your group", icon: "car" },
  { id: "journal", name: "Reflected Five Times", detail: "Five journal entries after shifts", icon: "book" },
  { id: "inviter", name: "Brought Someone", detail: "Invite a friend who accepts", icon: "userplus" },
  { id: "ten", name: "Ten Days In", detail: "Ten volunteer days completed", icon: "medal" },
];



export const moods = ["Heavy", "Uneasy", "Steady", "Lighter", "Genuinely good"] as const;

export const interestOptions = [
  "Cooking",
  "Gardening",
  "Trail running",
  "Cycling",
  "Photography",
  "Books",
  "Live music",
  "Woodworking",
  "Baking",
  "Hiking",
  "Pottery",
  "Swimming",
];

export const causeOptions = [
  "Food security",
  "Environment",
  "Literacy",
  "Housing",
  "Animal welfare",
  "Mentoring youth",
];

export const continueOptions = [
  {
    id: "coffee",
    title: "Coffee nearby",
    detail: "Bicycle Coffee, 5 min walk",
    duration: "About 45 minutes",
    icon: "coffee",
  },
  {
    id: "lunch",
    title: "Lunch together",
    detail: "Tacos El Ojo de Agua, 8 min walk",
    duration: "About an hour",
    icon: "utensils",
  },
  {
    id: "walk",
    title: "Walk the estuary",
    detail: "Middle Harbor Shoreline Park",
    duration: "About 30 minutes",
    icon: "footprints",
  },
  {
    id: "next",
    title: "Book next Saturday",
    detail: "Same line, same people",
    duration: "2.5 hours",
    icon: "calendarcheck",
  },
];
export const reasonOptions = [
  { id: "routine", title: "I need structure in my week", detail: "Something to get up for on a set day." },
  { id: "people", title: "I want to be around people again", detail: "Not networking. Just company." },
  { id: "purpose", title: "I want my time to matter", detail: "Do something useful while I figure out what's next." },
  { id: "reset", title: "I need to get out of my head", detail: "The job search is loud. I want a break from it." },
];

export const laidOffOptions = [
  "In the last month",
  "1–3 months ago",
  "3–6 months ago",
  "Over 6 months ago",
  "Not laid off, but searching",
];

export const availabilityOptions = [
  "Saturday mornings",
  "Saturday afternoons",
  "Sunday mornings",
  "Weekday mornings",
  "Weekday evenings",
];

export const cityOptions = [
  "Oakland, CA",
  "Berkeley, CA",
  "Alameda, CA",
  "Emeryville, CA",
  "San Francisco, CA",
];

export type Prefs = { interests: string[]; causes: string[]; availability: string[] };

export function scorePerson(p: Person, prefs: Prefs) {
  const shared = (a: string[], b: string[]) => a.filter((x) => b.includes(x));
  return (
    shared(p.causes, prefs.causes).length * 3 +
    shared(p.interests, prefs.interests).length * 2 +
    shared(p.availability, prefs.availability).length * 2
  );
}

export function sharedWith(p: Person, prefs: Prefs) {
  return [
    ...p.causes.filter((c) => prefs.causes.includes(c)),
    ...p.interests.filter((i) => prefs.interests.includes(i)),
    ...p.availability.filter((a) => prefs.availability.includes(a)),
  ];
}

/** Deterministic: the two best-matched people for a set of preferences. */
export function matchPeople(prefs: Prefs, count = 2) {
  return [...people]
    .map((p) => ({ p, s: scorePerson(p, prefs) }))
    .sort((a, b) => b.s - a.s || a.p.name.localeCompare(b.p.name))
    .slice(0, count)
    .map((x) => x.p);
}

/** The event that best fits the user's causes + availability. */
export function matchEvent(prefs: Prefs) {
  const scored = events.map((e) => {
    const org = orgById(e.orgId);
    let s = 0;
    if (prefs.causes.includes(org.cause)) s += 3;
    if (prefs.availability.some((a) => e.date.startsWith(a.split(" ")[0]))) s += 2;
    if (e.spotsTotal - e.spotsFilled > 0) s += 1;
    return { e, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored[0].e;
}
