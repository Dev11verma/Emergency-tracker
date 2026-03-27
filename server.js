const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- THE TRAFFIC LIGHT DATA ---
// A dummy traffic light set just a few hundred meters from your current location
const TARGET_LIGHT_LAT = 23.192500; 
const TARGET_LIGHT_LNG = 77.353500;
const GEO_FENCE_RADIUS = 500; // 500 meters

// --- THE MATH: Haversine Formula ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Returns distance in meters
}

// --- THE MAIN API ENDPOINT ---
app.post('/api/location', (req, res) => {
    const { vehicleId, latitude, longitude, timestamp } = req.body;

    // 1. Calculate the distance
    const distanceToLight = calculateDistance(latitude, longitude, TARGET_LIGHT_LAT, TARGET_LIGHT_LNG);
    
    console.log(`\n📡 [UPDATE] Vehicle: ${vehicleId} | Lat: ${latitude}, Lng: ${longitude}`);
    console.log(`📏 Distance to next traffic light: ${Math.round(distanceToLight)} meters`);

    // 2. The Geo-Fence Logic
    let triggerHardware = false;
    
    if (distanceToLight <= GEO_FENCE_RADIUS) {
        console.log(`🚨 [GEO-FENCE BREACHED] Ambulance within ${GEO_FENCE_RADIUS}m!`);
        console.log(`🟢 SENDING INTERRUPT TO ARDUINO: FORCE GREEN LIGHT!`);
        triggerHardware = true;
    } else {
        console.log(`🚦 Ambulance outside radius. Normal traffic cycle continues.`);
    }

    // 3. Send response back to the browser
    res.status(200).json({ 
        message: "Data processed", 
        distance: Math.round(distanceToLight),
        overrideTriggered: triggerHardware
    });
});

app.listen(PORT, () => {
    console.log(`✅ Smart Geo-Fencing Server running on http://localhost:${PORT}`);
});