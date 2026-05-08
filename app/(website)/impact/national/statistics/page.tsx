"use client";
import {
  Trees,
  MapPin,
  Users,
  BookOpen,
  Shield,
  Sprout,
  Wind,
  Mic,
  Handshake,
  Flower2,
  Leaf,
  TreePine,
  Mountain,
  RefreshCw,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface NationalStat {
  title: string;
  value: number;
  description: string;
  icon?: React.ReactNode;
  id: number;
  suffix: string;
}
interface StatItemProps {
  value: number;
  suffix?: string;
}

const NationalStatistics: NationalStat[] = [
  {
    title: "Districts Under YASCON Conservation",
    value: 28,
    description: "Districts actively engaged in conservation efforts",
    icon: <MapPin className="text-green-500" />,
    id: 1,
    suffix: "",
  },
  {
    title: "Consultation Meetings Conducted",
    value: 27,
    description: "Community consultations held nationally",
    icon: <Handshake className="text-green-500" />,
    id: 2,
    suffix: "",
  },
  {
    title: "Youth Meetings Conducted",
    value: 383,
    description: "Youth engagement sessions facilitated",
    icon: <Users className="text-green-500" />,
    id: 3,
    suffix: "",
  },
  {
    title: "Conservation Clubs Formed",
    value: 765,
    description: "Active conservation clubs across Malawi",
    icon: <Shield className="text-green-500" />,
    id: 4,
    suffix: "",
  },
  {
    title: "Youths Registered",
    value: 18564,
    description: "Young people registered under YASCON",
    icon: <BookOpen className="text-green-500" />,
    id: 5,
    suffix: "",
  },
  {
    title: "Capacity Building Trainings",
    value: 7,
    description: "Training sessions facilitated for members",
    icon: <Mic className="text-green-500" />,
    id: 6,
    suffix: "",
  },
  {
    title: "Clean-Up Campaigns Facilitated",
    value: 23,
    description: "Environmental clean-up campaigns conducted",
    icon: <Wind className="text-green-500" />,
    id: 7,
    suffix: "",
  },
  {
    title: "Conservation Talks Delivered",
    value: 89,
    description: "Awareness talks on conservation delivered",
    icon: <Mic className="text-green-500" />,
    id: 8,
    suffix: "",
  },
  {
    title: "Stakeholder Meetings Conducted",
    value: 3,
    description: "Key stakeholder engagements held",
    icon: <Handshake className="text-green-500" />,
    id: 9,
    suffix: "",
  },
  {
    title: "Tree Nurseries Established",
    value: 234,
    description: "Nurseries set up across the country",
    icon: <Sprout className="text-green-500" />,
    id: 10,
    suffix: "",
  },
  {
    title: "Tree Seedlings Raised",
    value: 2395,
    description: "Seedlings grown and ready for planting",
    icon: <Flower2 className="text-green-500" />,
    id: 11,
    suffix: "",
  },
  {
    title: "Trees Planted",
    value: 6785,
    description: "Trees successfully planted nationally",
    icon: <Trees className="text-green-500" />,
    id: 12,
    suffix: "",
  },
  {
    title: "Village Forest Areas Established",
    value: 265,
    description: "Community forest areas created",
    icon: <TreePine className="text-green-500" />,
    id: 13,
    suffix: "",
  },
  {
    title: "Forest Regeneration Areas Managed",
    value: 86,
    description: "Forest regeneration areas under active management",
    icon: <RefreshCw className="text-green-500" />,
    id: 14,
    suffix: "",
  },
];

const AnimatedStat: React.FC<StatItemProps> = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div>
      <p>
        {count.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
};

export default function NationalStati() {
  return (
    <section id="statistics">
      <div className="pt-28 p-8">
        <h2 className="text-3xl font-bold text-[#1a2e1a]">
          NATIONAL STATISTICS
        </h2>
        <div className="w-11 h-[3px] bg-[#d4a017] mt-5 mb-6 rounded-sm" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NationalStatistics.map((stat) => (
            <div
              key={stat.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 brightness-98 hover:brightness-120"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                {stat.icon}
              </div>

              <div className="mt-2 text-3xl font-semibold text-gray-900">
                <AnimatedStat
                  key={stat.id}
                  value={stat.value}
                  suffix={stat.suffix}
                />
              </div>

              <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}