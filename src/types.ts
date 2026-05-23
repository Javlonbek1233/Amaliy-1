/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeatherInfo {
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  moonPhase: string;
  mistDensity: string;
}

export interface LocalGuide {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  quote: string;
  contactWhisper: string;
}

export interface FoodSpot {
  id: string;
  name: string;
  type: "Secret Cafe" | "Hidden Diner" | "Underground Restaurant" | "Speakeasy";
  description: string;
  specialty: string;
  image: string;
  coordinates: string;
}

export interface AdventureRoute {
  id: string;
  name: string;
  difficulty: "Easy Walk" | "Moderate Trek" | "Extreme Expedition" | "Mystic Ascent";
  distance: string;
  duration: string;
  points: { lat: number; lng: number; label: string }[];
  checklist: string[];
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
  category: "ruins" | "sanctuary" | "shore" | "abyss" | "forest";
  mysteryLevel: number; // 1 to 5 stars
  coordinatesText: string;
  guide: LocalGuide;
  weather: WeatherInfo;
  restaurants: FoodSpot[];
  adventure: AdventureRoute;
  storytellingText: string;
  gallery: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AISuggestionRequest {
  keyword?: string;
  atmosphere?: string;
  category?: string;
  nearCoordinates?: string;
}
