interface SectionHeadingProps {
  children: React.ReactNode;
}

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h4 className="text-lg font-semibold text-zinc-300 mb-3">{children}</h4>
  );
}
