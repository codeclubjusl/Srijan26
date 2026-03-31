const fs = require('fs');
const path = require('path');

async function clearCaches() {
  try {
    console.log("purging caches...");
    const cacheDir = path.join(process.cwd(), '.next', 'cache', 'fetch-cache');

    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log("Next.js fetch cache explicitly purged!");
    } else {
      console.log("No fetch cache found to clear.");
    }
  } catch (error) {
    console.error("Failed to clear cache folders:", error);
    process.exit(1);
  }
}

clearCaches();
