"use client";

import * as m from "@/paraglide/messages.js";
import { LanguageSwitchComboBox } from "../components/LanguageSwitchComboBox";
import React from "react";

import { Leaf } from "lucide-react";
import ProfileCB from "../components/ProfileCB";

interface LayoutProps {
  children: React.ReactNode;
}

// const navItems = [
//   { icon: Home, name: "Home", href: "/admin" },
//   { icon: Radio, name: "Alert", href: "/admin/alert" },
// ];

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
              role="admin"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="container mx-auto max-w-7xl p-3">{children}</div>
      </div>

      {/* <BottomNav items={navItems} /> */}
    </>
  );
}
