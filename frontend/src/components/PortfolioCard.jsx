export default function PortfolioCard({
  title,
  value,
  tradesCount,
  className,
  titleClassName,
}) {
  return (
    <div
      className={
        "p-8 bg-gray-900 text-white shadow-md rounded-3xl" +
        (className ? " " + className : "")
      }
    >
      <h2 className={"text-lg" + (titleClassName ? " " + titleClassName : "")}>
        {title}
      </h2>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
