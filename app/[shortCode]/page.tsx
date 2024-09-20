import { redirect } from 'next/navigation';
import { db } from '@/lib/firebaseAdmin';

interface Props {
  params: {
    shortCode: string;
  };
}

export default async function ShortCodePage({ params }: Props) {
  const { shortCode } = params;
  console.log(`Attempting to resolve shortCode: ${shortCode}`);

  try {
    const docRef = db.collection('urls').doc(shortCode);
    const docSnap = await docRef.get();

    console.log(`Document exists: ${docSnap.exists}`);
    if (docSnap.exists) {
      const data = docSnap.data();
      const longUrl = data?.longUrl;
      console.log(`Resolved longUrl: ${longUrl}`);

      if (longUrl) {
        console.log(`Redirecting to: ${longUrl}`);
        redirect(longUrl);
      } else {
        return <p>Invalid short URL</p>;
      }
    } else {
      return <p>Short URL not found</p>;
    }
  } catch (error) {
    console.error('Error fetching short URL:', error);
    return <p>An error occurred</p>;
  }
}
