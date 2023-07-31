import { useEffect, useRef, useState } from "react";

// API key for OpenWeatherMap API
const API_key = "2fb8cf68af7bd8de8ba3f9658cc566bd";

const App = () => {
  // Reference to the input element for getting user location
  const inputRef = useRef(null);

  // State variables to manage API data and weather display for card-1 (search)
  const [searchApiData, setSearchApiData] = useState(null);
  const [searchShowWeather, setSearchShowWeather] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // State variables to manage API data and weather display for card-2 (GPS location)
  const [gpsApiData, setGpsApiData] = useState(null);
  const [gpsShowWeather, setGpsShowWeather] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // State variables to manage hourly forecast
  const [searchHourlyForecast, setSearchHourlyForecast] = useState(null);
  const [gpsHourlyForecast, setGpsHourlyForecast] = useState(null);


  // Weather types and their corresponding icons
  const WeatherTypes = [
    {
      type: "Clear",
      img: "https://cdn-icons-png.flaticon.com/512/979/979534.png",
    },
    {
      type: "Rain",
      img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
    },
    {
      type: "Snow",
      img: "https://cdn-icons-png.flaticon.com/512/642/642102.png",
    },
    {
      type: "Clouds",
      img: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    },
    {
      type: "Haze",
      img: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png",
    },
    {
      type: "Smoke",
      img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png",
    },
    {
      type: "Mist",
      img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
    },
    {
      type: "Drizzle",
      img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    },
  ];

  // Function to fetch weather data from OpenWeatherMap API based on search
  const fetchWeatherBySearch = async () => {
    const searchURL = `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&units=metric&appid=${API_key}`;
    setSearchLoading(true);
  
    try {
      const response = await fetch(searchURL);
      const data = await response.json();
  
      setSearchApiData(data);
      setSearchLoading(false);
  
      if (data.cod === 404 || data.cod === 400) {
        setSearchShowWeather([
          {
            type: "Not Found",
            img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
          },
        ]);
      } else {
        setSearchShowWeather(
          WeatherTypes.filter((weather) => weather.type === data.weather[0].main)
        );
  
        // Fetch hourly forecast data
        const hourlyURL = `https://api.openweathermap.org/data/2.5/forecast?q=${inputRef.current.value}&units=metric&appid=${API_key}`;
        const hourlyResponse = await fetch(hourlyURL);
        const hourlyData = await hourlyResponse.json();
        setSearchHourlyForecast(hourlyData.list);
      }
    } catch (error) {
      console.log(error);
      setSearchLoading(false);
    }
  };  

  // Function to get the user's current location using the Geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // Function to fetch weather data using latitude and longitude (for GPS location)
  const fetchWeatherByCoords = async (lat, lon) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`;
    setGpsLoading(true);
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setGpsApiData(data);
        setGpsLoading(false);
        if (data.cod === 404 || data.cod === 400) {
          setGpsShowWeather([
            {
              type: "Not Found",
              img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
            },
          ]);
        } else {
          setGpsShowWeather(
            WeatherTypes.filter(
              (weather) => weather.type === data.weather[0].main
            )
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setGpsLoading(false);
      });
  };

  // Fetch weather data for the user's current location when the component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-10 pl-16">
        {/* Card-1: Weather based on search */}
        <div className="border-4 border-yellow-400 w-96 p-4 rounded-3xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
          <div>
            {/* Input and search button for getting user location */}
            <div className="text-2xl border-2 p-1 flex border-gray-400 items-center rounded-xl bg-white hover:border-black">
              <input
                type="text"
                ref={inputRef}
                placeholder="Enter Your Location"
                className="flex-1 p-1"
              />
              <button onClick={fetchWeatherBySearch}> 
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5948/5948534.png"
                  alt="..."
                  className="w-7 m-2"
                />
              </button>
            </div>
            {/* Display weather information for the chosen city */}
            <div className="text-center flex flex-col gap-6 mt-10">
              {searchApiData ? (
                // Display weather information when searchApiData is available
                <>
                  <p className="text-xl font-semibold">
                    {searchApiData?.name + "," + searchApiData?.sys?.country}
                  </p>
                  <img
                    src={searchShowWeather[0]?.img}
                    alt="..."
                    className="w-52 mx-auto"
                  />
                  <h3 className="text-2xl font-bold text-zinc-800">
                    {searchShowWeather[0]?.type}
                  </h3>
                  {searchApiData && (
                    <div className="flex justify-center">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png"
                        alt="..."
                        className="h-9 mt-1"
                      />
                      <h2 className="text-4xl font-extrabold">
                        {searchApiData?.main?.temp}&#176;C
                      </h2>
                    </div>
                  )}
                </>
              ) : searchLoading ? (
                // Show loading spinner while fetching weather data
                <div className="grid place-items-center h-full">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6356/6356625.png"
                    alt="..."
                    className="w-14 mx-auto mb-2 animate-spin"
                  />
                </div>
              ) : (
                // Display a specific image or message when searchApiData is null
                <>
                  {inputRef.current && inputRef.current.value ? (
                    // Show specific image and message when user searched for a city that does not exist
                    <>
                      <h3 className="text-xl font-semibold text-zinc-800">
                        City Not Found!
                      </h3>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/6133/6133501.png"
                        alt="City Not Found"
                        className="w-72 mx-auto"
                      />
                    </>
                  ) : (
                    // Show initial message and image when the input field is empty
                    <>
                      <h3 className="text-xl font-semibold text-zinc-800">
                        Let's Find Out!!
                      </h3>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/6064/6064969.png"
                        alt="No weather data available"
                        className="w-72 mx-auto"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Card-2: Weather based on GPS location */}
        <div className="border-4 border-yellow-400 w-96 p-4 rounded-3xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
          <div className="text-2xl font-semibold p-1 flex items-center rounded-3xl text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10411/10411041.png"
              alt="..."
              className="w-8 m-2"
            />
            <p className="flex-1 p-1 duration-200 ease-in-out">
              {" "}
              Current Location Data{" "}
            </p>
          </div>
          {/* Weather information display for GPS location */}
          <div
            className={`duration-200 ease-in-out overflow-hidden ${
              gpsShowWeather ? "h-[27rem]" : "h-[27rem]"
            }`}
          >
            {gpsLoading ? (
              <div className="grid place-items-center h-full">
                {/* Show loading spinner while fetching weather data */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6356/6356625.png"
                  alt="..."
                  className="w-14 mx-auto mb-2 animate-spin"
                />
              </div>
            ) : (
              gpsShowWeather && (
                <div className="text-center flex flex-col gap-6 mt-10">
                  {/* Show weather information if available */}
                  {gpsApiData && (
                    <p className="text-xl font-semibold">
                      {gpsApiData?.name + "," + gpsApiData?.sys?.country}
                    </p>
                  )}
                  <img
                    src={gpsShowWeather[0]?.img}
                    alt="..."
                    className="w-52 mx-auto"
                  />
                  <h3 className="text-2xl font-bold text-zinc-800">
                    {gpsShowWeather[0]?.type}
                  </h3>

                  {gpsApiData && (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png"
                          alt="..."
                          className="h-9 mt-1"
                        />
                        <h2 className="text-4xl font-extrabold">
                          {gpsApiData?.main?.temp}&#176;C
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="border-4 border-yellow-400 w-96 p-4 rounded-3xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-96 p-4 rounded-3xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
      </div>
      <h2 className="mb-4 mx-4 pl-14 text-3xl mt-16 font-semibold">Upcoming Weather</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mx-16 pl-10 border-4 p-8 rounded-3xl shadow-md border-yellow-400 bg-white">
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
        <div className="border-4 border-yellow-400 w-48 h-64 p-4 rounded-3xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out"></div>
      </div>
    </div>
  );
};

export default App;
