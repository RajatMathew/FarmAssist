"use client";

import * as m from "@/paraglide/messages.js";
import { LanguageSwitchComboBox } from "../components/LanguageSwitchComboBox";
import React from "react";

import BottomNav from "../components/BottomNav";
import { Leaf } from "lucide-react";
import ProfileCB from "../components/ProfileCB";
import { Flag, Home, MagnetIcon, SparklesIcon } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, name: "Home", href: "/dashboard" },
  { icon: SparklesIcon, name: "Ask AI", href: "/dashboard/ask-ai" },
  { icon: Flag, name: "Report", href: "/dashboard/report" },
  { icon: MagnetIcon, name: "Prediction", href: "/dashboard/prediction" },
];

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="bg-white">
        <div className="container max-w-7xl mx-auto p-3 flex justify-between">
          <div className="flex items-center">
            <p className="text-xl text-green-700 font-bold">
              <Leaf className="w-6 h-6  inline-block mr-2" />
              {m.app_name()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitchComboBox />

            <ProfileCB
              name={localStorage.getItem("name") || ""}
              email={localStorage.getItem("email") || ""}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="container mx-auto max-w-7xl p-3">{children}</div>
      </div>

      <BottomNav items={navItems} />
    </>
  );
}
