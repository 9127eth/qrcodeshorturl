import * as dotenv from 'dotenv';
import path from 'path';

// Log current working directory
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Add imports after environment variables are loaded
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

async function revertSafetyFlags() {
  try {
    console.log('Attempting to connect to Firestore...');
    const snapshot = await db.collection('urls').get();
    console.log('Successfully connected to Firestore');
    
    const urlsToUpdate = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    console.log(`Found ${urlsToUpdate.length} URLs to revert.`);
    
    const shouldProceed = await promptUser(
      `This will revert safety flags for ${urlsToUpdate.length} URLs. Proceed? (y/N): `
    );

    if (!shouldProceed) {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    const batch = db.batch();
    let count = 0;

    urlsToUpdate.forEach(({ id }) => {
      batch.update(db.collection('urls').doc(id), {
        isSafe: true,
        lastChecked: null
      });
      count++;
    });
    
    await batch.commit();
    console.log(`\nSuccessfully reverted ${count} URLs`);
    
  } catch (error) {
    console.error('Error reverting safety flags:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

revertSafetyFlags(); 