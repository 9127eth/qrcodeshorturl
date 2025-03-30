import * as dotenv from 'dotenv';
import path from 'path';

// Log current working directory
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Add existing imports and code here
import { db } from '../../lib/firebaseAdmin';
import * as readline from 'readline';
import * as admin from 'firebase-admin';

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

async function deleteUnsafeUrls() {
  const unsafeDomains = ['los-gsp.online', 'contabostorage.com'];
  
  try {
    console.log('Attempting to connect to Firestore...');
    // First, count and show the affected URLs
    const snapshot = await db.collection('urls').get();
    console.log('Successfully connected to Firestore');
    
    const unsafeUrls: { id: string, url: string, domain: string }[] = [];
    
    snapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.longUrl) {
        // Check against all unsafe domains
        for (const domain of unsafeDomains) {
          if (data.longUrl.includes(domain)) {
            unsafeUrls.push({ 
              id: doc.id, 
              url: data.longUrl,
              domain: domain  // Track which domain matched
            });
            break;  // No need to check other domains if one matches
          }
        }
      }
    });

    if (unsafeUrls.length === 0) {
      console.log('No unsafe URLs found.');
      process.exit(0);
    }

    // Show the URLs that will be deleted
    console.log('\nThe following URLs will be deleted:');
    unsafeUrls.forEach(({ id, url, domain }) => {
      console.log(`${id} -> ${url} (matches unsafe domain: ${domain})`);
    });
    console.log(`\nTotal URLs to delete: ${unsafeUrls.length}`);

    // Ask for confirmation
    const shouldProceed = await promptUser('\nAre you sure you want to delete these URLs? (y/N): ');

    if (!shouldProceed) {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    // Proceed with deletion
    const batch = db.batch();
    unsafeUrls.forEach(({ id }) => {
      batch.delete(db.collection('urls').doc(id));
    });
    
    await batch.commit();
    console.log(`\nSuccessfully deleted ${unsafeUrls.length} unsafe URLs`);
    
  } catch (error) {
    console.error('Error deleting unsafe URLs:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

deleteUnsafeUrls();