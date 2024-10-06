import { format } from "date-fns";

interface ReportListCardProps {
  report: {
    id: number;
    title: string;
    description: string;
    image?: string;
    createdAt: string;
    reportReply?: string;
  };
}

export default function ReportListCard({ report }: ReportListCardProps) {
  const formattedDate = format(
    new Date(report.createdAt),
    "do MMMM yyyy, h:mm a"
  );

  return (
    <>
      <div
        className={` p-5 rounded-md border drop-shadow-sm ${
          report.reportReply
            ? "border-gray-200 bg-white"
            : "border border-yellow-300 bg-yellow-50"
        }`}
        key={report.id}
      >
        <p
          className={`text-sm font-semibold mb-3 px-3 py-1 rounded-full inline-block ${
            report.reportReply
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {report.reportReply ? "Resolved" : "Pending"}
        </p>
        <p className="text-sm text-gray-500 mb-2">{`${formattedDate}`}</p>

        <h4 className="text-xl font-semibold">{report.title}</h4>
        <p>{report.description}</p>
        {report.image && <img src={report.image} alt={report.title} />}
        {report.reportReply && (
          <div className="mt-4">
            <p className="text-md font-semibold">Admin Reply:</p>
            <p>{report.reportReply}</p>
          </div>
        )}
      </div>
    </>
  );
}
