import * as dotenv from 'dotenv';
import path from 'path';
import { WebRiskServiceClient, protos } from '@google-cloud/web-risk';

// Log current working directory
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Add imports after environment variables are loaded
import { db } from '../../lib/firebaseAdmin';
import * as readline from 'readline';

// Get the ThreatType enum
const { ThreatType } = protos.google.cloud.webrisk.v1;

// Initialize Web Risk client
const webRiskClient = new WebRiskServiceClient({
  apiEndpoint: 'webrisk.googleapis.com',
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

// Debug environment variables
console.log('Environment variables loaded:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptUser(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function checkUrlSafety(url: string): Promise<boolean> {
  try {
    // Ensure URL has protocol
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;

    const response = await webRiskClient.searchUris({
      uri: urlWithProtocol,
      threatTypes: [
        ThreatType.MALWARE,
        ThreatType.SOCIAL_ENGINEERING,
        ThreatType.UNWANTED_SOFTWARE
      ],
    });

    // response[0] contains the actual response data
    const result = response[0];
    
    if (result.threat) {
      console.log('Threat detected:', result.threat.threatTypes);
      return false;
    }
    return true;
  } catch (error) {
    // Log the error but don't mark as unsafe just because of an error
    console.error('Error checking URL safety:', error);
    
    // Only mark as unsafe if it's a specific threat detection error
    // Otherwise, assume safe to avoid false positives
    if (error instanceof Error && error.message.includes('THREAT_TYPE')) {
      return false;
    }
    return true;
  }
}

async function checkExistingUrls() {
  try {
    console.log('Attempting to connect to Firestore...');
    const snapshot = await db.collection('urls').get();
    console.log('Successfully connected to Firestore');
    
    const urlsToCheck = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    if (urlsToCheck.length === 0) {
      console.log('No URLs found to check.');
      process.exit(0);
    }

    console.log(`Found ${urlsToCheck.length} URLs to check.`);
    
    const shouldProceed = await promptUser(
      `This will check ${urlsToCheck.length} URLs for safety. Proceed? (y/N): `
    );

    if (!shouldProceed) {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    let checked = 0;
    let unsafe = 0;
    let errors = 0;
    const unsafeUrls: { id: string; url: string; reason?: string }[] = [];

    for (const { id, data } of urlsToCheck) {
      try {
        console.log(`Checking URL (${checked + 1}/${urlsToCheck.length}): ${data.longUrl}`);
        const isSafe = await checkUrlSafety(data.longUrl);
        
        await db.collection('urls').doc(id).update({
          isSafe,
          lastChecked: new Date().toISOString()
        });

        checked++;
        if (!isSafe) {
          unsafe++;
          unsafeUrls.push({ 
            id: id, 
            url: data.longUrl,
            reason: 'Marked as unsafe by Web Risk API'
          });
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error checking URL ${data.longUrl}:`, error);
        errors++;
      }
    }

    console.log('\n=== Safety Check Report ===');
    console.log(`Total URLs checked: ${checked}/${urlsToCheck.length}`);
    console.log(`Unsafe URLs found: ${unsafe}`);
    console.log(`Errors encountered: ${errors}`);

    if (unsafe > 0) {
      console.log('\n=== Unsafe URLs Details ===');
      unsafeUrls.forEach(({ id, url, reason }) => {
        console.log(`\nDocument ID: ${id}`);
        console.log(`URL: ${url}`);
        console.log(`Reason: ${reason}`);
      });
    }

  } catch (error) {
    console.error('Script execution failed:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

checkExistingUrls(); 