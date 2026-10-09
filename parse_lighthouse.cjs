const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./lighthouse.json', 'utf8'));

const scores = {
  Performance: data.categories.performance.score * 100,
  Accessibility: data.categories.accessibility.score * 100,
  BestPractices: data.categories['best-practices'].score * 100,
  SEO: data.categories.seo.score * 100
};

console.log("=== LIGHTHOUSE SCORES ===");
for (const [key, value] of Object.entries(scores)) {
  console.log(`${key}: ${value}`);
}

const auditErrors = Object.values(data.audits)
  .filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative');

if (auditErrors.length > 0) {
  console.log("\n=== AREAS FOR IMPROVEMENT ===");
  auditErrors.forEach(a => console.log(`- ${a.title} (${a.id})`));
}
