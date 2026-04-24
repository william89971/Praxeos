import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="mx-auto flex min-h-dvh flex-col items-center justify-center px-[var(--gutter-inline)] text-center"
      style={{ maxWidth: "var(--measure-prose)" }}
    >
      <p className="label-mono" style={{ marginBottom: "1rem" }}>
        404
      </p>
      <h1 style={{ marginBottom: "1rem" }}>Not found.</h1>
      <p
        className="italic"
        style={{
          fontSize: "var(--step-1)",
          color: "var(--ink-secondary)",
          marginBottom: "3rem",
          maxWidth: "48ch",
        }}
      >
        Every purposive action aims at an end. The page you sought is not among the ends
        we have supplied.
      </p>
      <Link href="/" className="label-mono">
        ← Return home
      </Link>
    </div>
  );
}
