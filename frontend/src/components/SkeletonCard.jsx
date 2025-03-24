export default function SkeletonCard({ className }) {
  return (
    <div
      className={`p-8 bg-gray-900 text-white shadow-md rounded-3xl ${className}`}
    >
      <div className="h-6 bg-gray-800 rounded-3xl w-1/2 mb-4 animate-pulse"></div>
      <div className="h-8 bg-gray-800 rounded-3xl w-full mb-2 animate-pulse"></div>
    </div>
  );
}
