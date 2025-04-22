import React, { useEffect, useState } from "react";
import axios from "axios";

interface WeatherItem {
  name: string;
  country: string;
  description: string;
}

export const southeastAsianCities = [
  { name: "Singapore", country: "SG" },
  { name: "Jakarta", country: "ID" },
  { name: "Kuala Lumpur", country: "MY" },
  { name: "Bangkok", country: "TH" },
  { name: "Manila", country: "PH" },
  { name: "Hanoi", country: "VN" },
];

const WeatherNews: React.FC = () => {
  const [weatherNews, setWeatherNews] = useState<WeatherItem[]>([]);

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      const results: WeatherItem[] = [];

      await Promise.all(
        southeastAsianCities.map(async (city) => {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&appid=${API_KEY}&units=metric`
            );

            results.push({
              name: city.name,
              country: city.country,
              description: response.data.weather[0].description,
            });
          } catch (error) {
            console.error(`Error fetching weather for ${city.name}`, error);
          }
        })
      );

      setWeatherNews(results);
    };

    fetchWeather();
  }, []);

  return (
    <div className="overflow-hidden bg-gray-700/50 py-2 border border-gray-500 rounded-3xl">
      <div className="relative w-full flex items-center justify-center text-white p-4">
        <div className="absolute inset-y-0 left-0 w-[16%] bg-gradient-to-r from-amber-900 to-red-500 [clip-path:polygon(0_0,_82%_0,_100%_100%,_0%_100%)] z-10">
          <span className="absolute md:inset-y-4 left-4 z-20 text-sm font-bold uppercase">
            S.E. Asia
          </span>
        </div>
        <div className="whitespace-nowrap animate-scroll hover:[animation-play-state:paused] text-sm text-white font-medium px-4">
          {weatherNews.map((item, index) => (
            <span key={index} className="inline-block mr-12">
              {item.name}, {item.country}: {item.description}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherNews;
