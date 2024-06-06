// Create a button
let btn = document.createElement("button");
btn.innerHTML = "Collect Data";
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
        sessionStorageQuota: null,
        ipAddress: null,
        webGLFingerprint: null,
        adBlocker: null,
        doNotTrack: null,
        connectionInfo: null,
        deviceMemory: null,
        hardwareConcurrency: null
    };

    // WebGL Fingerprinting
    let canvas = document.createElement('canvas');
    let gl = canvas.getContext('webgl');
    let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    data.webGLFingerprint = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    // Ad Blocker detection
    let test = document.createElement('div');
    test.innerHTML = ' ';
    test.className = 'adsbox';
    document.body.appendChild(test);
    window.setTimeout(function() {
        data.adBlocker = (test.offsetHeight === 0) ? true : false;
        test.remove();
    }, 100);

    // Do Not Track (DNT) setting
    data.doNotTrack = (navigator.doNotTrack == '1') ? true : false;

    // Connection information
    data.connectionInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    // Device memory
    data.deviceMemory = navigator.deviceMemory;

    // Hardware concurrency
    data.hardwareConcurrency = navigator.hardwareConcurrency;

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

    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(ipData => {
            data.ipAddress = ipData.ip;

            navigator.getBattery().then(function(battery) {
                data.batteryPercentage = battery.level * 100;

                // Create a downloadable file
                let file = new Blob([JSON.stringify(data, null, '\t')], {type: "application/json"});
                let a = document.createElement("a");
                a.href = URL.createObjectURL(file);
                a.download = data.ipAddress + ".json";
                a.click();
            });
        })
        .catch(error => console.error('Error:', error));
});
