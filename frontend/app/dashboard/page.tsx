"use client";

import React, { useEffect, useState } from "react";
import * as m from "@/paraglide/messages.js";
import RainfallChart from "../components/charts/RainfallChart";
import MoistureChart from "../components/charts/MoistureChart";
import PieChartDemo from "../components/charts/PieChartDemo";
import PrivateRoute from "../components/PrivateRoute";
import WarningComponent from "../components/WarningComponent";
import MapExplorer from "../components/MapExplorer";
import AmbeeSection from "../components/AmbeeSection";
import NPKDataCard from "../components/NPKcard";

export default function Page() {
  const displayName = localStorage.getItem("name");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/get-precip-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: 11.2450558,
            lng: 75.7754716,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log(data);
        setApiData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PrivateRoute>
        <div className="bg-gray-100">
          <div className="container mx-auto max-w-7xl p-3 ">
            <h1 className="font-bold text-2xl mt-2">
              {m.welcome({ name: displayName ?? "User" })}
            </h1>

            <section>
              <AmbeeSection />
            </section>

            {/* <section className="warnigns mt-5">
              <WarningComponent
                heading={"Severe Rainfall in your area"}
                description="lorem ipsum jkhg hsbgf kjhdsbfg dsfkjh sdjkhfgb sjkhg skjhfb "
              />
            </section> */}

            <div className="mt-4">
              <RainfallChart />
            </div>
            {/* <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex-1">
                <MoistureChart />
              </div>
              <div className="flex-1">
                <MoistureChart />
              </div>
              <div className="flex-1">
                <PieChartDemo />
              </div>
            </div> */}

            <div>
              <NPKDataCard />
            </div>

            <div>
              <MapExplorer />
            </div>
          </div>
        </div>
      </PrivateRoute>
    </>
  );
}
