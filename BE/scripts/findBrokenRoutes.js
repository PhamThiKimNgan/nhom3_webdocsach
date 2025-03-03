/**
 * Script to find broken routes in the Express application
 */
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

// Find all route files in the project
function findRouteFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      findRouteFiles(filePath, fileList);
    } else if ((file.includes('route') || file.includes('router')) && file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check route files for common issues
function checkRouteFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for route definitions potentially missing callbacks
    if (line.match(/router\.(get|post|put|delete|patch)\s*\(\s*['"`][^'"`]+['"`]/)) {
      // Check if the next line has closing parenthesis without a callback
      if (lines[i+1] && lines[i+1].match(/\s*\)\s*;/)) {
        issues.push({
          line: i + 1,
          text: line,
          issue: 'Potential missing callback function'
        });
      }
      
      // Check for undefined or null references
      if (line.match(/,\s*(undefined|null)/)) {
        issues.push({
          line: i + 1,
          text: line,
          issue: 'Explicit undefined or null handler reference'
        });
      }
    }
  }
  
  return issues;
}

// Main function
function findBrokenRoutes() {
  const rootDir = resolve(__dirname, '..');
  const routeFiles = findRouteFiles(rootDir);
  
  console.log(`Found ${routeFiles.length} potential route files to check`);
  
  let hasIssues = false;
  
  routeFiles.forEach(file => {
    const issues = checkRouteFile(file);
    
    if (issues.length > 0) {
      hasIssues = true;
      console.log(`\n⚠️ Issues found in ${file}:`);
      
      issues.forEach(issue => {
        console.log(`  Line ${issue.line}: ${issue.issue}`);
        console.log(`  ${issue.text.trim()}`);
      });
    }
  });
  
  if (!hasIssues) {
    console.log('No obvious route handler issues found.');
    console.log('Check manually for variables that may be undefined at runtime.');
  }
}

findBrokenRoutes();
