/* eslint-disable react/no-unescaped-entities */
import { list } from "postcss";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

//Google Maps API
const MapCard = ({ latitude, longitude }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <div className="border-4 border-yellow-400 p-4 rounded-xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
      <div className="text-2xl font-semibold p-1 flex items-center rounded-xl text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/10411/10411041.png"
          alt="..."
          className="w-8 m-2"
        />
        <p className="flex-1 p-1 duration-200 ease-in-out">
          {" "}
          Map of Current Location{" "}
        </p>
      </div>
      <div className="duration-200 ease-in-out overflow-hidden h-[27rem]">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={10}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

// API key for OpenWeatherMap API
const API_key = "2fb8cf68af7bd8de8ba3f9658cc566bd";

const App = () => {
  // Reference to the input element for getting user location
  const inputRef = useRef(null);

  // State variables to manage API data and weather display for card-1 (search)
  const [searchApiData, setSearchApiData] = useState(null);
  const [searchShowWeather, setSearchShowWeather] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // State variables to manage API data and weather display for card-2 & 3 (GPS location)
  const [gpsApiData, setGpsApiData] = useState(null);
  const [gpsShowWeather, setGpsShowWeather] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [gpsForecastData, setGpsForecastData] = useState(null);

  // State variables to manage hourly forecast
  const [searchHourlyForecast, setSearchHourlyForecast] = useState(null);
  const [gpsHourlyForecast, setGpsHourlyForecast] = useState(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const convertToKilometersPerHour = (speedInMetersPerSecond) => {
    return Math.round(speedInMetersPerSecond * 3.6);
  };
  
  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  };


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
          fetchWeatherOfUpcomingDays(latitude, longitude);
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

  // Function to fetch forecast of 5 days including today
  const fetchWeatherOfUpcomingDays = async (lat, lon) => {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_key}`;
    
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod == 200) {
          let forecast = {};
          let index = 0;

          for (let i = 0; i < data.list.length; i = i + 8) {
            var currDate = new Date(data.list[i].dt_txt.substring(0,11));

            forecast[index++] = {
              date: currDate.getDate() > 9 ? currDate.getDate() : "0" + currDate.getDate(),
              day: currDate.toString().substring(0, 3),
              temperature: data.list[i].main.temp,
              weather_type: WeatherTypes.filter(  
                (weather) => weather.type === data.list[i].weather[0].main
              )[0].img
            };
          }

          setGpsForecastData(forecast);
        } 
        else {
          console.log("Whoops!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const forecastWeather = () => {
    return (
      Object.values(gpsForecastData).map((val, i) => (
        // eslint-disable-next-line react/jsx-key
        <div className="border-4 border-yellow-400 w-60 h-64 p-4 rounded-xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
          <h1 className={`${i == 0 ? "font-bold" : null} text-center mt-2 text-xl`}>{i === 0 ? "Today" : val.day + " " + val.date}</h1>
          <img src={gpsForecastData ? val.weather_type : null} className="w-20 h-20 self-center m-[25%] mb-[15%]" />
          <h1 className={`${i == 0 ? "font-bold" : null} text-center mt-8 text-lg`}>{gpsForecastData ? Math.round(val.temperature) + "° C" : null}</h1>
        </div>
      ))
    )
  };

  // Fetch weather data for the user's current location when the component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    //main container
    <div>
      <div className="px-20">
        {/* top level grid */}
        <div className="grid parent grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 my-10 mx-auto space-x-6">
          <div className="grid first grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid first-first">
              {/* Card-1: Weather based on search */}
              <div className="border-4 border-yellow-400 p-4 rounded-xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
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
            </div>               
            <div className="grid first-second">
              {/* Card-2: Weather based on GPS location child div*/}
              <div className="border-4 border-yellow-400 w-92 p-4 rounded-xl shadow-md bg-white hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
                <div className="text-2xl font-semibold p-1 flex items-center rounded-xl text-center">
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
            </div>
          </div>
          {/* Card-3 Wateher Deatils*/}
          <div className="grid second grid-cols-1 sm:grid-cols-1 md:grid-cols-1 border-4 border-yellow-400 p-8 bg-white rounded-xl hover:bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
            {console.log(JSON.stringify(gpsApiData, null, 2))}
            {gpsApiData && (
              <>
                <p className="font-semibold text-xl mb-5">
                  Weather today in {gpsApiData?.name + ", " + gpsApiData?.sys?.country}
                </p>
                <h4 className="text-5xl mb-10 font-black">
                  {capitalizeFirstLetter(gpsApiData?.weather[0]?.description)}
                </h4>
                <h4 className="text-lg">Feels Like</h4>
                <h2 className="text-4xl font-extrabold">
                  {Math.round(gpsApiData?.main?.feels_like)}&#176;C
                </h2>
                <h2 className="text-xl mt-4"><span className="font-bold">Minimum:</span> {Math.round(gpsApiData?.main?.temp_min)}&#176;C / <span className="font-bold">Maximum:</span> {Math.round(gpsApiData?.main?.temp_max)}&#176;C</h2>
                <div>
                  <p  className="mt-10">
                  <hr></hr>
                    <strong>Wind Speed:</strong> {convertToKilometersPerHour(gpsApiData?.wind?.speed)} km/h
                  </p>
                  <hr></hr>
                  <p>
                    <strong>Humidity:</strong> {gpsApiData?.main?.humidity}%
                  </p>
                  <hr></hr>
                  <p>
                    <strong>Pressure:</strong> {gpsApiData?.main?.pressure}hPa
                  </p>
                  <hr></hr>
                  <p>
                    <strong>Sunrise:</strong> {formatTime(gpsApiData?.sys?.sunrise)}
                  </p>
                  <hr></hr>
                  <p>
                    <strong>Sunset:</strong> {formatTime(gpsApiData?.sys?.sunset)}
                  </p>
                  <hr></hr>
                </div>
              </>
            )}
          </div>
        </div>



        {/* 2nd layer */}
        <div> 
          {gpsApiData && (
              <MapCard latitude={gpsApiData.coord.lat} longitude={gpsApiData.coord.lon} />
            )}
        </div>

        {/* 3rd layer */}
        <h2 className="mb-4 mx-4 text-3xl mt-16 font-semibold">Upcoming Weather</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-8 rounded-xl shadow-md border-4 border-yellow-400 bg-white">
          { 
            gpsForecastData
            ? forecastWeather()
            : null
          }
          <div className="flex flex-col justify-center items-center border-4 border-yellow-400 w-60 h-64 p-4 rounded-xl shadow-md bg-yellow-400 hover:border-black transition duration-200 ease-in-out">
            <h1 className="text-xl">View More</h1>
            <img src="https://cdn-icons-png.flaticon.com/512/9794/9794283.png" className="w-[20%] mt-5"/>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>&copy; 2024 ClimaMate. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
