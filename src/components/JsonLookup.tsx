import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  X,
  Search,
  BicepsFlexed,
  Sword,
  Wand2,
  Skull,
  Bone,
  CircleDot,
  Shield,
  ArrowUp,
} from "lucide-react";

const JsonLookup = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetch("/json-lookup/symbaroum.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // Show button when scrolled down 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filterButtons = [
    { type: "talent", icon: BicepsFlexed, label: "AB" },
    { type: "mystical power", icon: Wand2, label: "PO" },
    { type: "ritual", icon: Bone, label: "RI" },
    { type: "monstrous trait", icon: Skull, label: "MO" },
    { type: "trait", icon: Shield, label: "TR" },
    { type: "quality", icon: Sword, label: "QU" },
    { type: "boon,burden", icon: CircleDot, label: "BO" },
  ];

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      const matchesType =
        activeFilter === "" ||
        (activeFilter === "boon,burden"
          ? item.type === "boon" || item.type === "burden"
          : item.type === activeFilter);

      if (!matchesType) return false;

      if (!searchTerm) return true;

      const searchTermLower = searchTerm.toLowerCase();
      return (
        // item.name.toLowerCase().includes(searchTermLower) ||
        // item.description?.toLowerCase().includes(searchTermLower) ||
        // item.novice?.toLowerCase().includes(searchTermLower) ||
        // item.adept?.toLowerCase().includes(searchTermLower) ||
        // item.master?.toLowerCase().includes(searchTermLower)
        item.name.toLowerCase().includes(searchTermLower)
      );
    });
  }, [data, searchTerm, activeFilter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="space-y-4">
        {/* Search Bar and Description Toggle */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-descriptions"
              checked={showDescriptions}
              onCheckedChange={setShowDescriptions}
            />
            <Label htmlFor="show-descriptions">Desc</Label>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={activeFilter === type ? "default" : "outline"}
              onClick={() => setActiveFilter(activeFilter === type ? "" : type)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {/* {label} */}
            </Button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredData.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="text-sm text-gray-500 capitalize">
                  {item.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showDescriptions && item.description && (
                <p className="text-gray-600">{item.description}</p>
              )}
              {item.tradition && item.type !== "talent" && (
                <p className="text-sm text-gray-500">
                  <strong>Tradition:</strong> {item.tradition}
                </p>
              )}
              {(item.novice || item.adept || item.master) && (
                <div className="space-y-2 pt-2">
                  {item.novice && (
                    <div>
                      {!["boon", "burden", "quality"].includes(item.type) && (
                        <strong className="text-sm">Novice:</strong>
                      )}
                      <p className="text-gray-600">{item.novice}</p>
                    </div>
                  )}
                  {item.adept && (
                    <div>
                      <strong className="text-sm">Adept:</strong>
                      <p className="text-gray-600">{item.adept}</p>
                    </div>
                  )}
                  {item.master && (
                    <div>
                      <strong className="text-sm">Master:</strong>
                      <p className="text-gray-600">{item.master}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No items found matching your criteria
          </div>
        )}
      </div>
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 rounded-full w-14 h-14 sm:w-10 sm:h-10 p-0 shadow-md bg-gray-800"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6 sm:w-4 sm:h-4 text-white" />
        </Button>
      )}
    </div>
  );
};

export default JsonLookup;
