import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  const { interest } = await req.json();

  const prompt = `
You are a travel expert for Nepal specializing in offbeat and hidden travel destinations.

Given this tourist interest: "${interest}", generate 9 beautiful travel destinations in Nepal focusing on remote or lesser-known locations.

For each destination, return a detailed itinerary and essential data in STRICT JSON array format. 
Do NOT include any explanations, markdown, or additional text — only a valid JSON array.

Each destination object must have the following keys:

[
  {
    "name": "String - name of destination",
    "region": "String - province or district",
    "description": "String - 2 to 3 lines describing the destination and its hidden charm",
    "best_time_to_visit": "String - e.g. 'October to December'",
    "latitude": "Number - approximate latitude",
    "longitude": "Number - approximate longitude",
    "nearest_city": "String - nearest major city or hub",
    "distance_from_nearest_city_km": "Number - estimated distance in kilometers",
    "map_url": "String - Google Maps link to the destination",
    "highlights": [
      "String - key attraction 1",
      "String - key attraction 2",
      "String - key attraction 3"
    ],
    "itinerary": {
      "day_1": "String - arrival and first experience",
      "day_2": "String - main exploration activities",
      "day_3": "String - local experience or hidden trail"
    },
    "local_businesses": [
      {
        "name": "String - homestay, cafe, or guide",
        "type": "String - e.g. 'Homestay', 'Guide', 'Cafe'",
        "contact_info": "String - phone or social media handle if available"
      }
    ]
  }
]
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    text = text.replace(/```json|```/g, "").trim();

    let destinations;
    try {
      destinations = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini output:", text);
      throw new Error("Gemini did not return valid JSON.");
    }

    const destinationsWithImages = await Promise.all(
      destinations.map(async (dest) => {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              dest.name + " Nepal"
            )}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
          );
          const data = await res.json();
          const imageUrl = data.results?.[0]?.urls?.regular || null;

          return {
            ...dest,
            image_url: imageUrl,
          };
        } catch (err) {
          console.error(`Unsplash error for ${dest.name}:`, err);
          return { ...dest, image_url: null };
        }
      })
    );

    return NextResponse.json({ destinations: destinationsWithImages });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content", message: error.message },
      { status: 500 }
    );
  }
}
