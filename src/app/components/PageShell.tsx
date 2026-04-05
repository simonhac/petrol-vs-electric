import Nav from "./Nav";

interface PageShellProps {
  maxWidth: string;
  children: React.ReactNode;
}

export default function PageShell({ maxWidth, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full" style={{ maxWidth }}>
        {children}
        <Nav />
      </div>
    </div>
  );
}
