const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToekn = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToekn});

module.exports.getGeoData = async function(location) {
    try {
        const geoData = await geoCoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        return geoData;
    } catch (e) {
        return { error: e.message };
    }
}