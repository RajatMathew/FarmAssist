"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const crops = [
  { id: 1, name: "Rice" },
  { id: 2, name: "Maize" },
  { id: 3, name: "Chickpea" },
  { id: 4, name: "Kidney Beans" },
  { id: 5, name: "Pigeon Peas" },
  { id: 6, name: "Moth Beans" },
  { id: 7, name: "Mung Beans" },
  { id: 8, name: "Black Gram" },
  { id: 9, name: "Lentil" },
  { id: 10, name: "Pomegranate" },
  { id: 11, name: "Banana" },
  { id: 12, name: "Mango" },
  { id: 13, name: "Grapes" },
  { id: 14, name: "Watermelon" },
  { id: 15, name: "Muskmelon" },
  { id: 16, name: "Apple" },
  { id: 17, name: "Orange" },
  { id: 18, name: "Papaya" },
  { id: 19, name: "Coconut" },
  { id: 20, name: "Cotton" },
  { id: 21, name: "Jute" },
  { id: 22, name: "Coffee" },
];

export default function Crop() {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [pestData, setPestData] = useState<string | null>(null);
  const [soilPh, setSoilPh] = useState<string>("");
  const [soilMoisture, setSoilMoisture] = useState<string>("");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const storedCropId = localStorage.getItem("mycrop");
    const farmLocation = JSON.parse(
      localStorage.getItem("farmLocation") || "{}"
    );

    if (storedCropId) {
      const storedCrop = crops.find(
        (crop) => crop.id.toString() === storedCropId
      );
      if (storedCrop) {
        setSelectedCrop(storedCrop.name);
      }
    }

    if (farmLocation.lat && farmLocation.lng) {
      fetchWeatherData(farmLocation.lat, farmLocation.lng);
    }
  }, []);

  const fetchWeatherData = async (lat: number, lng: number) => {
    try {
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

      const data = await response.json();

      if (response.ok && data.weather_data) {
        const tempInCelsius = (data.weather_data.temperature - 32) * (5 / 9);
        setTemperature(tempInCelsius);
        setHumidity(data.weather_data.humidity);
      } else {
        throw new Error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const fetchPestData = async (cropName: string) => {
    console.log("Fetching pest data for:", cropName); // Debug log
    if (
      temperature === null ||
      humidity === null ||
      soilPh === "" ||
      soilMoisture === ""
    ) {
      console.error("Missing required data for pest prediction");
      setPestData("Missing required data");
      return;
    }

    try {
      console.log("Sending request to API"); // Debug log
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_URL}/my-crop-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crop: cropName,
            temperature,
            humidity,
            soil_ph: parseFloat(soilPh),
            soil_moisture: parseFloat(soilMoisture),
          }),
        }
      );

      console.log("Response received:", response.status); // Debug log
      const data = await response.json();
      console.log("Data received:", data); // Debug log

      if (!response.ok) {
        if (data.detail === "Pest not found for the given conditions") {
          setPestData(data.detail);
        } else {
          throw new Error("Network response was not ok");
        }
      } else {
        setPestData(data.pest);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setPestData("Error fetching pest data");
    }
  };

  const handleCropChange = (cropName: string) => {
    const selectedCrop = crops.find((crop) => crop.name === cropName);
    if (selectedCrop) {
      setSelectedCrop(cropName);
      localStorage.setItem("mycrop", selectedCrop.id.toString());
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted"); // Debug log
    setFormSubmitted(true);
    if (selectedCrop) {
      console.log("Selected crop:", selectedCrop); // Debug log
      fetchPestData(selectedCrop);
    } else {
      console.log("No crop selected"); // Debug log
      setPestData("Please select a crop");
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">My crop</h1>
      <p>Enter your details to know what pests might affect your crop</p>

      {temperature !== null && humidity !== null && (
        <div className="mt-4 p-4 border rounded-md bg-green-800 text-white">
          <h2 className="text-sm font-semibold">Current Weather</h2>
          <p>Temperature: {temperature.toFixed(2)} °C</p>
          <p>Humidity: {humidity}%</p>
        </div>
      )}
      <div className="mt-4">
        <Select onValueChange={handleCropChange} value={selectedCrop || ""}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a crop" />
          </SelectTrigger>
          <SelectContent>
            {crops.map((crop) => (
              <SelectItem key={crop.id} value={crop.name}>
                {crop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Soil pH
          </label>
          <Input
            type="number"
            step="0.1"
            value={soilPh}
            onChange={(e) => setSoilPh(e.target.value)}
            className="mt-1 bg-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Soil Moisture
          </label>
          <Input
            type="number"
            step="0.1"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(e.target.value)}
            className="mt-1 bg-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Check
        </button>
      </form>
      {formSubmitted &&
        (pestData ? (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h2 className="text-lg font-semibold">Pest prediction</h2>
            <p>{pestData}</p>
          </div>
        ) : (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h2 className="text-lg font-semibold">Pest prediction</h2>
            <p>No pest threats</p>
          </div>
        ))}
    </>
  );
}
