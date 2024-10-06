import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  icon: React.ElementType;
  name: string;
  href: string;
}

interface BottomNavProps {
  items: NavItem[];
}

export default function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
      <div className="bg-slate-800 text-white drop-shadow-2xl px-8 pt-4 rounded-full">
        <div className="flex gap-8">
          {items.map((item) => (
            <BottomNavItem
              key={item.href}
              icon={item.icon}
              name={item.name}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface BottomNavItemProps {
  icon: React.ElementType;
  name: string;
  href: string;
  isActive: boolean;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  icon: Icon,
  name,
  href,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 flex-1 justify-center items-center"
    >
      <Icon
        className={`w-5 h-5 inline-block ${
          isActive
            ? "text-white"
            : "text-white/50 group-hover:text-white/80 duration-200"
        }`}
      />
      <p
        className={`text-xs tracking-wideset ${
          isActive
            ? "text-white"
            : "text-white/50 group-hover:text-white/80 duration-200"
        }`}
      >
        {name}
      </p>
      {isActive ? (
        <div className="w-full h-0.5 bg-white rounded-full mt-1"></div>
      ) : (
        <div className="w-full h-0.5 bg-transparent rounded-full mt-1"></div>
      )}
    </Link>
  );
};
