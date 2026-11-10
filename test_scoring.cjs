// Standalone validation of Part 12 scoring rules

function calculateQuestionSimilarity(ansA, ansB) {
  const diff = Math.abs(ansA - ansB);
  return ((4 - diff) / 4) * 100;
}

console.log('--- SCENARIO H: Testing Individual Question Similarities ---');
const tests = [
  { a: 5, b: 5, expected: 100 },
  { a: 4, b: 4, expected: 100 },
  { a: 5, b: 4, expected: 75 },
  { a: 4, b: 5, expected: 75 },
  { a: 5, b: 3, expected: 50 },
  { a: 3, b: 5, expected: 50 },
  { a: 5, b: 2, expected: 25 },
  { a: 1, b: 4, expected: 25 },
  { a: 5, b: 1, expected: 0 },
  { a: 1, b: 5, expected: 0 },
];

let allPassed = true;
for (const t of tests) {
  const result = calculateQuestionSimilarity(t.a, t.b);
  const pass = result === t.expected;
  if (!pass) allPassed = false;
  console.log(`A=${t.a}, B=${t.b} -> Got ${result}%, Expected ${t.expected}%: ${pass ? 'PASS' : 'FAIL'}`);
}

console.log('\n--- Testing Equal-Weight Across 7 Categories ---');
const catScores = [100, 100, 50, 50, 50, 50, 50];
const unweightedAvg = Math.round(catScores.reduce((a, b) => a + b, 0) / 7);
console.log(`Unweighted Category Average: ${unweightedAvg}% (Expected 64%)`);
if (unweightedAvg === 64 && allPassed) {
  console.log('\n>>> ALL SCORING ENGINE TESTS PASSED! <<<');
} else {
  console.error('\n>>> SCORING TEST FAILED <<<');
  process.exit(1);
}
