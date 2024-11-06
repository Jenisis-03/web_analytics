(function () {
    "use strict";
  
    var location = window.location;
    var document = window.document;
    var scriptElement = document.currentScript;
    var dataDomain = scriptElement.getAttribute("data-domain");
    var endpoint = "http://localhost:3000/api";

    let queryString = location.search
    const params=new URLSearchParams(queryString)
    var source = params.get("utm")
  
    function generateSessionId() {
      return "Session-" + Math.random().toString(36).substr(2, 9);
    }
  
    function initializeSession() {
      var sessionId = localStorage.getItem("session_id");
      var expirationTimestamp = localStorage.getItem("Session_Expiration_Time_Stamp");
  
      if (!sessionId || !expirationTimestamp || isSessionExpired(parseInt(expirationTimestamp))) {
        sessionId = generateSessionId();
        expirationTimestamp = Date.now() + 10 * 60 * 1000;
  
        localStorage.setItem("session_id", sessionId);
        localStorage.setItem("Session_Expiration_Time_Stamp", expirationTimestamp);
        trackSessionStart();
      }
  
      return {
        sessionId: sessionId,
        expirationTimestamp: parseInt(expirationTimestamp),
      };
    }
  
    function isSessionExpired(expirationTimestamp) {
      return Date.now() >= expirationTimestamp;
    }
  
    function checkSessionStatus() {
      var sessionStatus = initializeSession();
      if (isSessionExpired(sessionStatus.expirationTimestamp)) {
        localStorage.removeItem("session_id");
        localStorage.removeItem("Session_Expiration_Time_Stamp");
        trackSessionEnd();
        initializeSession();
      }
    }
  
    checkSessionStatus();
  
    function trigger(eventName, options) {
      var payload = {
        event: eventName,
        url: location.href,
        domain: dataDomain,
        source,

      };
  
      sendRequest(payload, options);
    }
  
    function sendRequest(payload, options) {
      var request = new XMLHttpRequest();
      request.open("POST", endpoint, true);
      request.setRequestHeader("Content-Type", "application/json");
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          options && options.callback && options.callback();
        }
      };
      request.send(JSON.stringify(payload));
    }
  
    var queue = (window.your_tracking && window.your_tracking.q) || [];
    window.your_tracking = trigger;
    for (var i = 0; i < queue.length; i++) {
      trigger.apply(this, queue[i]);
    }
  
    function trackPageView() {
      trigger("pageview");
    }
  
    function trackSessionStart() {
      trigger("session_start");
    }
  
    function trackSessionEnd() {
      trigger("session_end");
    }
  
    var initialPathname = window.location.pathname;
    trackPageView();
  
    window.addEventListener("popstate", trackPageView);
    window.addEventListener("hashchange", trackPageView);
  
    document.addEventListener("click", function (event) {
      setTimeout(() => {
        if (window.location.pathname !== initialPathname) {
          trackPageView();
          initialPathname = window.location.pathname;
        }
      }, 3000);
    });
  })();
  