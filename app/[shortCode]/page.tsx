import { redirect } from 'next/navigation';
import { db } from '@/lib/firebaseAdmin';
import React from 'react';

interface Props {
  params: {
    shortCode: string;
  };
}

export default async function ShortCodePage({ params }: Props) {
  const { shortCode } = params;
  console.log(`Attempting to resolve shortCode: ${shortCode}`);

  let longUrl: string | undefined;

  try {
    const docRef = db.collection('urls').doc(shortCode);
    const docSnap = await docRef.get();

    console.log(`Document exists: ${docSnap.exists}`);
    if (!docSnap.exists) {
      return <p>Short URL not found</p>;
    }

    const data = docSnap.data();
    longUrl = data?.longUrl;
    console.log(`Resolved longUrl: ${longUrl}`);

    if (!longUrl) {
      return <p>Invalid short URL</p>;
    }
  } catch (error) {
    console.error('Error fetching short URL:', error);
    return <p>An error occurred</p>;
  }

  const finalUrl = longUrl.startsWith('http') ? longUrl : `https://${longUrl}`;
  console.log(`Redirecting to: ${finalUrl}`);
  redirect(finalUrl);
}
