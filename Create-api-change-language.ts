async function resetPreferences(userId: number, language: string) {
    let authToken = ""
    let initialData = {}
    if (userId === 231740) {
        authToken = 'Token token="d01c2f26b758446a8d163b51de68a900"'
        initialData = {
            refresh: {
                tracking: 600,
                messaging: 60,
                sessionTimeout: 1800000,
            },
            language: language,
            mapType: "roadmap",
            mapLayerTraffic: true,
            vehicleMarker: "registrationNumber",
            vehicleMarkerVisibility: "onHover",
            clustering: true,
            temperatureTimeout: 28800000,
            trackingOutOfCoverageThreshold: 21600000,
            trackingTimeType: "months",
            trackingTimeValue: 30,
            trackingPositionUpdateInterval: 300000,
            showGeofences: true,
            showManagedGeofences: false,
            calculateDistance: true,
        }
    } else if (userId === 215050 || userId === 212984) {
        if (userId === 215050) {
            authToken = 'Token token="13c58cb1e89f4d52b89fea0b2def7e5c"'
        } else {
            authToken = 'Token token="d01c2f26b758446a8d163b51de68a900"'
        }

        initialData = {
            refresh: {
                tracking: 30,
                messaging: 1200,
                sessionTimeout: 28800000,
            },
            language: language,
            mapType: "roadmap",
            mapLayerTraffic: false,
            vehicleMarker: "vehicleNameDriverName",
            vehicleMarkerVisibility: "always",
            clustering: false,
            temperatureTimeout: 7200000,
            trackingOutOfCoverageThreshold: 21600000,
            trackingTimeType: "months",
            trackingTimeValue: 30,
            trackingPositionUpdateInterval: 300000,
            showGeofences: true,
            showManagedGeofences: false,
            calculateDistance: true,
            cardViewPinnedCards: { 14825: [] },
            cardViewSettings: { 14825: {} },
            trackingBeta: false,
        }
    }
    const url = "https://qa.api-au.xxxxxx.com/v1/users/" + userId.toString() + "/config/settings"
    const data = JSON.stringify(initialData)
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
        },
        body: data,
    })
    return response.text()
}

function setLanguage(userId: number, language: string) {
        let lang = ""
        cy.log("Setting language to: " + language)
        if (language === "English (United Kingdom)") {
            lang = "en-GB"
        } else if (language === "English (Australia)") {
            lang = "en-AU"
        } else if (language === "English (New Zealand)") {
            lang = "en-NZ"
        } else if (language === "English (United States)") {
            lang = "en-US"
        } else if (language === "English (Canada)") {
            lang = "en-CA"
        } else if (language === "English (Mexico)") {
            lang = "en-MX"
        } else if (language === "Spanish (Mexico)") {
            lang = "es-MX"
        } else {
            cy.log("Language '" + language + "' unknown")
        }
        const result = resetPreferences(userId, lang).catch((err) => {
            cy.log(err)
        })
        cy.wait("@putUserx").then((resp) => {
            expect(JSON.stringify(resp.response?.statusCode) === "200").to.be.true
        })
    }
