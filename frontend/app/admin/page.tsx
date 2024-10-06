"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Report {
  id: number;
  title: string;
  description: string;
  reportReply: string;
  createdAt: string;
  // Add other fields as necessary
}

export default function Admin() {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-reports-from-area`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ area: "Kerala" }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports. Please try again later.");
      }
    };

    fetchReports();
  }, []);

  const handleCardClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!selectedReport) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ reportId: selectedReport.id, reply }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle successful reply submission (e.g., close modal, show success message)
      setIsModalOpen(false);
      setReply("");
    } catch (err) {
      console.error("Error submitting reply:", err);
      // Handle error (e.g., show error message)
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <h1 className="text-2xl mb-6 font-semibold tracking-tight">
          Reports from your area (Kerala)
        </h1>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="drop-shadow-md border cursor-pointer"
              onClick={() => handleCardClick(report)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm font-semibold mb-3 px-3 py-1 rounded-full inline-flex items-center ${
                      report.reportReply
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {report.reportReply ? "Resolved" : "Pending"}
                  </p>
                </div>

                <div className="text-sm font-bold">
                  {format(new Date(report.createdAt), "do MMMM yyyy, h:mm a")}
                </div>
                <CardTitle className="text-lg font-bold">
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{report.description}</p>
                {report.reportReply && (
                  <div className="mt-4">
                    <p className="text-md font-semibold">Admin Reply:</p>
                    <p>{report.reportReply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Report</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReplySubmit();
            }}
          >
            <div className="mb-4">
              <Textarea
                rows={6}
                placeholder="Your reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit Reply</Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
