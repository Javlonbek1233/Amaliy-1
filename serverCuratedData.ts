/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination } from "./src/types";

export const CURATED_DESTINATIONS: Destination[] = [
  {
    id: "whispering-glen",
    name: "The Whispering Glen",
    tagline: "A sunken forest where silence itself is a sound.",
    description: "Tucked beneath a massive geothermal sinkhole, the Whispering Glen is home to ancient bioluminescent mosses and a microclimate wrapped in permanent mountain mist. Deciduous trees grow horizontally towards the light, and waterfalls slip soundlessly down smooth basalt walls.",
    lat: 34.2185,
    lng: -118.4912,
    image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1200",
    category: "forest",
    mysteryLevel: 4,
    coordinatesText: "34°13'06.6\"N, 118°29'28.3\"W",
    storytellingText: "For centuries, local shepherds spoke of the Glen as a site where words spoken in a whisper would resurface on the wind years later. Researchers have found that the basalt acoustics capture high-frequency vibrations in cave arches, reflecting soft sound signatures back after a prolonged delay.",
    gallery: [
      "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1518098268026-4e43a1a009de?auto=format&fit=crop&q=80&w=600"
    ],
    weather: {
      temp: "14°C",
      condition: "Whispering Mist",
      humidity: "92%",
      wind: "3 km/h East",
      moonPhase: "Waning Gibbous",
      mistDensity: "High"
    },
    guide: {
      id: "elara-moss",
      name: "Elara Moss",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      bio: "Elara has spent 14 years living in a wooden cabin near the southern ridge. She tracks moss propagation patterns and acoustics.",
      quote: "Seek the chambers where the shadow pools are deepest; that is where the trees learn to talk.",
      contactWhisper: "VHF Radio Ch 14, or look for the lantern set on the copper stump at twilight."
    },
    restaurants: [
      {
        id: "fern-hearth",
        name: "The Fern Hearth Cafe",
        type: "Secret Cafe",
        description: "An open-air stone pavilion serving warm chestnut teas and wild berry sourdough crumbles. Powered on geothermic steam vents.",
        specialty: "Smoky Dandelion Elixir & Steamed Moss-Loaf",
        image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=400",
        coordinates: "34.2189, -118.4920"
      }
    ],
    adventure: {
      id: "route-glen-ascent",
      name: "The Silent Canopy Loop",
      difficulty: "Moderate Trek",
      distance: "4.8 km",
      duration: "2.5 hours",
      points: [
        { lat: 34.2170, lng: -118.4900, label: "Basalt Grotto Trailhead" },
        { lat: 34.2185, lng: -118.4912, label: "The Resonance Chamber (Glen Core)" },
        { lat: 34.2205, lng: -118.4930, label: "The Overlook Bridge" }
      ],
      checklist: [
        "Noise-dampening footwear",
        "Moistureproof lantern",
        "Notebook for sound signatures",
        "Small piece of slate to leave at the stone pile"
      ]
    }
  },
  {
    id: "obsidian-eye",
    name: "The Obsidian Chasm",
    tagline: "A dark fissure where volcanic glass meets subterranean tides.",
    description: "Carved during an ancient tectonic event, this massive igneous gorge features walls made entirely of smooth, mirrored black glass. Subterranean glacial flows rush beneath the glass floor, generating a haunting, hollow rumble.",
    lat: 36.4321,
    lng: -116.8920,
    image: "https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&q=80&w=1200",
    category: "abyss",
    mysteryLevel: 5,
    coordinatesText: "36°25'55.6\"N, 116°53'31.2\"W",
    storytellingText: "Legend states that old cartographers intentionally wiped this canyon off national maps in 1891 to secure the pure springs beneath the black walls. Look for the faint miner runes carved near the deep water pool.",
    gallery: [
      "https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&q=80&w=600"
    ],
    weather: {
      temp: "8°C",
      condition: "Sublimating Air",
      humidity: "40%",
      wind: "18 km/h North",
      moonPhase: "New Moon",
      mistDensity: "Low"
    },
    guide: {
      id: "karl-vane",
      name: "Karl Vane",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      bio: "A retired geologist who spends his years analyzing the reflection indexing of volcanic obsidian deposits.",
      quote: "The black glass does not absorb light; it stores memories of everything that ever walked in front of it.",
      contactWhisper: "Carve a circular sigil in the salt flats near Mile-Marker 11, Karl will find you."
    },
    restaurants: [
      {
        id: "glass-vault",
        name: "The Mirror Vault Speakeasy",
        type: "Speakeasy",
        description: "A subterranean lounge built in a natural lava chamber. Serving clear distilled spirits cooled in glacial ice cores.",
        specialty: "Obsidian Smoke Sour & Glacial Drop Aperitif",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
        coordinates: "36.4310, -116.8905"
      }
    ],
    adventure: {
      id: "route-glass-crevice",
      name: "The Mirrored Crevice Traverse",
      difficulty: "Extreme Expedition",
      distance: "3.2 km",
      duration: "4 hours",
      points: [
        { lat: 36.4300, lng: -116.8930, label: "Salt Sinks Entry Point" },
        { lat: 36.4321, lng: -116.8920, label: "The Chasm Mirror" },
        { lat: 36.4350, lng: -116.8900, label: "Lava Column Exit" }
      ],
      checklist: [
        "Rubber-spiked climbing boots",
        "High-output headlights (minimum 1000 lumens)",
        "Gloves resistant to volcanic silica shards",
        "Emergency climbing harnesses"
      ]
    }
  },
  {
    id: "echoing-monolith",
    name: "The Sunken Beacon of Kamura",
    tagline: "A half-sunked medieval lighthouse in a tide pool.",
    description: "Erected on a jagged shoreline, the Beacon of Kamura was abandoned when a seismic shift caused the bedrock to slide fifteen meters into a brackish shelf. Today, oceanic currents funnel through its derelict stairwells, generating melodic marine acoustic tones during tide shifts.",
    lat: 38.6111,
    lng: -123.0125,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    category: "shore",
    mysteryLevel: 3,
    coordinatesText: "38°36'40.0\"N, 123°00'45.0\"W",
    storytellingText: "During dark-moon weeks, travelers witness faint green luminescent tides gathered in circle patterns enclosing the tower. Oceanographers attribute this to specialized bioluminescent plankton trapped in the deep reef chamber.",
    gallery: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"
    ],
    weather: {
      temp: "11°C",
      condition: "Oceanic Swell Mist",
      humidity: "85%",
      wind: "28 km/h West",
      moonPhase: "First Quarter",
      mistDensity: "Medium"
    },
    guide: {
      id: "captain-reid",
      name: "Captain Reid",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      bio: "A retired harbor master who maps underwater cave chambers and preserves old maritime lighthouse logs.",
      quote: "The ocean doesn't try to drown the lighthouse; it's simply trying to play it like a flute.",
      contactWhisper: "Hang a yellow sash on the pine tree near Salmon Cove, wait for the tide to turn low."
    },
    restaurants: [
      {
        id: "kelp-diner",
        name: "Marine Shelf Cafe",
        type: "Hidden Diner",
        description: "A rusty wood-shack diner offering hot cod stews, sea-salt bread biscuits, and kelp-infused butter.",
        specialty: "Seawater Brine Biscuits & Charcoal Smoked Cod",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400",
        coordinates: "38.6115, -123.0130"
      }
    ],
    adventure: {
      id: "route-tidal-beacon",
      name: "The Low-Tide Tower Traverse",
      difficulty: "Mystic Ascent",
      distance: "2.1 km",
      duration: "1.5 hours (Time Window Limited)",
      points: [
        { lat: 38.6090, lng: -123.0140, label: "Tide-Pool Basin Area" },
        { lat: 38.6111, lng: -123.0125, label: "The Submerged Staircase" }
      ],
      checklist: [
        "Tide schedule charts (verified)",
        "Waterproof boots (above knee)",
        "Strobe beacons for rescue signaling",
        "Saltwater resistant tools"
      ]
    }
  },
  {
    id: "forgotten-sanctuary",
    name: "Sanctuary of the Seven Pillars",
    tagline: "An overgrown, forgotten chapel buried inside an old stone quarry.",
    description: "Hidden in plain sight behind active limestone mountains, this structure was built in 1432 by ascetic stonecarvers. Left behind when the quarry flooded, it remains pristine, standing tall inside an amphitheater of tall limestone monoliths and hanging ivy.",
    lat: 41.1120,
    lng: -74.1500,
    image: "https://images.unsplash.com/photo-1518098268026-4e43a1a009de?auto=format&fit=crop&q=80&w=1200",
    category: "sanctuary",
    mysteryLevel: 5,
    coordinatesText: "41°06'43.2\"N, 74°09'00.0\"W",
    storytellingText: "The carvers who formed these vaults intentionally crafted the hollow chambers to resonate with incoming thunderstorms. A heavy cloudburst creates a natural organ-like drone vibrating directly out of the hollow pillars.",
    gallery: [
      "https://images.unsplash.com/photo-1518098268026-4e43a1a009de?auto=format&fit=crop&q=80&w=600"
    ],
    weather: {
      temp: "16°C",
      condition: "Looming Rain",
      humidity: "78%",
      wind: "12 km/h South-West",
      moonPhase: "Waxing Crescent",
      mistDensity: "Low"
    },
    guide: {
      id: "brother-simon",
      name: "Brother Simon",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      bio: "An archivist of local historical relics who quieted his academic life to guard the sanctuary's stone arches.",
      quote: "Men carved these pillars not to hold the ceiling, but to divide the light into holy ribbons.",
      contactWhisper: "Sit silently in the quarry basin on a rainy Tuesday; Simon will bring you a warm cup of herbal tea."
    },
    restaurants: [
      {
        id: "quarry-refectory",
        name: "Abbey Stone Refectory",
        type: "Underground Restaurant",
        description: "Built in the old quarry office, this stone dining hall serves hearty baked soups and rosemary focaccia.",
        specialty: "Roasted Wild Mushroom Stew & Elderberry Cider",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=400",
        coordinates: "41.1125, -74.1510"
      }
    ],
    adventure: {
      id: "route-stone-pillars",
      name: "The Ascetic's Quarry Path",
      difficulty: "Easy Walk",
      distance: "3.5 km",
      duration: "1.8 hours",
      points: [
        { lat: 41.1105, lng: -74.1520, label: "Limestone Gate trailhead" },
        { lat: 41.1120, lng: -74.1500, label: "The Overgrown Amphitheater" }
      ],
      checklist: [
        "Light hiking boots",
        "Camera with low-light capability",
        "Raincoat for incoming quarry storms",
        "Absolute silence when in the nave"
      ]
    }
  }
];
