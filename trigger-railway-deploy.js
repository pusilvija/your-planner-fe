// This script triggers a redeploy of a Railway service instance using the Railway GraphQL API.
const fetch = require('node-fetch');

const TOKEN = process.argv[2];
const ENVIRONMENT_ID = process.argv[3];
const SERVICE_ID = process.argv[4];

if (!TOKEN || !ENVIRONMENT_ID || !SERVICE_ID) {
  console.error("Usage: node trigger-railway-deploy.js <RAILWAY_API_TOKEN> <RAILWAY_ENVIRONMENT_ID> <RAILWAY_SERVICE_ID>");
  process.exit(1);
}

(async () => {
  try {
    const resp = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          mutation ServiceInstanceRedeploy {
            serviceInstanceRedeploy(
              environmentId: "${ENVIRONMENT_ID}"
              serviceId: "${SERVICE_ID}"
            )
          }
        `
      }),
    });

    const data = await resp.json();

    if (data.errors) {
      console.error("Railway API returned errors:", data.errors);
      process.exit(1);
    }

    console.log("Railway redeploy triggered successfully:", data);
  } catch (error) {
    console.error("Failed to trigger Railway redeploy:", error);
    process.exit(1);
  }
})();
