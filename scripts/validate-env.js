const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const envExamplePath = path.join(projectRoot, '.env.example');
const envPath = path.join(projectRoot, '.env');

console.log('[Sanity Check] Running environment variable validation...');

if (!fs.existsSync(envExamplePath)) {
  console.error('Error: .env.example file not found in project root!');
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found in project root! Please copy .env.example to .env and fill in required values.');
  process.exit(1);
}

const parseEnvFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separatorIdx = trimmed.indexOf('=');
    if (separatorIdx === -1) return;
    const key = trimmed.substring(0, separatorIdx).trim();
    const value = trimmed.substring(separatorIdx + 1).trim();
    result[key] = value;
  });
  return result;
};

const exampleVars = parseEnvFile(envExamplePath);
const envVars = parseEnvFile(envPath);

let hasErrors = false;
let hasWarnings = false;

console.log('\n--- Variable Status Report ---');

Object.keys(exampleVars).forEach((key) => {
  if (!(key in envVars)) {
    console.error(`❌ ERROR: Key "${key}" is missing from .env!`);
    hasErrors = true;
  } else {
    const val = envVars[key];
    const isPlaceholder = val.includes('your_') || val.length === 0 || val === 'placeholder';
    if (isPlaceholder) {
      console.warn(`⚠️ WARNING: Key "${key}" appears to be a placeholder value: "${val}"`);
      hasWarnings = true;
    } else {
      console.log(`✅ OK: "${key}" is set.`);
    }
  }
});

console.log('\n-----------------------------');
if (hasErrors) {
  console.error('❌ Environment validation FAILED. Please configure all required keys in your .env file.');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('⚠️ Environment validation passed with warnings (some values appear to be placeholders).');
  process.exit(0);
} else {
  console.log('🎉 Environment validation passed successfully! All variables are set.');
  process.exit(0);
}
