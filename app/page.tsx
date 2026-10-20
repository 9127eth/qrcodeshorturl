import Link from "next/link";
import { Eraser, Nfc, PenLine, ScanLine } from "lucide-react";
import InfoSection from "@/components/InfoSection";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/qrsu-io-qr-url-nfc-tools/id6736601368";

const nfcTools = [
  {
    icon: ScanLine,
    title: "Read a tag",
    body: "Hold your iPhone to an NFC tag and see what is already stored on it.",
  },
  {
    icon: PenLine,
    title: "Write a tag",
    body: "Save a link onto a blank or reusable tag. If you leave off the protocol, the app adds https:// for you.",
  },
  {
    icon: Eraser,
    title: "Erase a tag",
    body: "Clear a tag when you want to reuse it for something else.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-8 pt-10 sm:pt-16">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          qrsu.io for iPhone
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Read, write, and erase NFC tags
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          The qrsu.io app puts NFC tools in your pocket. Tap a tag to see what is on it, write a link, or clear it and start over.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <Nfc className="mr-2 h-5 w-5" />
              Download on the App Store
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Free for iPhone and iPad. NFC tools require an iPhone on iOS 17.6 or later.
          </p>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
        {nfcTools.map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-xl border bg-card p-6 text-left">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-3xl rounded-xl border px-6 py-8 text-center sm:mt-20">
        <h2 className="text-2xl font-semibold">Make a QR code</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Create a QR code here and download it. New short links are created in the app. Links that already exist keep working.
        </p>
        <div className="mt-6">
          <QRCodeGenerator />
        </div>
      </section>

      <InfoSection />
    </div>
  );
}
