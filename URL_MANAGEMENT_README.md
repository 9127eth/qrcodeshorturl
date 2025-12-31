# URL Management Scripts

This document provides a quick reference for all URL management scripts in this project. These scripts help maintain the safety and integrity of URLs stored in your Firestore database.

## Available Scripts

### 1. Check URL Safety
**Command:** `npm run check-urls`
**Script:** `app/scripts/checkExistingUrls.ts`

**What it does:**
- Scans all URLs in your Firestore database
- Checks each URL against Google's Web Risk API for malware, social engineering, and unwanted software
- Updates each URL's safety status (`isSafe: true/false`) and `lastChecked` timestamp
- Provides a detailed report of unsafe URLs found

**Usage:**
```bash
npm run check-urls
```

**Prerequisites:**
- Google Web Risk API credentials configured in `.env.local`
- Firebase Admin SDK configured

---

### 2. Delete URLs by Domain
**Command:** `npm run delete-unsafe`
**Script:** `app/scripts/deleteUnsafeUrls.ts`

**What it does:**
- Searches for URLs containing specific unsafe domains
- Currently configured to find URLs containing:
  - `los-gsp.online`
  - `contabostorage.com`
- Shows all matching URLs before deletion
- Permanently deletes matching URLs from the database

**Usage:**
```bash
npm run delete-unsafe
```

**Note:** This script targets specific domains. To add more domains, edit the `unsafeDomains` array in the script.

---

### 3. Delete URLs Marked as Unsafe
**Command:** `npm run delete-unsafe-marked`
**Script:** `app/scripts/deleteUnsafeMarkedUrls.ts`

**What it does:**
- Finds all URLs that have been marked as unsafe (`isSafe: false`)
- Typically used after running the safety check script
- Shows detailed information about each unsafe URL
- Permanently deletes all URLs marked as unsafe

**Usage:**
```bash
npm run delete-unsafe-marked
```

**Best Practice:** Run `npm run check-urls` first to identify unsafe URLs, then use this command to clean them up.

---

### 4. Revert Safety Flags
**Command:** `npm run revert-safety`
**Script:** `app/scripts/revertSafetyFlags.ts`

**What it does:**
- Resets all URLs to be marked as safe (`isSafe: true`)
- Clears the `lastChecked` timestamp for all URLs
- Useful for starting fresh with safety checks

**Usage:**
```bash
npm run revert-safety
```

**Warning:** This will mark ALL URLs as safe, regardless of their actual safety status.

---

## Recommended Workflow

### Regular Maintenance (Every 3 days)
1. **Check URL Safety:**
   ```bash
   npm run check-urls
   ```

2. **Review and Delete Unsafe URLs:**
   ```bash
   npm run delete-unsafe-marked
   ```

### Emergency Cleanup (When you discover a new unsafe domain)
1. **Add the domain to the deleteUnsafeUrls.ts script**
2. **Delete URLs containing the unsafe domain:**
   ```bash
   npm run delete-unsafe
   ```

### Fresh Start (Reset all safety flags)
1. **Reset all safety flags:**
   ```bash
   npm run revert-safety
   ```

2. **Run fresh safety check:**
   ```bash
   npm run check-urls
   ```

---

## Prerequisites

Before running any scripts, ensure you have:

1. **Environment Variables** in `.env.local`:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY=your-private-key
   ```

2. **Dependencies Installed:**
   ```bash
   npm install
   ```

3. **Proper Firebase Permissions:**
   - Firestore read/write access
   - Web Risk API enabled (for check-urls script)

---

## Cost Considerations

- **Firestore Operations:** Each script performs database reads/writes/deletes
- **Web Risk API:** The `check-urls` script makes API calls to Google's Web Risk service
- **Free Tier Limits:** 
  - Firestore: 50K reads, 20K writes, 20K deletes per day
  - Web Risk API: 100K lookups per month

---

## Safety Notes

⚠️ **Important:** All deletion operations are permanent and cannot be undone.

- Always review the list of URLs before confirming deletion
- Consider backing up your database before running bulk operations
- Test scripts on a development database first
- Monitor costs if you have a large number of URLs

---

## Troubleshooting

### Common Issues:

1. **"Cannot connect to Firestore"**
   - Check your Firebase credentials in `.env.local`
   - Verify your service account has proper permissions

2. **"Web Risk API errors"**
   - Ensure the Web Risk API is enabled in your Google Cloud Console
   - Check your API quotas and billing

3. **"Module not found" errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that TypeScript is properly configured

### Getting Help:
- Check the Firebase Console for detailed error logs
- Review the script output for specific error messages
- Verify your environment variables are correctly set 