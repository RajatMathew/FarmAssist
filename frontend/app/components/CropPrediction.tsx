"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  nitrogen_content: number;
  phosphorus_content: number;
  potassium_content: number;
  temperature_content: number;
  humidity_content: number;
  ph_content: number;
  rainfall: number;
}

interface PredictionResult {
  crop_name: string;
  humidity_level: string;
  temperature_level: string;
  rainfall_level: string;
  nitrogen_level: string;
  phosphorus_level: string;
  potassium_level: string;
  phlevel: string;
}

const formFields = [
  { name: "nitrogen_content", label: "Nitrogen Content" },
  { name: "phosphorus_content", label: "Phosphorus Content" },
  { name: "potassium_content", label: "Potassium Content" },
  { name: "temperature_content", label: "Temperature Content" },
  { name: "humidity_content", label: "Humidity Content" },
  { name: "ph_content", label: "pH Content" },
  { name: "rainfall", label: "Rainfall" },
];

const CropPredictionForm: React.FC = () => {
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      nitrogen_content: 0,
      phosphorus_content: 0,
      potassium_content: 0,
      temperature_content: 0,
      humidity_content: 0,
      ph_content: 0,
      rainfall: 0,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/get-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: PredictionResult = await response.json();
      setPredictionResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-24">
      <h2 className="text-2xl mb-1 font-semibold">Predict Crop</h2>
      <p className="mb-3">
        This tool will help you to predict the best type of crop for according
        to your soil and weather conditions.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-4"
        >
          <div className="grid grid-cols-2 gap-2">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof FormData}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white "
                        type="number"
                        step="0.1"
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Predicting..." : "Predict Crop"}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {predictionResult && (
        <Card className="mt-6 mb-24">
          <CardHeader>
            <CardTitle className="text-xl">Prediction Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Crop Name:</strong> {predictionResult.crop_name}
            </p>
            <p>
              <strong>Humidity Level:</strong> {predictionResult.humidity_level}
            </p>
            <p>
              <strong>Temperature Level:</strong>{" "}
              {predictionResult.temperature_level}
            </p>
            <p>
              <strong>Rainfall Level:</strong> {predictionResult.rainfall_level}
            </p>
            <p>
              <strong>Nitrogen Level:</strong> {predictionResult.nitrogen_level}
            </p>
            <p>
              <strong>Phosphorus Level:</strong>{" "}
              {predictionResult.phosphorus_level}
            </p>
            <p>
              <strong>Potassium Level:</strong>{" "}
              {predictionResult.potassium_level}
            </p>
            <p>
              <strong>pH Level:</strong> {predictionResult.phlevel}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropPredictionForm;
