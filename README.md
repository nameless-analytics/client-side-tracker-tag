# Nameless Analytics | Client-side Tracker Tag

The Nameless Analytics Client-side Tracker Tag is a highly customizable GTM custom template designed to send requests to the [Nameless Analytics Server-side Client Tag](https://github.com/nameless-analytics/nameless-analytics-server-side-client-tag). 

For an overview of how Nameless Analytics works [start from here](https://github.com/nameless-analytics/nameless-analytics/#high-level-data-flow).



## Table of Contents
* [Nameless Analytics Client-side Tracker Tag UI](#nameless-analytics-client-side-tracker-tag-ui)
* [Event data](#event-data)
  * [Event name](#event-name)
    * [Standard event name](#standard-event-name)
    * [Custom event name](#custom-event-name)
  * [Event parameters](#event-parameters)
    * [Add/override event level parameters](#addoverride-event-level-parameters)
    * [Remove event level parameters](#remove-event-level-parameters)
    * [Add event level parameters from dataLayer](#add-event-parameters-from-datalayer)
* [Configuration variable settings](#configuration-variable-settings)
  * [Configuration variable](#configuration-variable)
* [Advanced settings](#advanced-settings)
  * [Add ecommerce data from dataLayer](#add-ecommerce-data-from-datalayer)
  * [Disable logs in JavaScript console for this event](#disable-logs-in-javascript-console-for-this-event)
* [Execution messages](#execution-messages)
  * [Success messages](#success-messages) 
  * [Error messages](#error-messages) 



## Nameless Analytics Client-side Tracker Tag UI
This is the UI of the Nameless Analytics Client-side Tracker Tag.

![Nameless Analytics Client-side Tracker Tag UI](https://github.com/user-attachments/assets/30449ace-ae5d-4b1d-9b82-4af0a535ac18)



## Event data
### Event name
Choose between standard event names or custom event names. 

Please note:
- Always trigger a `page_view` event as the very first event on every page load. **Any event triggered before a `page_view` will be rejected.**
- Use standard event names whenever possible.
- Follow naming conventions for event names and event parameters.

#### Standard event name
Choose a standard event name for the event:

* page_view: Send this event when a page is viewed. Use this event for both standard and virtual page views. This is the only mandatory event.
* consent_update: Send this event when the user gives or withdraws consent to improve the accuracy of consent metrics.
* page_load_time: Send this event when a page is loaded (on the `gtm.load` JavaScript event) with these parameters:
  * time_to_dom_interactive: `performance.timing.domInteractive - performance.timing.responseStart`
  * page_render_time: `performance.timing.domComplete - performance.timing.domLoading`
  * time_to_dom_complete: `performance.timing.domComplete - performance.timing.responseStart`
  * total_page_load_time: `performance.timing.loadEventEnd - performance.timing.navigationStart` 
* page_closed: Send this event when a page is closed to improve the accuracy of `time_on_page`, `session_duration`, and other metrics.

#### Custom event name
Choose a custom event name for the event.

To maintain consistency between events, it is highly recommended to use _snake_case_ notation style (with underscores between words) to create descriptive, easily interpretable names. 

Examples:
* button_clicked
* form_submitted
* video_played

Avoid
* Spaces: button clicked
* Hyphens: button-clicked
* CamelCase: ButtonClicked


### Event parameters
Add event parameters for a specific event. The parameters will be added in the event_data object in the payload. 

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set.

This is the hierarchy of event parameter importance: 

See [Parameter Hierarchy & Overriding](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy--overriding) in the main project documentation.

#### Add/override event level parameters
Add or overwrite parameters for a specific event. Accepted values: strings, integers, floats, and JSON.

These parameters can override:
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable
- dataLayer event parameters added in Nameless Analytics Client-side Tracker Tag
- Default event parameters

These parameters can be overridden by:
- Event parameter added in Nameless Analytics Server-side Client Tag

#### Remove event level parameters
Remove event level parameters in event_data object in the payload.

#### Add event parameters from dataLayer
Retrieve current dataLayer values from the dataLayer.push() event that triggered the tag.

These parameters can override:
- Default event parameters

These parameters can be overridden by:
- Event parameters added in Nameless Analytics Server-side Client Tag
- Event parameters added in Nameless Analytics Client-side Tracker Tag
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable



## Configuration variable settings
### Configuration Variable
The Nameless Analytics Client-side Tracker Tag inherits configuration settings from [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/). 

This variable will handle settings like:
- [set requests endpoint domain name and path](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#server-side-endpoint-settings)
- [set user level parameters](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#user-parameters)
- [set session level parameters](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#session-parameters)
- [set common event parameters](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#event-parameters)
- [respect Google Consent Mode](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#respect-google-consent-mode)
- [enable cross-domain tracking](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#enable-cross-domain-tracking)
- [customize source and campaigns URL parameters](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#override-default-source-and-campaigns-url-query-parameters)
- [change default JavaScript page view event names](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#override-default-javascript-page-view-event-names)
- [load main library from custom location](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#load-javascript-libraries-in-first-party-mode)
- [add current dataLayer state](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#add-current-datalayer-state)
- [show logs in JavaScript console](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#enable-logs-in-javascript-console)



## Advanced settings
### Add ecommerce data from dataLayer
Add ecommerce data as a JSON object inside the ecommerce field.

Please note: 
- By default, the table function queries extract data from standard GA4 ecommerce data structure
- The data model can be customized to support any ecommerce data structure by modifying the relative JSON paths in the user, session, ecommerce, product and funnels table function queries


### Disable logs in JavaScript console for this event
Disable console log for this specific event when [Enable logs in JavaScript console](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#enable-logs-in-javascript-console) is enabled in the Nameless Analytics Client-side Tracker Configuration Variable. 



## Execution messages
### Success messages
When logs are enabled, the following success and status messages may appear in the browser console:

| **Scope** | **Message** | **Description** |
|:---|:---|:---|
| Config | `[event_name] > 🟢 Valid Nameless Analytics Client-Side tracker configuration variable` | Tag configuration variable is correctly set and verified |
| | `[event_name] > 🟢 UA parser library loaded from: [URL]` | The User-Agent parser library was successfully injected and loaded |
| | `[event_name] > 🟢 Main library loaded from: [URL]` | The Nameless Analytics core library was successfully injected and loaded |
| Consent | `[event_name] > 🟢 analytics_storage granted` | Tracking is allowed by Google Consent Mode |
| Events | `[event_name] > 🟢 Valid [event_name]` | The event was successfully built and validated |
| Cross-domain | `cross-domain > 🟢 Valid user data. Cross-domain URL link decoration will be applied` | Success log for `na_id` link decoration |


### Error messages
These messages appear in the browser console when an issue prevents the correct execution of the tag:

| **Scope** | **Message** | **What it means** | **How to fix it** |
|:---|:---|:---|:---|
| Config | `[event_name] > 🔴 Tracker configuration error: event has invalid Nameless Analytics Client-Side tracker configuration variable` | The tag is missing the required config variable or it's incorrectly set | Check the "Configuration Variable" field in the tag and ensure it points to a valid NA Config Variable |
| | `[event_name] > 🔴 Main library not loaded from: [URL]` | The browser couldn't fetch the core tracker script | Verify the URL in the Config Variable or check your network/CORS settings |
| | `[event_name] > 🔴 UA parser library not loaded from: [URL]` | The browser couldn't fetch the User-Agent parser script | Verify the library URL or check for ad-blockers/firewalls |
| | `[event_name] > 🔴 Permission denied: unable to load Main library from [URL]` | The GTM Sandbox is blocking the external script loading | Ensure the library URL is added to the "Inject Scripts" permission in the template |
| | `[event_name] > 🔴 Permission denied: unable to load UA parser library from [URL]` | The GTM Sandbox is blocking the external script loading | Ensure the library URL is added to the "Inject Scripts" permission in the template |
| Consent | `[event_name] > 🔴 Google Consent Mode not found` | The tag expects GCM to be active, but it's not initialized on the page | Ensure GCM is correctly implemented on the site before GTM loads |
| | `[event_name] > 🔴 analytics_storage denied` | Tracking is blocked by Google Consent Mode | This is expected behavior for users who opt-out |
| Events | `[event_name] > 🔴 Request aborted` | A generic issue stopped the tag execution | Check the previous logs in the console to find the specific cause |
| | `Page view / Virtual page view > 🔴 Page view / Virtual page view fired on wrong event: [name]` | The trigger is firing the Page view / Virtual page view tag on wrong dataLayer event name | Adjust the tag trigger to match the intended event (e.g., use `gtm.js` for page_view) |
| | `[event_name] > 🔴 Event fired before a page view event. The first event on a page view ever must be page_view. Request aborted` | Sequence error: an event was triggered before a `page_view` initialized the session | Reorder your triggers to ensure `page_view` always fires first |
| | `[event_name] > 🔴 Request refused` | The server rejected the request | Check the server-side tag logs for more details |
| | `[event_name] > 🔴 [error]` | A generic JavaScript error occurred during the fetch request | Check the browser console for details |
| | `[event_name] > 🔴 Request not sent successfully` | The network request failed | Check your internet connection and the server-side endpoint status |
| Cross-domain | `cross-domain > 🔴 Error while fetch user data: [error]` | The cross-domain listener failed to retrieve IDs from the server | Verify the server-side client is reachable |


---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [LinkedIn](https://www.linkedin.com/in/tommasomoretti/)
