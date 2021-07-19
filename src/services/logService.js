// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";

function init() {
    // Sentry.init({
    //     dsn: "https://c02d701416d44956a7e0e4f37e78b6a2@o510633.ingest.sentry.io/5606575",
    //     autoSessionTracking: true,
    //     integrations: [
    //         new Integrations.BrowserTracing(),
    //     ],
    //     // We recommend adjusting this value in production, or using tracesSampler
    //     // for finer control
    //     tracesSampleRate: 1.0,
    // });
}

function log(error) {
    console.log(error);
    // Sentry.captureException(error);
}

export default {
    init,
    log
};