const axios = require("axios").default;

const API_KEY = "your_api_key_here";
const API_USERNAME = "your_api__account_username_here";
const API_PASSWORD = "your_api_account_password_here";
const VEHICLE_VIN = "your_vehicle_vin_here";
const VEHICLE_PIN = 9999;

const defaultConfig = {
    baseURL: "https://api.stellantis-developers.com", params: {}, headers: {
        'x-api-key': API_KEY, 'user': API_USERNAME, 'password': API_PASSWORD,
    }, data: {}
}
let space_sdk = axios.create(defaultConfig);

async function getBearerToken() {
    try {
        const response = await space_sdk.post('/v1/auth/token');
        return response.data.access_token;
    } catch (error) {
        console.error(error);
    }
}

function setBearerToken(bearerToken) {
    space_sdk.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${bearerToken}`
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
}

async function getLastKnownData(vin) {
    try {
        return await space_sdk.get(`/v1/${vin}/data/lastknown`);
    } catch (error) {
        console.error(error);
    }
}

async function getTwentyFourHourData(vin) {
    try {
        return await space_sdk.get(`/v1/${vin}/data`);
    } catch (error) {
        console.error(error);
    }
}

async function postRemoteCommand(vin, pin, command) {
    try {
        return await space_sdk.post(`/v1/${vin}/remote`, {
            "command": command, "pin": pin
        });
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    let bearerToken = await getBearerToken();
    setBearerToken(bearerToken);
    let lastKnownDataResponse = await getLastKnownData(VEHICLE_VIN);
    let twentyFourHourDataResponse = await getTwentyFourHourData(VEHICLE_VIN);
    //console.log(lastKnownDataResponse.data.Items.length);
    //console.log(twentyFourHourDataResponse.data.Items.length);
    let postRemoteCommandResponse = await postRemoteCommand(VEHICLE_VIN, VEHICLE_PIN, "LOCK");
    //console.log(postRemoteCommandResponse.data)
}

main();