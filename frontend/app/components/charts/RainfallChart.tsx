import React, { useState, useEffect, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "An interactive bar chart showing average precipitation and temperature data";

const fetchPrecipData = async () => {
  const farmLocation = localStorage.getItem("farmlocation");
  const { lat, lng } = farmLocation
    ? JSON.parse(farmLocation)
    : { lat: 10.43, lng: 76.16 };

  try {
    const response = await fetch("http://localhost:8000/get-precip-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat,
        lng,
      }),
    });
    let data = await response.json();

    // If the data is a string, try to parse it as JSON
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing data:", parseError);
        return [];
      }
    }

    console.log("Fetched data:", data);

    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return [];
    }

    return data.map((item) => ({
      ...item,
      date: new Date(item.date).toISOString().split("T")[0], // Convert to YYYY-MM-DD format
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const chartConfig = {
  precipitation: {
    label: "Precipitation",
    color: "hsl(var(--chart-1))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function WeatherChart() {
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("precipitation");

  useEffect(() => {
    fetchPrecipData().then(setChartData);
  }, []);

  const averages = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        precipitation: 0,
        temperature: 0,
      };
    }
    return {
      precipitation: Number(
        (
          chartData.reduce((acc, curr) => acc + (curr.precipitation || 0), 0) /
          chartData.length
        ).toFixed(2)
      ),
      temperature: Number(
        (
          chartData.reduce((acc, curr) => acc + (curr.temperature || 0), 0) /
          chartData.length
        ).toFixed(2)
      ),
    };
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Weather Data Chart</CardTitle>
          <CardDescription>
            Showing average precipitation and temperature data
          </CardDescription>
        </div>
        <div className="flex">
          {["precipitation", "temperature"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <p className="text-sm">Avg. </p>
                <span className="text-xl font-bold leading-none ">
                  {averages[chart].toFixed(2)}
                  {chart === "precipitation" ? " mm" : " °C"}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                `${value}${activeChart === "precipitation" ? "mm" : "°C"}`
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
