import { PropsWithChildren } from "react";

type AppShellProps = PropsWithChildren<{
  title: string;
}>;

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
