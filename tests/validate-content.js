const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(process.cwd(), "src", "data");
const publicDirectory = path.join(process.cwd(), "public");
const dataFiles = fs
  .readdirSync(dataDirectory)
  .filter((filename) => filename.endsWith(".json"))
  .sort();

let errors = 0;
let warnings = 0;
let eventCount = 0;

function report(message) {
  console.error(`❌ ${message}`);
  errors += 1;
}

for (const filename of dataFiles) {
  const filePath = path.join(dataDirectory, filename);
  const events = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!Array.isArray(events)) {
    report(`${filename} must contain an array`);
    continue;
  }

  events.forEach((event, index) => {
    eventCount += 1;
    const location = `${filename}[${index}]`;

    for (const field of [
      "name",
      "description",
      "start_date",
      "end_date",
      "photo_url",
    ]) {
      if (typeof event[field] !== "string" || event[field].trim() === "") {
        report(`${location} is missing a valid ${field}`);
      }
    }

    if (typeof event.photo_url === "string") {
      const publicPath = event.photo_url.replace(/^\.\//, "");
      if (!fs.existsSync(path.join(publicDirectory, publicPath))) {
        console.warn(`⚠️  ${location} references a missing image: ${event.photo_url}`);
        warnings += 1;
      }
    }

    if (event.geometry) {
      const coordinates = event.geometry.coordinates;
      if (
        event.geometry.type !== "Point" ||
        !coordinates ||
        !Number.isFinite(coordinates.lat) ||
        !Number.isFinite(coordinates.lng) ||
        coordinates.lat < -90 ||
        coordinates.lat > 90 ||
        coordinates.lng < -180 ||
        coordinates.lng > 180
      ) {
        report(`${location} has invalid GeoJSON-style coordinates`);
      }
    }
  });
}

if (errors > 0) {
  console.error(`\nContent validation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(
  `✓ Content validation passed for ${eventCount} events in ${dataFiles.length} files` +
    (warnings ? ` with ${warnings} warning(s).` : "."),
);
