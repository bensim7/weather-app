import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WeatherNews from "./components/weather-news";
import { getLocalTimeEachCity } from "./utils/local-time-each-city";

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp_min: number; temp_max: number; humidity: number };
  weather: { main: string; description: string }[];
  timezone: number;
}

interface SearchItem {
  id: number;
  city: string;
  country: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SearchItem[]>(() => {
    const saved = localStorage.getItem("storedHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [nextId, setNextId] = useState(() => {
    const saved = localStorage.getItem("storedHistory");
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.length + 1;
  });

  const [anotherBg, setAnotherBg] = useState(false);
  const backgroundImg = anotherBg ? "/bg-dark.png" : "/bg-light.png";

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Implemented within the above history and nextId useStates which prevents error of getting empty values on page reload
  // useEffect(() => {
  //   const savedHistory = localStorage.getItem('storedHistory');
  //   if (savedHistory) {
  //     const parsed = JSON.parse(savedHistory);
  //     setHistory(parsed);
  //     setNextId(parsed.length + 1);
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("storedHistory", JSON.stringify(history));
  }, [history]);

  const fetchWeather = async (
    searchCity: string,
    searchCountry: string,
    isHistory = false
  ) => {
    try {
      let query = "";
      if (searchCity && searchCountry) {
        query = `${searchCity},${searchCountry}`;
      } else if (searchCity) {
        query = searchCity;
      } else if (searchCountry) {
        setError(
          "City name Input is required, Country name cannot be used as sole input"
        );
        return;
      }

      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
      );

      // Validate that both fields were filled
      if (
        (searchCity &&
          response.data.name.toLowerCase() !== searchCity.toLowerCase()) ||
        (searchCountry &&
          response.data.sys.country.toLowerCase() !==
            searchCountry.toLowerCase())
      ) {
        throw new Error("either city or country name is not found in the data");
      }

      console.log(response.data);
      setWeather(response.data);
      setError("");

      if (!isHistory) {
        // date and timestamp of client computer is used for the history instead of the searched city's time, the searched city's date and time is displayed for the search results
        const timestamp = new Date()
          .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/\//g, "-");

        setHistory([
          ...history,
          {
            id: nextId,
            city: response.data.name,
            country: response.data.sys.country,
            timestamp,
          },
        ]);
        setNextId(nextId + 1);
      }
    } catch (err) {
      setWeather(null);
      setError("Invalid city or country name.");
    }
  };

  // search that removes white spaces before and after the search text
  const handleSearch = () => {
    if (city || country) {
      fetchWeather(city.trim(), country.trim());
    } else {
      setError("Please enter a city or country.");
      setWeather(null);
    }
  };

  const handleClear = () => {
    setCity("");
    setCountry("");
    setError("");
    setWeather(null);
  };

  const handleHistorySearch = (item: SearchItem) => {
    fetchWeather(item.city, item.country, true);
  };

  const handleDeleteHistory = (id: number) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // instead of getting local time of client Computer, updated to get local time of the searched city with getLocalTimeEachCity()

  // const timeFormat = (): string => {
  //   const now = new Date();
  //   return now.toLocaleString("en-US", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  return (
    <div
      className="min-h-screen bg-gray-100 p-4"
      style={{ backgroundImage: `url('${backgroundImg}')` }}
    >
      <div className="max-w-4xl w-full mx-auto ">
        {anotherBg ? (
          <h1 className="text-2xl text-gray-200 font-bold m-6 text-center">
            WeatherBen Weatherman
          </h1>
        ) : (
          <h1 className="text-2xl text-gray-700 font-bold m-6 text-center">
            WeatherBen Weatherman
          </h1>
        )}
        <div className="mb-6">
          <WeatherNews />
        </div>
        <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-md rounded-3xl p-4 md:px-6 mb-6">
          {/* responsive web design with flex-col or flex-row based on screen size   */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
            {/* City Input */}
            <div className="flex items-center self-start space-x-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="px-3 py-2 border border-gray-300 rounded-md w-48"
              />
            </div>

            {/* Country Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="px-3 py-2 border border-gray-300 rounded-md w-48"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Clear
              </button>
            </div>
            {/* light mode and dark mode toggle */}
            <div className="flex items-center space-x-2">
              <LightModeIcon className="text-yellow-300" />
              <div
                className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  anotherBg ? "bg-green-600" : "bg-gray-300"
                }`}
                onClick={() => setAnotherBg(!anotherBg)}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                    anotherBg ? "translate-x-6" : ""
                  }`}
                />
              </div>
              <DarkModeIcon className="text-blue-800" />
            </div>
          </div>
        </div>

        {error ? (
          <p className="text-red-600 ml-5">{error}</p>
        ) : (
          <div className="flex mb-12"></div>
        )}

        <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-md rounded-3xl p-4 md:p-6 mx-auto mt-6">
          {weather ? (
            <div
              className={`bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-3xl px-3 py-6 md:p-6 mb-6 space-y-4 transition-all duration-300 ${
                weather ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                {/* City, country */}
                <div className="flex-1 space-y-2">
                  <span className="font-medium text-lg text-gray-600">
                    {weather.name}, {weather.sys.country}
                  </span>

                  {/* Main weather */}
                  <h3 className="text-3xl text-blue-800 font-semibold">
                    {weather.weather[0].main}
                  </h3>

                  {/* Details of the weather */}
                  <div className="flex flex-col gap-2 text-md">
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-600 w-32">
                        Description:
                      </span>
                      <span>{weather.weather[0].description}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-600 w-32">
                        Temperature H:
                      </span>
                      <span>{weather.main.temp_max}°C</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-600 w-32">
                        Temperature L:
                      </span>
                      <span>{weather.main.temp_min}°C</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-600 w-32">
                        Humidity:
                      </span>
                      <span>{weather.main.humidity}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="font-medium text-gray-600 w-32">
                        Time:
                      </span>
                      <span>{getLocalTimeEachCity(weather.timezone)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 mt-6 w-40 h-40">
                  <img
                    src="/sun.png"
                    alt="Weather illustration"
                    className="w-full h-full object-cover rounded-lg shadow-md transition-opacity duration-700 ease-in-out"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-3xl p-4 mb-6 space-y-4 min-h-[282px]">
              {/* Empty placeholder to reserve space */}
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-3xl px-3 py-3 md:px-6 md:py-5">
            <h3 className="text-lg font-semibold mb-2">Search History</h3>
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li
                  key={item.id}
                  className="bg-white/30 backdrop-blur-md border border-white/20 flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <span>
                    {item.city}, {item.country}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{item.timestamp}</span>
                    {anotherBg ? (
                      <div className="rounded-full border border-gray-700 p-1">
                        <button
                          onClick={() => handleHistorySearch(item)}
                          className="hover:text-blue-500"
                        >
                          <SearchIcon fontSize="small" />
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-full bg-white border p-1">
                        <button
                          onClick={() => handleHistorySearch(item)}
                          className="hover:text-blue-500"
                        >
                          <SearchIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                    {anotherBg ? (
                      <div className="rounded-full border border-gray-700 p-1">
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="hover:text-red-600"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-full bg-white border p-1">
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="hover:text-red-600"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
