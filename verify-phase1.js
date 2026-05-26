#!/usr/bin/env node

/**
 * Phase 1 Verification Script
 * Checks if all required files and configurations are in place
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [];
let passCount = 0;
let failCount = 0;

function check(name, condition) {
  const result = condition();
  checks.push({ name, passed: result });
  if (result) {
    passCount++;
    console.log(`✅ ${name}`);
  } else {
    failCount++;
    console.log(`❌ ${name}`);
  }
  return result;
}

function fileExists(filePath) {
  return () => fs.existsSync(path.join(__dirname, filePath));
}

function dirExists(dirPath) {
  return () => fs.existsSync(path.join(__dirname, dirPath));
}

console.log('\n🔍 Phase 1 Verification\n');
console.log('=' .repeat(50));

console.log('\n📁 Directory Structure:');
check('Backend directory exists', dirExists('backend'));
check('Frontend directory exists', dirExists('frontend'));
check('Backend src directory exists', dirExists('backend/src'));
check('Frontend src directory exists', dirExists('frontend/src'));
check('Prisma directory exists', dirExists('backend/prisma'));

console.log('\n📄 Configuration Files:');
check('docker-compose.yml exists', fileExists('docker-compose.yml'));
check('Backend Dockerfile exists', fileExists('backend/Dockerfile'));
check('Backend .env exists', fileExists('backend/.env'));
check('Backend .env.example exists', fileExists('backend/.env.example'));
check('Frontend .env exists', fileExists('frontend/.env'));
check('Frontend .env.example exists', fileExists('frontend/.env.example'));
check('.gitignore exists', fileExists('.gitignore'));

console.log('\n🗄️ Database Files:');
check('Prisma schema exists', fileExists('backend/prisma/schema.prisma'));
check('Seed file exists', fileExists('backend/prisma/seed.js'));

console.log('\n⚙️ Backend Files:');
check('server.js exists', fileExists('backend/src/server.js'));
check('env.js exists', fileExists('backend/src/config/env.js'));
check('errorHandler.js exists', fileExists('backend/src/middleware/errorHandler.js'));
check('asyncHandler.js exists', fileExists('backend/src/middleware/asyncHandler.js'));
check('errors.js exists', fileExists('backend/src/utils/errors.js'));
check('Backend package.json exists', fileExists('backend/package.json'));

console.log('\n🎨 Frontend Files:');
check('index.html exists', fileExists('frontend/index.html'));
check('main.jsx exists', fileExists('frontend/src/main.jsx'));
check('App.jsx exists', fileExists('frontend/src/App.jsx'));
check('vite.config.js exists', fileExists('frontend/vite.config.js'));
check('tailwind.config.js exists', fileExists('frontend/tailwind.config.js'));
check('postcss.config.js exists', fileExists('frontend/postcss.config.js'));
check('Frontend package.json exists', fileExists('frontend/package.json'));

console.log('\n📚 Documentation:');
check('README.md exists', fileExists('README.md'));
check('Phase instructions exist', fileExists('SMARTEXPENSE_CLAUDE_CODE_PHASES.md'));

console.log('\n📦 Dependencies:');
check('Backend node_modules exists', dirExists('backend/node_modules'));
check('Frontend node_modules exists', dirExists('frontend/node_modules'));

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed`);

if (failCount === 0) {
  console.log('\n✅ Phase 1 verification PASSED! Ready for Phase 2.\n');
  process.exit(0);
} else {
  console.log('\n❌ Phase 1 verification FAILED. Please fix the issues above.\n');
  process.exit(1);
}
