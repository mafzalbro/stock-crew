import Link from "next/link";

export default function ButtonLink({ href, children, className }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 border border-gray-900 hover:border-gray-800 rounded-3xl py-2 px-4 transition-all duration-200 ${className}`}
    >
      {children}
    </Link>
  );
}
