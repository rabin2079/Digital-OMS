import PublicLayout from "./PublicLayout";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{intro}</p>
        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-slate-900">{s.title}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-xs text-slate-400">Last updated: July 2026</p>
      </div>
    </PublicLayout>
  );
}
