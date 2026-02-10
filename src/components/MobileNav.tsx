"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Trophy, Calendar } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Drivers", href: "/drivers", icon: Users },
    { name: "Teams", href: "/constructors", icon: Trophy },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#101018]/95 border-t border-white/10 z-50 pb-safe backdrop-blur-sm">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 rounded-lg transition ${
                isActive ? "text-red-400 bg-red-500/10" : "text-gray-300"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
