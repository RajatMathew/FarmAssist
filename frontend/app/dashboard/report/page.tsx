"use client";

import React, { useEffect, useState } from "react";
import NewReportDrawer from "@/app/components/NewReportDrawer";
import ReportListCard from "@/app/components/ReportListCard";

export default function Page() {
  const [reports, setReports] = useState([]);
  const [submitCount, setSubmitCount] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token"); // Assuming the JWT is stored in localStorage

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/report`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchReports();
  }, [submitCount]);

  return (
    <>
      <div>
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Reports</h2>
          <div className="flex gap-2">
            <NewReportDrawer
              submitCount={submitCount}
              setSubmitCount={setSubmitCount}
            />
          </div>
        </div>

        <div>
          <h3 className="mt-4 mb-4">Here are your reports</h3>
          <div className="flex flex-col gap-3">
            {reports.map((report) => (
              <ReportListCard report={report} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
