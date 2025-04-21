require('dotenv').config();
const functions = require("firebase-functions");
const fetch = require("node-fetch");

// Cloud Function to search for gym locations using Google Places API
exports.getGymLocations = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight and regular requests
  res.set("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS"); // Allow POST and OPTIONS methods
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow Content-Type and Authorization headers

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).send(); // Send an empty response for OPTIONS requests
  }

  console.log("Received body:", req.body);

  try {
    if (!req.body) throw new Error("No request body");

    const { gymName, city, state } = req.body;

    // Validate required input fields
    if (!gymName?.trim() || !city?.trim() || !state?.trim()) {
      console.error("Validation failed:", { gymName, city, state });
      return res.status(400).json({
        error: "All fields are required",
        received: { gymName, city, state },
      });
    }

    // Construct the search query for Google Places
    const query = `${gymName.trim()}, ${city.trim()}, ${state.trim()}`;
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleMapsApiKey}`;

    console.log("Calling Google API with:", url);
    const response = await fetch(url);
    const data = await response.json();

    // Handle unexpected API response
    if (!data.results) {
      return res.status(500).json({ error: "Invalid response from API", data });
    }

    const gymNameLower = gymName.trim().toLowerCase();

    // Filter results to match gym-related places and names
    const filteredResults = data.results.filter((place) => {
      const placeName = place.name.toLowerCase();
      const placeTypes = place.types || [];

      // Check if it's a gym or similar establishment
      const isGym = placeTypes.includes("gym") || placeTypes.includes("establishment");

      // Check if the place name includes the provided gym name
      const isGymNameMatch = placeName.includes(gymNameLower);

      return isGym && isGymNameMatch;
    });

    console.log("Filtered results:", filteredResults);

    res.json({ status: "OK", results: filteredResults });
  } catch (error) {
    // Catch and return detailed error info
    console.error("Full error:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});