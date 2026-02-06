import RealityLoopClient from '@/components/reality-loop/reality-loop-client';
import Logo from '@/components/icons/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">RealityLoop</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <RealityLoopClient />
      </main>
      <footer className="border-t py-6 md:px-8">
        <div className="container flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-balance text-sm leading-loose text-muted-foreground">
            Powered by the Gemini 3 API &middot; Built with Next.js, Genkit &amp; shadcn/ui
          </p>
          <p className="text-balance max-w-2xl text-xs text-muted-foreground/80">
            RealityLoop is a new application for the Gemini 3 Hackathon, exploring human-in-the-loop belief revision.
          </p>
        </div>
      </footer>
    </div>
  );
}
