import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black/10 backdrop-blur-sm sticky top-0 p-8 text-lg z-50 text-white flex justify-between">
      <Link href={"/dashboard"} passHref>
        <h2 className="text-xl">Stock Crew</h2>
      </Link>
      <ul className="text-sm flex gap-4 items-center">
        <li className="text-gray-300 hover:text-gray-200">
          <Link href={"/dashboard"}>Dashboard</Link>
        </li>
        <li className="text-gray-300 hover:text-gray-200">
          <Link href={"/dashboard/trades"}>Trades</Link>
        </li>
        <li className="text-gray-300 hover:text-gray-200">
          <Link href={"/dashboard/portfolio"}>Portfolios</Link>
        </li>
      </ul>
      {/* <button className="bg-white text-blue-600 px-4 py-2 rounded">Logout</button> */}
    </nav>
  );
}
