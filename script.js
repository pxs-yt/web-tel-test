// Create a button
let btn = document.createElement("button");
btn.innerHTML = "Download Data";
document.body.appendChild(btn);

btn.addEventListener("click", function() {
    let data = {
        userAgent: navigator.userAgent,
        screenResolution: window.screen.width + "x" + window.screen.height,
        cookiesEnabled: navigator.cookieEnabled,
        popupEnabled: !window.open("about:blank", "_blank", "width=1,height=1,top=0,left=0").closed,
        batteryPercentage: null,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        systemLanguage: navigator.language,
        platform: navigator.platform,
        onlineStatus: navigator.onLine,
        browserName: navigator.appName,
        browserVersion: navigator.appVersion,
        localStorageQuota: null,
        sessionStorageQuota: null
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            data.geolocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        });
    }

    if (navigator.webkitTemporaryStorage && navigator.webkitPersistentStorage) {
        navigator.webkitTemporaryStorage.queryUsageAndQuota(function(usedBytes, grantedBytes) {
            data.localStorageQuota = grantedBytes;
        });

        navigator.webkitPersistentStorage.queryUsageAndQuota(function(usedBytes, grantedBytes) {
            data.sessionStorageQuota = grantedBytes;
        });
    }

    navigator.getBattery().then(function(battery) {
        data.batteryPercentage = battery.level * 100;

        // Create a downloadable file
        let file = new Blob([JSON.stringify(data)], {type: "text/plain"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = "data.txt";
        a.click();
    });
});