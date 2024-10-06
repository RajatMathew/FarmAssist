"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, setDate } from "date-fns";

// Initialize Supabase client
const supabase = createClient(
  "https://blkhwqntkgqobaxyoedt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2h3cW50a2dxb2JheHlvZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxOTE4NjQsImV4cCI6MjA0Mzc2Nzg2NH0.habLzPKCKj44OyxCIXUWmuDObZpF9s33Gy9FNAPZKDQ"
);

const NPKDataCard = () => {
  const [data, setData] = useState({
    n: 0,
    p: 0,
    k: 0,
    sm: 0,
    ph: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("data_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "npkreal" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.new) {
            const newData = payload.new as Partial<Data>;
            setData((prevData) => ({
              ...prevData,
              ...newData,
            }));
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("npkreal")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } else if (data && data.length > 0) {
      console.log("Fetched initial data:", data[0]);
      setData(data[0]);

      const formattedDate = format(
        new Date(data[0].created_at),
        "h:mm a, do MMMM yyyy"
      );

      setDate(formattedDate);
    } else {
      console.log("No data found in the npkreal table.");
      setError("No data available. Please check your database.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  interface Data {
    n: number;
    p: number;
    k: number;
    sm: number;
    ph: number;
  }

  interface Metric {
    key: keyof Data;
    label: string;
    progressBgClass: string;
    bgClass: string;
  }

  const metrics: Metric[] = [
    {
      key: "n",
      label: "Nitrogen (N)",
      progressBgClass: "!bg-blue-500",
      bgClass: "!bg-blue-200",
    },
    {
      key: "p",
      label: "Phosphorous (P)",
      progressBgClass: "!bg-green-500",
      bgClass: "!bg-green-200",
    },
    {
      key: "k",
      label: "Potassium (K)",
      progressBgClass: "!bg-yellow-500",
      bgClass: "!bg-yellow-200",
    },
    {
      key: "sm",
      label: "Moisture",
      progressBgClass: "!bg-cyan-500",
      bgClass: "!bg-cyan-200",
    },
    {
      key: "ph",
      label: "pH",
      progressBgClass: "!bg-purple-500",
      bgClass: "!bg-purple-200",
    },
  ];

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Soil Data (Live)</CardTitle>
        <p className="text-sm text-gray-500">Last updated on {date}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.key}>
              <div className="flex justify-between mb-2">
                <span className="text-base font-semibold tracking-tight">
                  {metric.label}
                </span>
                <span className="text-base font-semibold tracking-tight">
                  {data[metric.key]}%
                </span>
              </div>
              <Progress
                value={data[metric.key]}
                max={100}
                bg={metric.progressBgClass}
                className={`h-2 ${metric.bgClass}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NPKDataCard;
