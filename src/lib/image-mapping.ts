import { Driver } from "./types";

// Map driver numbers to filenames
// Users can populate public/drivers/2025/ with these filenames
const driverImageMap: Record<number, string> = {
  1: "verstappen.png",   // Max Verstappen
  4: "norris.png",       // Lando Norris
  16: "leclerc.png",     // Charles Leclerc
  44: "hamilton.png",    // Lewis Hamilton
  63: "russell.png",     // George Russell
  55: "sainz.png",       // Carlos Sainz
  14: "alonso.png",      // Fernando Alonso
  18: "stroll.png",      // Lance Stroll
  10: "gasly.png",       // Pierre Gasly
  31: "ocon.png",        // Esteban Ocon (Haas in 2025)
  23: "albon.png",       // Alexander Albon
  22: "tsunoda.png",     // Yuki Tsunoda
  81: "piastri.png",     // Oscar Piastri
  11: "perez.png",       // Sergio Perez
  43: "colapinto.png",   // Franco Colapinto
  30: "lawson.png",      // Liam Lawson
  27: "hulkenberg.png",  // Nico Hulkenberg (Sauber in 2025)
  77: "bottas.png",      // Valtteri Bottas (If driving)
  24: "zhou.png",        // Guanyu Zhou (If driving)
  20: "magnussen.png",   // Kevin Magnussen (If driving)
  3: "ricciardo.png",    // Daniel Ricciardo (If driving)
  2: "sargeant.png",     // Logan Sargeant (Unlikely)
  // New/Rookies (Assignments may vary)
  12: "antonelli.png",   // Kimi Antonelli
  87: "bearman.png",     // Oliver Bearman
  // Add others as confirmed
};

const teamLogoMap: Record<string, string> = {
  "Red Bull Racing": "redbull.png",
  "Mercedes": "mercedes.png",
  "Ferrari": "ferrari.png",
  "McLaren": "mclaren.png",
  "Aston Martin": "astonmartin.png",
  "Alpine": "alpine.png",
  "Williams": "williams.png",
  "RB": "rb.png",
  "Kick Sauber": "sauber.png",
  "Haas F1 Team": "haas.png",
  // Fallbacks for variations
  "Haas": "haas.png",
  "Sauber": "sauber.png",
  "Racing Bulls": "rb.png",
};

const carImageMap: Record<string, string> = {
  "Red Bull Racing": "redbull.png",
  "Mercedes": "mercedes.png",
  "Ferrari": "ferrari.png",
  "McLaren": "mclaren.png",
  "Aston Martin": "astonmartin.png",
  "Alpine": "alpine.png",
  "Williams": "williams.png",
  "RB": "rb.png",
  "Kick Sauber": "sauber.png",
  "Haas F1 Team": "haas.png",
  // Fallbacks
  "Haas": "haas.png",
  "Sauber": "sauber.png",
  "Racing Bulls": "rb.png",
};

export function getCarImage(teamName: string): string {
  if (!teamName) return "/cars/placeholder.svg";
  
  // Try exact match
  let filename = carImageMap[teamName];
  
  // Try partial match if not found
  if (!filename) {
    const key = Object.keys(carImageMap).find(k => teamName.includes(k) || k.includes(teamName));
    if (key) filename = carImageMap[key];
  }
  
  if (filename) {
    return `/cars/2025/${filename}`;
  }
  
  return "/cars/placeholder.svg";
}

export function getTeamLogo(teamName: string): string {
  if (!teamName) return "/teams/placeholder.svg";
  
  // Try exact match
  let filename = teamLogoMap[teamName];
  
  // Try partial match if not found
  if (!filename) {
    const key = Object.keys(teamLogoMap).find(k => teamName.includes(k) || k.includes(teamName));
    if (key) filename = teamLogoMap[key];
  }
  
  if (filename) {
    return `/teams/2025/${filename}`;
  }
  
  return "/teams/placeholder.svg";
}

export function getDriverImage(driver: Driver): string {
  // If API provides an image, use it (rare for OpenF1 currently)
  if (driver.headshot_url) {
    return driver.headshot_url;
  }

  // Check if we have a mapped local image
  const filename = driverImageMap[driver.driver_number];
  if (filename) {
    // Note: In a real app we might want to check if file exists, 
    // but client-side checking is hard. We assume if mapped, it exists.
    // For now, we will assume the user will populate these.
    // To avoid broken images, we could fallback in the UI component on error.
    return `/drivers/2025/${filename}`;
  }

  // Fallback placeholder
  return "/drivers/placeholder.svg";
}
