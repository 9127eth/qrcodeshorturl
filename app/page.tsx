import QRCodeGenerator from "@/components/QRCodeGenerator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-16">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">The best QR Code/Short URL generator ever.</h1>
        <p className="text-xl text-muted-foreground">Generate a QR code and a short URL for any website.</p>
      </div>
      <QRCodeGenerator />
    </main>
  );
}
