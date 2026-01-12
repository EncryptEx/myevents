const fs = require('fs');
const path = require('path');

// Function to find actual line numbers for each event in the JSON file
function findEventLineNumbers(filePath, events) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const eventLineNumbers = [];
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    // Look for the event name in the file to find its line number
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      if (lines[lineIndex].includes(`"name": "${event.name}"`) || 
          lines[lineIndex].includes(`"name":"${event.name}"`)) {
        eventLineNumbers[i] = lineIndex + 1; // 1-based line numbers
        break;
      }
    }
    
    // If name not found, try to find by start_date
    if (!eventLineNumbers[i] && event.start_date) {
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (lines[lineIndex].includes(`"start_date": "${event.start_date}"`) || 
            lines[lineIndex].includes(`"start_date":"${event.start_date}"`)) {
          eventLineNumbers[i] = lineIndex + 1;
          break;
        }
      }
    }
    
    // Fallback: estimate if still not found
    if (!eventLineNumbers[i]) {
      eventLineNumbers[i] = Math.floor(2 + (i * 12));
    }
  }
  
  return eventLineNumbers;
}

// Function to parse DD-MM-YYYY date format
function parseDate(dateString) {
  const cleanDate = dateString.split(' ')[0]; // Remove time part
  const [day, month, year] = cleanDate.split('-');
  return new Date(year, month - 1, day);
}

// Function to validate date ordering in a JSON file
function validateJsonFile(filePath) {
  console.log(`\nValidating ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const events = JSON.parse(content);
    
    if (!Array.isArray(events)) {
      console.log(`✓ ${filePath}: Not an array, skipping validation`);
      return true;
    }
    
    // Get actual line numbers for each event
    const eventLineNumbers = findEventLineNumbers(filePath, events);
    
    let hasErrors = false;
    let previousDate = null;
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      if (!event.start_date) {
        const lineNumber = eventLineNumbers[i];
        console.log(`⚠️  ${filePath}:${lineNumber} Event at index ${i} missing start_date`);
        continue;
      }
      
      try {
        const currentDate = parseDate(event.start_date);
        
        // Check if date is valid
        if (isNaN(currentDate.getTime())) {
          const lineNumber = eventLineNumbers[i];
          console.log(`❌ ${filePath}:${lineNumber} Invalid date format at index ${i}: "${event.start_date}"`);
          hasErrors = true;
          continue;
        }
        
        // Check chronological order (events should be in ascending order by start_date)
        if (previousDate && currentDate < previousDate) { // check all are new >= old, else error
          const lineNumber = eventLineNumbers[i];
          console.log(`❌ ${filePath}:${lineNumber} Date out of order at index ${i}`);
          console.log(`   Previous: ${events[i-1].start_date} (${previousDate.toDateString()})`);
          console.log(`   Current:  ${event.start_date} (${currentDate.toDateString()})`);
          console.log(`   Event: ${event.name}`);
          hasErrors = true;
        }
        
        // Validate end_date if present (start_date must be <= end_date)
        if (event.end_date) {
          const endDate = parseDate(event.end_date);
          if (isNaN(endDate.getTime())) {
            const lineNumber = eventLineNumbers[i];
            console.log(`❌ ${filePath}:${lineNumber} Invalid end_date format at index ${i}: "${event.end_date}"`);
            hasErrors = true;
          } else if (endDate < currentDate) {
            const lineNumber = eventLineNumbers[i];
            console.log(`❌ ${filePath}:${lineNumber} End date before start date at index ${i}`);
            console.log(`   Start: ${event.start_date} (${currentDate.toDateString()})`);
            console.log(`   End:   ${event.end_date} (${endDate.toDateString()})`);
            console.log(`   Event: ${event.name}`);
            hasErrors = true;
          }
        }
        
        previousDate = currentDate;
        
      } catch (error) {
        const lineNumber = eventLineNumbers[i];
        console.log(`❌ ${filePath}:${lineNumber} Error parsing date at index ${i}: ${error.message}`);
        hasErrors = true;
      }
    }
    
    if (!hasErrors) {
      console.log(`✓ ${filePath}: All dates are correctly ordered (${events.length} events)`);
    }
    
    return !hasErrors;
    
  } catch (error) {
    console.log(`❌ ${filePath}: Error reading or parsing file: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🗓️  Starting date validation check...');
console.log('====================================');

const dataDir = 'src/data';
const jsonFiles = [
  'attended_competitions.json',
  'attended_congresses.json',
  'attended_hackathons.json',
  'mentored_hackathons.json',
  'organized_hackathons.json'
];

let allValid = true;
let totalFiles = 0;
let validFiles = 0;

for (const filename of jsonFiles) {
  const filePath = path.join(dataDir, filename);
  
  if (fs.existsSync(filePath)) {
    totalFiles++;
    const isValid = validateJsonFile(filePath);
    if (isValid) {
      validFiles++;
    } else {
      allValid = false;
    }
  } else {
    console.log(`⚠️  ${filePath}: File not found, skipping`);
  }
}

console.log('\n====================================');
console.log('📊 Summary:');
console.log(`   Total files checked: ${totalFiles}`);
console.log(`   Valid files: ${validFiles}`);
console.log(`   Files with errors: ${totalFiles - validFiles}`);

if (allValid) {
  console.log('✅ All JSON files have correctly ordered dates!');
  process.exit(0);
} else {
  console.log('❌ Some JSON files have date ordering issues!');
  console.log('\n💡 Common issues to check:');
  console.log('   - Wrong date format (should be DD-MM-YYYY)');
  console.log('   - Events not sorted chronologically');
  console.log('   - End date before start date');
  console.log('   - Invalid dates (e.g., 32-01-2024)');
  process.exit(1);
}