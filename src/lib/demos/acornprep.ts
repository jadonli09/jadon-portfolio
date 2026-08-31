/**
 * Real questions from the AcornPrep bank, baked in so the portfolio demo runs
 * with no server. Captured from the live product on 2026-08-30 — do not
 * invent questions. Five from AP Psychology, four from AP US History (the
 * two prose courses; Calculus/Chemistry/Statistics are LaTeX-heavy and were
 * skipped since the portfolio has no math renderer). A fifth US History record
 * was captured and then removed by ruling — its explanation contradicted its
 * own answer choice — so nine ship, not ten.
 */

export type DemoChoice = { label: string; text: string };

export type DemoMcq = {
  id: string;
  course: string;
  unit: string;
  difficulty: "Easy" | "Medium" | "Hard";
  /** Optional prose set-up rendered in the left panel, as the product does. */
  stimulus?: string;
  stem: string;
  choices: DemoChoice[];
  answer: string;
  explanation: string;
};

export const MCQS: DemoMcq[] = [
  {
    id: "appsy-gestalt-closure",
    course: "AP Psychology",
    unit: "Unit 3: Sensation and Perception",
    difficulty: "Medium",
    stem: "The Gestalt principle of closure predicts that when viewing an incomplete circle, a person will perceive it as:",
    choices: [
      {
        label: "A",
        text: "Two separate arc segments, because the gap prevents the brain from unifying the shape",
      },
      {
        label: "B",
        text: "Two distinct objects separated by the figure-ground boundary created by the gap",
      },
      {
        label: "C",
        text: "The figure most similar in shape to other objects currently in the visual environment",
      },
      {
        label: "D",
        text: "A complete circle, because the brain fills in missing contours to form a whole, unified figure",
      },
    ],
    answer: "D",
    explanation:
      "Closure is the Gestalt principle by which the brain fills in gaps in incomplete figures to perceive a whole, meaningful form. The mind prefers complete, stable figures and closes gaps to create a unified perceptual experience.",
  },
  {
    id: "appsy-monocular-depth-cue",
    course: "AP Psychology",
    unit: "Unit 3: Sensation and Perception",
    difficulty: "Medium",
    stem: "A skier uses the relative sizes of trees to judge distance to the bottom of a slope. This depth cue is best classified as:",
    choices: [
      {
        label: "A",
        text: "Relative size, a monocular cue where smaller-appearing objects are perceived as farther away",
      },
      {
        label: "B",
        text: "Binocular disparity, since both eyes receive slightly different images of the trees at different distances",
      },
      {
        label: "C",
        text: "Convergence, since the eyes rotate inward when focusing on trees at different distances",
      },
      {
        label: "D",
        text: "Interposition, a monocular cue in which one tree blocks part of another indicating closer proximity",
      },
    ],
    answer: "A",
    explanation:
      "Relative size is a monocular depth cue: when two similar objects differ in perceived size, the smaller appears farther away. The skier uses size comparisons of trees — a single-eye (monocular) cue available even with one eye closed. Interposition (D) involves overlap, not size comparisons.",
  },
  {
    id: "appsy-stereotype-prejudice",
    course: "AP Psychology",
    unit: "Unit 9: Social Psychology",
    difficulty: "Easy",
    stem: "A student who believes all members of a particular cultural group share identical personality traits is demonstrating",
    choices: [
      {
        label: "A",
        text: "prejudice, because she holds a negative affective attitude toward the group",
      },
      {
        label: "B",
        text: "discrimination, because she treats members of the group differently based on their identity",
      },
      {
        label: "C",
        text: "a stereotype, because she holds a generalized belief about the characteristics of a group",
      },
      {
        label: "D",
        text: "ethnocentrism, because she judges the group by her own cultural standards",
      },
    ],
    answer: "C",
    explanation:
      "A stereotype is a generalized cognitive belief (not necessarily negative) about the attributes of members of a social group; assuming all members share traits is stereotyping. Prejudice (A) specifically refers to a negative attitude or emotional reaction, which is not specified here.",
  },
  {
    id: "appsy-milgram-ethics",
    course: "AP Psychology",
    unit: "Unit 9: Social Psychology",
    difficulty: "Medium",
    stem: "Which of the following describes the primary ethical concern raised by Milgram's obedience experiments?",
    choices: [
      {
        label: "A",
        text: "Participants were not randomly assigned to conditions, reducing internal validity",
      },
      {
        label: "B",
        text: "The sample was not representative because only college students from one university participated",
      },
      {
        label: "C",
        text: "The study lacked a control group against which to compare shock administration rates",
      },
      {
        label: "D",
        text: "Participants were deceived and subjected to significant psychological distress without fully informed consent",
      },
    ],
    answer: "D",
    explanation:
      "Milgram's study is criticized primarily for deception (participants believed they were administering real shocks) and for subjecting participants to severe psychological distress without adequate ability to truly withdraw. Random assignment (A) was not the ethical concern — the experiment had strong internal validity.",
  },
  {
    id: "appsy-contact-hypothesis",
    course: "AP Psychology",
    unit: "Unit 9: Social Psychology",
    difficulty: "Hard",
    stem: "Gordon Allport's contact hypothesis proposes that prejudice between groups is most effectively reduced when contact is",
    choices: [
      {
        label: "A",
        text: "brief but frequent, because repeated exposure increases liking through familiarity",
      },
      {
        label: "B",
        text: "in any setting where the two groups can observe each other on a regular basis",
      },
      {
        label: "C",
        text: "directed by an authority figure who commands equal treatment of all group members",
      },
      {
        label: "D",
        text: "equal-status, cooperative, and supported by social norms favoring equality",
      },
    ],
    answer: "D",
    explanation:
      "Allport's contact hypothesis specifies that contact reduces prejudice most effectively under conditions of equal status, cooperative (rather than competitive) goals, personal acquaintance, and institutional support. Mere exposure without these conditions (B) is insufficient and can even increase hostility.",
  },
  {
    id: "apush-railroad-regulation",
    course: "AP US History",
    unit: "Unit 6: Period 6: 1865–1898",
    difficulty: "Easy",
    stimulus:
      "The Gilded Age witnessed the rise of powerful railroad corporations whose rate-setting practices generated enormous resentment among farmers and small businesses. The following excerpt comes from testimony before a Congressional committee investigating railroad abuses. \"The railroad companies of this country have placed themselves beyond the reach of ordinary competition. They fix rates not by any law of trade but by their own convenience and profit. A farmer in Iowa who ships his grain to Chicago pays what the railroad tells him to pay, or he does not ship at all. The company charges him one rate and charges his neighbor who has a larger shipment a lower rate — and so the large shipper prospers at the expense of the small man. The remedy is simple and clear: the federal government must assume the authority to regulate interstate railroad rates, or this Republic will become an oligarchy of railroad kings.\" — Iowa farmer, testimony before the Senate Committee on Transportation, 1885",
    stem: "The farmer's testimony most directly supports the argument that",
    choices: [
      {
        label: "A",
        text: "railroad corporations had successfully used competition among companies to lower freight rates for small shippers",
      },
      {
        label: "B",
        text: "the solution to railroad abuses lay in the formation of farmer-owned cooperative rail lines",
      },
      {
        label: "C",
        text: "state governments were more effective than the federal government in protecting small farmers from corporate exploitation",
      },
      {
        label: "D",
        text: "the federal government needed to regulate interstate commerce to prevent discriminatory railroad pricing practices",
      },
    ],
    answer: "D",
    explanation:
      "The farmer explicitly concludes his testimony by calling for federal authority to regulate interstate railroad rates, arguing that market competition has failed to constrain discriminatory pricing. This directly supports what would become the Interstate Commerce Act of 1887.",
  },
  {
    id: "apush-interstate-commerce-act",
    course: "AP US History",
    unit: "Unit 6: Period 6: 1865–1898",
    difficulty: "Medium",
    stimulus:
      "The Gilded Age witnessed the rise of powerful railroad corporations whose rate-setting practices generated enormous resentment among farmers and small businesses. The following excerpt comes from testimony before a Congressional committee investigating railroad abuses. \"The railroad companies of this country have placed themselves beyond the reach of ordinary competition. They fix rates not by any law of trade but by their own convenience and profit. A farmer in Iowa who ships his grain to Chicago pays what the railroad tells him to pay, or he does not ship at all. The company charges him one rate and charges his neighbor who has a larger shipment a lower rate — and so the large shipper prospers at the expense of the small man. The remedy is simple and clear: the federal government must assume the authority to regulate interstate railroad rates, or this Republic will become an oligarchy of railroad kings.\" — Iowa farmer, testimony before the Senate Committee on Transportation, 1885",
    stem: "The railroad practices described in the testimony — charging different rates to different shippers — most directly contributed to which of the following legislative responses?",
    choices: [
      {
        label: "A",
        text: "The Sherman Antitrust Act of 1890, which outlawed monopolistic business combinations in restraint of trade",
      },
      {
        label: "B",
        text: "The Interstate Commerce Act of 1887, which created the first federal regulatory commission to oversee railroad rates",
      },
      {
        label: "C",
        text: "The Pendleton Civil Service Reform Act of 1883, which established merit-based federal employment",
      },
      {
        label: "D",
        text: "The Bland-Allison Act of 1878, which required the Treasury to purchase silver and coin it into dollars",
      },
    ],
    answer: "B",
    explanation:
      "The discriminatory pricing practices described — charging different rates to different shippers and monopolistic control over shipping — led directly to the Interstate Commerce Act of 1887, which created the Interstate Commerce Commission (ICC) to oversee railroad rates and prohibited rate discrimination. The Sherman Antitrust Act addressed broader monopoly practices, not specifically railroad rate discrimination.",
  },
  {
    id: "apush-shays-rebellion",
    course: "AP US History",
    unit: "Unit 3: Period 3: 1754–1800",
    difficulty: "Medium",
    stimulus:
      "After independence, the new United States operated under the Articles of Confederation (1781–1789), which created a weak central government. Events of the 1780s, particularly Shays' Rebellion, convinced many leaders that a stronger government was necessary. \"We have probably had too good an opinion of human nature in forming our confederation. Experience has taught us that men will not adopt and carry into execution measures the best calculated for their own good, without the intervention of a coercive power. I do not conceive we can exist long as a nation without having lodged somewhere a power which will pervade the whole Union in as energetic a manner as the authority of the state governments extends over the several states. It is not the same causes that produce the same effects in all cases, but the want of energy in the Federal government; the want of authority in the Congress; and the want of a regular administration of the laws in the states, which have produced the present dilemma.\" — George Washington, letter to James Madison, November 5, 1786",
    stem: "Washington wrote this letter in the immediate aftermath of which of the following events that most directly triggered his concerns?",
    choices: [
      {
        label: "A",
        text: "The British occupation of frontier forts in violation of the Treaty of Paris",
      },
      {
        label: "B",
        text: "The collapse of the Continental currency and the resulting hyperinflation across the states",
      },
      {
        label: "C",
        text: "The failure of Congress to ratify a commercial treaty with Spain regarding Mississippi River navigation",
      },
      {
        label: "D",
        text: "Shays' Rebellion, in which indebted farmers in Massachusetts took up arms against the state government",
      },
    ],
    answer: "D",
    explanation:
      "Washington wrote this letter in November 1786, during Shays' Rebellion (August 1786–February 1787), when Massachusetts farmers rose in armed revolt against debt collection and foreclosures. This event confirmed for many nationalists that the Confederation government lacked the power to maintain domestic order — precisely the concern Washington expresses. The letter's timing and Washington's other correspondence confirm this context.",
  },
  {
    id: "apush-mccarthyism",
    course: "AP US History",
    unit: "Unit 8: Period 8: 1945–1980",
    difficulty: "Medium",
    stimulus:
      "McCarthyism — the broad anti-Communist investigations of the early 1950s — created a climate of fear and suspicion that affected artists, government employees, academics, and political figures across the country. \"Have you no sense of decency, sir, at long last? Have you left no sense of decency? Until this moment, Senator, I think I never really gauged your cruelty or your recklessness. You have done enough. Have you no sense of decency? If there is a God in heaven, it will do neither you nor your cause any good. I will not discuss this further with you. You have done enough. Have you no sense of decency, at long last?\" — Joseph Welch, special counsel for the Army, address to Senator Joseph McCarthy, Army-McCarthy Hearings, June 9, 1954",
    stem: "The exchange reflected in the passage most directly contributed to which of the following?",
    choices: [
      {
        label: "A",
        text: "The Senate's censure of Senator McCarthy and the rapid decline of his political influence",
      },
      {
        label: "B",
        text: "The Supreme Court's ruling that congressional investigations into political beliefs violated the First Amendment",
      },
      {
        label: "C",
        text: "Congress's repeal of the Internal Security Act and closure of the House Un-American Activities Committee",
      },
      {
        label: "D",
        text: "President Eisenhower's decision to dismiss several hundred federal employees suspected of Communist sympathies",
      },
    ],
    answer: "A",
    explanation:
      "Welch's publicly broadcast rebuke — watched by millions on live television — punctured McCarthy's credibility and marked the turning point of the senator's public support; the Senate voted to censure McCarthy in December 1954, effectively ending his influence. Choice C is factually wrong; HUAC was not closed at this time and operated for many more years.",
  },
];

export type RubricItem = {
  title: string;
  earned: number;
  outOf: number;
  justification: string;
  /** Verbatim span from the response that earned the point; null when none did. */
  quote: string | null;
};

export type FrqPart = {
  part: string;
  earned: number;
  outOf: number;
  summary: string;
  items: RubricItem[];
};

export type DemoFrq = {
  exam: string;
  prompt: string;
  response: string;
  scored: number;
  total: number;
  parts: FrqPart[];
};

/**
 * A real grading run, captured verbatim from the live product. A partial score
 * demos better than full marks — you watch the grader reason, and you see it
 * cite the student's own words back as evidence.
 */
export const FRQ: DemoFrq = {
  exam: "AP Calculus AB · 2025 FRQ #5",
  prompt:
    "Two particles, H and J, are moving along the x-axis. For 0 ≤ t ≤ 5, the position of particle H at time t is given by x_H(t) = e^(t² − 4t). (a) Find the velocity of particle H at time t = 1. Show the work that leads to your answer.",
  response:
    "v_H(t) = x_H(t) differentiated. Using the chain rule on x_H(t) = e^(t² − 4t): v_H(t) = (2t − 4)e^(t² − 4t). At t = 1: v_H(1) = (2(1) − 4)e^(1 − 4) = −2e^(−3) = −0.0996.",
  scored: 2,
  total: 5,
  parts: [
    {
      part: "(a)",
      earned: 2,
      outOf: 3,
      summary: "Correctly calculated the velocity of particle H at t = 1 using the chain rule.",
      items: [
        {
          title: "Considers x′_H",
          earned: 1,
          outOf: 1,
          justification: "Acknowledges the need to differentiate x_H(t) to find velocity.",
          quote: "v_H(t) = x_H(t) differentiated.",
        },
        {
          title: "Answer",
          earned: 1,
          outOf: 1,
          justification: "Correctly calculated v_H(1) = −0.0996.",
          quote: "v_H(1) = −2e^(−3) = −0.0996.",
        },
      ],
    },
    {
      part: "(b)",
      earned: 0,
      outOf: 1,
      summary: "No response provided.",
      items: [
        {
          title: "Complete and correct response",
          earned: 0,
          outOf: 1,
          justification: "No relevant response provided.",
          quote: null,
        },
      ],
    },
  ],
};

export type DemoCard = { front: string; back: string };

/**
 * Real cards from the AcornPrep AP US History deck, captured verbatim on
 * 2026-08-30 — do not invent cards.
 */
export const CARDS: DemoCard[] = [
  {
    front: "What was the Columbian Exchange?",
    back: "The transatlantic transfer of plants, animals, diseases, and people between the Old World and New World after 1492.\n\nCrops: maize and potatoes went east; wheat and horses went west\nDiseases (smallpox, measles) devastated indigenous populations",
  },
  {
    front: "How did maize cultivation transform Native American societies?",
    back: "Maize enabled surplus agriculture, which led to:\n\nSedentary settlements and population growth\nDevelopment of complex societies (e.g., Mississippian, Pueblo)\nSocial hierarchies and specialized labor",
  },
  {
    front: "What was the encomienda system?",
    back: "A Spanish labor system granting colonists the right to demand tribute and forced labor from indigenous peoples.\n\nJustified by claims of Christianization\nLed to widespread exploitation and population decline\nEventually supplemented by African slave labor",
  },
];
