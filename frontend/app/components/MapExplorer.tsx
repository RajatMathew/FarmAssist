import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    id: "river-flood-risk",
    tabName: "River Flood Risk Map",
    detail:
      "River Flood Risk Map map shows areas that are at risk of flooding from nearby rivers. It highlights regions where there is a higher chance of flooding based on historical river levels and land elevation.",
  },
  {
    id: "ndvi",
    tabName: "NDVI",
    detail:
      "NDVI map measures the health and density of vegetation in an area. Greener areas indicate healthy, dense vegetation, while brown or yellow areas suggest poor or sparse vegetation.",
    src: "https://ee-rajatxmathew.projects.earthengine.app/view/ndvi?loading=async",
  },
  {
    id: "surface-temperature",
    tabName: "Surface Temperature Map",
    detail:
      "Surface Temperature Map displays the temperature of the Earth’s surface. Darker red or orange areas indicate warmer surfaces, while blue or green areas show cooler regions.",
    src: "https://ee-rajatxmathew.projects.earthengine.app/view/temperature-map?loading=async",
  },
  {
    id: "surface-moisture",
    tabName: "Surface Moisture Map",
    detail:
      "Surface Moisture Map shows how much moisture is present in the top layer of soil. Wet areas appear darker, while drier regions are lighter, helping identify regions prone to drought or flooding.",
    src: "https://ee-prdevadathk3.projects.earthengine.app/view/smap?loading=async",
  },
  {
    id: "evapotranspiration",
    tabName: "Evapotranspiration",
    detail:
      "Evapotranspiration map measures the amount of water transferred from the land to the atmosphere through evaporation and plant transpiration. High evapotranspiration areas are losing more water, often indicating high temperatures or active plant growth.",
    src: "https://ee-prdevadathk3.projects.earthengine.app/view/evapotranspiration?loading=async",
  },
];

export default function MapExplorer() {
  return (
    <div className="container mx-auto mt-8 p-8  rounded-lg border border-gray-200 drop-shadow-md bg-white">
      <h1 className="font-bold text-2xl mb-4">Satellite data</h1>
      <p className="mb-6 text-sm sm:text-base">
        Get to know about various satellite data and how it impacts weather
      </p>

      <Tabs defaultValue={tabs[0].id} className="w-full mb-5">
        <TabsList className="flex bg-gray-200 flex-wrap justify-start mb-5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-grow py-2 px-3 sm:flex-grow-0 text-xs sm:text-sm mr-2"
            >
              {tab.tabName}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <div className="!mt-10 ">
              {/* <h2 className="mt-6 text-base sm:text-xl font-bold mb-2">
                About {tab.tabName}
              </h2> */}
              <p className="mb-4 text-sm sm:text-base">{tab.detail}</p>
              <div className="w-full overflow-hidden pb-[56.25%] relative">
                <iframe
                  src={tab.src}
                  title={tab.tabName}
                  className="absolute top-0 left-0 w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
