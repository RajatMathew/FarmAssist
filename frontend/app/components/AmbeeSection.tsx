import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Cloud,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windGust: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  ozone: number;
  summary: string;
  updatedAt: string;
}

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [floodRisk, setfloodRisk] = useState("");
  const [suggestedCrops, setsuggestedCrops] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const farmLocation = localStorage.getItem("farmlocation");
        const { lat, lng } = farmLocation
          ? JSON.parse(farmLocation)
          : { lat: 10.43, lng: 76.16 };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PYTHON_URL}/get-flood-risk`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ lat, lng }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeatherData(data.weather_data);
        setfloodRisk(data.flood_risk.toString());
        setsuggestedCrops(data.suggested_crops);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchWeatherData();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-10 w-10" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className=" mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
        {floodRisk && (
          <Card
            className={`border ${
              floodRisk === "Low"
                ? "border-green-500 bg-green-50"
                : floodRisk === "High"
                ? "border-red-500 bg-red-50"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle>Flood Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{floodRisk}</p>
            </CardContent>
          </Card>
        )}
        {suggestedCrops && (
          <Card>
            <CardHeader>
              <CardTitle>Suggested Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Some crops you can grow are{" "}
                {suggestedCrops.slice(0, -1).join(", ")}
                {suggestedCrops.length > 1 ? ", and " : ""}
                {suggestedCrops[suggestedCrops.length - 1]}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid mt-4 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-lg  font-semibold">
              Temperature
            </CardTitle>
            <Thermometer className="h-10 w-10 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weatherData.temperature}°F
            </div>
            <p className="text-xs text-muted-foreground">
              Feels like {weatherData.apparentTemperature}°F
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg  font-semibold">Humidity</CardTitle>
            <Droplets className="h-10 w-10 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.humidity}%</div>
            <p className="text-xs text-muted-foreground">
              Dew point: {weatherData.dewPoint}°F
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg  font-semibold">Wind</CardTitle>
            <Wind className="h-10 w-10 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weatherData.windSpeed} mph
            </div>
            <p className="text-xs text-muted-foreground">
              Gusts up to {weatherData.windGust} mph
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg  font-semibold">
              Cloud Cover
            </CardTitle>
            <Cloud className="h-10 w-10 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.cloudCover}%</div>
            <p className="text-xs text-muted-foreground">
              Visibility: {weatherData.visibility} miles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg  font-semibold">UV Index</CardTitle>
            <Sun className="h-10 w-10 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.uvIndex}</div>
            <p className="text-xs text-muted-foreground">
              Ozone: {Math.round(weatherData.ozone)} DU
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Weather Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{weatherData.summary}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {new Date(weatherData.updatedAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WeatherDashboard;
