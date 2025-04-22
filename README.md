# Weather Application

A responsive weather application built with React, TypeScript, TailwindCSS, and the OpenWeather API. Users are able to search real-time weather data by city and country, view results, toggle backgrounds, and have a stored search history.
There is also a weather news component in the weather application that shows a scrolling weather description of 6 countries in South East Asia upon loading.

## Features

- Built with React and TypeScript
- Search weather by City or by City with Country
- UI for weather info, inputs, and search history, styled with TailwindCSS
- Get the searched city's weather, temperature, and time of the searched city
- Stored search history using localStorage, with date and timestamp of the search in the local time of the user performing the search
- Switchable background themes (light/dark mode)
- Responsive layout for desktop and smaller devices (e.g. mobile)
- Weather News Component that shows the weather description of 6 countries in South East Asia when page loads

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Material UI Icons
- OpenWeather API
- LocalStorage

## Getting Started

### 1. Clone the repository

### 2. Install packages / dependencies

- cd weather-today (if not in weather-today file path)
- npm install

### 3. Set up environment variable

Create a .env file in the root directory (weather-today) and add your OpenWeather API key:

REACT_APP_API_KEY=add_the_api_key

- You may use the provided .env.example as a template and run this command to copy .env.example to .env
- cp .env.example .env
- Then add your API key after 'REACT_APP_API_KEY='
