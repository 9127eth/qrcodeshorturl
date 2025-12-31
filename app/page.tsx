import QRCodeGenerator from "@/components/QRCodeGenerator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-16">
      <div className="w-full max-w-2xl mx-auto mb-8 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Free QR Code Generator & URL Shortener</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Create QR codes and shorten URLs instantly with qrsu.io - the fastest, most secure way to share links.
        </p>
        <p className="text-lg text-muted-foreground">
          Generate custom QR codes, create short URLs, and share them safely. No registration required!
        </p>
      </div>
      <QRCodeGenerator />
    </main>
  );
}
