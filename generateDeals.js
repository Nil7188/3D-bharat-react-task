
const fs = require("fs");

const companies = [
  "NovaTech",
  "GreenGrid",
  "FinEdge",
  "MediCore",
  "AgriNext",
  "CloudMatrix",
  "QuantumSoft",
  "SolarX",
  "UrbanTech",
  "DataSphere",
];

const industries = [
  "AI",
  "Fintech",
  "Healthcare",
  "Energy",
  "Agriculture",
  "SaaS",
  "Cybersecurity",
  "EV",
];

const risks = ["Low", "Medium", "High"];

const deals = [];

for (let i = 1; i <= 100; i++) {
  const industry =
    industries[(i - 1) % industries.length];

  const risk =
    risks[(i - 1) % risks.length];

  const roi = 8 + ((i * 7) % 25);

  const investment =
    200000 + ((i * 137000) % 1800000);

  const funding =
    1000000 + ((i * 325000) % 9000000);

  deals.push({
    id: i,
    company: `${companies[(i - 1) % companies.length]} ${i}`,
    industry: industry,
    risk: risk,
    roi: roi,
    investment: investment,
    funding: funding,
    status: i % 5 === 0 ? "Closed" : "Active",
    founded: 2015 + (i % 10),
    investors: 5 + (i % 20),
    description:
      `High-potential ${industry} company focused on scalable technology and long-term growth.`,
  });
}

fs.writeFileSync(
  "./data/deals.json",
  JSON.stringify(deals, null, 2)
);

console.log("100 deals generated successfully.");