const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.getGymLocations = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");

  console.log("Received body:", req.body);

  try {
    if (!req.body) throw new Error("No request body");

    const { gymName, city, state } = req.body;

    // Validate fields
    if (!gymName?.trim() || !city?.trim() || !state?.trim()) {
      console.error("Validation failed:", { gymName, city, state });
      return res.status(400).json({
        error: "All fields are required",
        received: { gymName, city, state },
      });
    }

    const query = `${gymName.trim()}, ${city.trim()}, ${state.trim()}`;
    const apiKey = "AIzaSyDLdljkfHKd8Htb9s_JiXqjDLPWWiPWlZ0";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

    console.log("Calling Google API with:", url);
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) {
      return res.status(500).json({ error: "Invalid response from API", data });
    }

    const gymNameLower = gymName.trim().toLowerCase();

    const filteredResults = data.results.filter((place) => {
      const placeName = place.name.toLowerCase();
      const placeTypes = place.types || [];

      // Ensure the place is categorized as a gym or establishment
      const isGym = placeTypes.includes("gym") || placeTypes.includes("establishment");

      // Check if the gym name exists in the place name
      const isGymNameMatch = placeName.includes(gymNameLower);

      return isGym && isGymNameMatch;
    });

    console.log("Filtered results:", filteredResults);

    res.json({ status: "OK", results: filteredResults });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

