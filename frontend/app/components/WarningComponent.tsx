import { CircleAlert } from "lucide-react";
import React from "react";

export default function WarningComponent({
  heading,
  description,
}: {
  heading: string;
  description: string;
}) {
  return (
    <>
      <div className="bg-red-200/20 text-red-700 px-5 py-5  border-red-500 border shadow-sm rounded-md">
        <div className="flex items-cener gap-2">
          <div className="">
            <CircleAlert className="w-6 h-6 inline-block mr-2" />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
