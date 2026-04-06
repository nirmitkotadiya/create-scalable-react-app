const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');

// We use the compiled dist because `generateProject` might be requested natively via TS, 
// using compiled dist is much safer.
const { generateProject } = require('../dist/src/index.js');

const buildDir = path.join(process.cwd(), '.test-builds');

// The Matrix Combinations
const tests = [
  {
    desc: 'Fully Loaded (React 19 + TS + Tailwind + Redux + Router + Feature + Testing + Eslint)',
    options: { projectName: 'app-1', language: 'ts', state: 'redux', tailwind: true, router: true, eslint: true, testing: true, structure: 'feature' }
  },
  {
    desc: 'Minimal App (React 19 + JS + Native CSS + Flat)',
    options: { projectName: 'app-2', language: 'js', state: 'none', tailwind: false, router: false, eslint: false, testing: false, structure: 'flat' }
  },
  {
    desc: 'Zustand Native Struct (React 19 + TS + Zustand + TailWind + Flat)',
    options: { projectName: 'app-3', language: 'ts', state: 'zustand', tailwind: true, router: true, eslint: false, testing: true, structure: 'flat' }
  }
];

const runChecks = () => {
    console.log('\n=====================================');
    console.log('🧪 Starting Automatic Permutation Test');
    console.log('=====================================\n');

    if (fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true, force: true });
    }
    fs.mkdirSync(buildDir, { recursive: true });

    let hasErrors = false;

    for (let test of tests) {
        console.log(`\n---------------------------------`);
        console.log(`🚀 Testing: ${test.desc}`);
        const dest = path.join(buildDir, test.options.projectName);

        try {
            // Provide the compiled dir context
            generateProject(test.options, dest, path.resolve(process.cwd(), 'dist/src'));
            console.log(`✔️  Scaffolded layout correctly.`);
            
            // Validate via npm dependencies locally
            console.log(`📦 Running npm install... (This will take a bit)`);
            execSync('npm install --legacy-peer-deps', { cwd: dest, stdio: 'ignore' });
            
            // Native Build Command Testing
            console.log(`🔨 Executing application build...`);
            execSync('npm run build', { cwd: dest, stdio: 'ignore' });
            
            console.log(`✔️  PASSED!`);
        } catch (e) {
            console.error(`❌ FAILED: ${test.desc}`);
            console.error(e);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        console.error('\n❌ Tests concluded with critical errors!');
        process.exit(1);
    } else {
        console.log('\n✅ All permutations successfully generated and built natively!');
        process.exit(0);
    }
}

runChecks();
