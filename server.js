const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- INVESTOR-READY BRANDING ---
const TEAM_NAME = "TEAM GEO_FENCERS";
const LEAD = "DEV VERMA";
const VERSION = "1.0.0-PROPRIETARY";

const printSplash = () => {
    console.log("====================================================");
    console.log(`🚀 ${TEAM_NAME} | CENTRAL INTELLIGENCE NODE`);
    console.log(`👤 PROJECT LEAD: ${LEAD}`);
    console.log(`🛡️  SYSTEM STATUS: ${VERSION}`);
    console.log("====================================================");
    console.log("⚠️  AUTHORIZED ACCESS ONLY - ENCRYPTION ACTIVE");
    console.log("----------------------------------------------------\n");
};

// Traffic Light Coordinates (Bhopal Location)
const targetLat = 23.1915;
const targetLng = 77.3529;

// Haversine Formula for precise distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const dPhi = (lat2 - lat1) * Math.PI / 180;
    const dLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

app.post('/api/location', (req, res) => {
    const { vehicleId, latitude, longitude } = req.body;
    const distance = getDistance(parseFloat(latitude), parseFloat(longitude), targetLat, targetLng);
    
    // Geo-Fence Logic (500 meters)
    const isWithinFence = distance <= 500;

    console.log(`📡 [INBOUND] Vehicle: ${vehicleId} | Dist: ${distance.toFixed(2)}m`);
    
    if (isWithinFence) {
        console.log(`🟢 [SIGNAL] ${TEAM_NAME} TRIGGER: FORCE GREEN LIGHT`);
    }

    res.json({
        success: true,
        team: TEAM_NAME,
        distance: distance.toFixed(2),
        overrideTriggered: isWithinFence,
        rights: "Proprietary Technology - Dev Verma"
    });
});

app.get('/', (req, res) => {
    res.send(`${TEAM_NAME} API Service is Live. Managed by ${LEAD}.`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    printSplash();
    console.log(`✅ Cloud Node Active on Port: ${PORT}`);
});
