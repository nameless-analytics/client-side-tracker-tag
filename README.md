# Nameless Analytics | Client-side Tracker Tag

The Nameless Analytics Client-side Tracker Tag is a highly customizable GTM custom template designed to send requests to the [Nameless Analytics Server-side Client Tag](https://github.com/nameless-analytics/server-side-client-tag).

For an overview of how Nameless Analytics works [start from here](https://github.com/nameless-analytics/nameless-analytics/#overview).


### 🚧 Nameless Analytics and the documentation are currently in beta and subject to change


## Table of Contents

- [Nameless Analytics Client-side Tracker Tag UI](#nameless-analytics-client-side-tracker-tag-ui)
- [Event data](#event-data)
  - [Event name](#event-name)
    - [Standard event name](#standard-event-name)
    - [Custom event name](#custom-event-name)
  - [Event parameters](#event-parameters)
    - [Add/override event level parameters](#addoverride-event-level-parameters)
    - [Remove event level parameters](#remove-event-level-parameters)
    - [Add event level parameters from dataLayer](#add-event-level-parameters-from-datalayer)
- [Configuration variable settings](#configuration-variable-settings)
  - [Configuration variable](#configuration-variable)
- [Advanced settings](#advanced-settings)
  - [Add ecommerce data from dataLayer](#add-ecommerce-data-from-datalayer)
  - [Disable logs in JavaScript console for this event](#disable-logs-in-javascript-console-for-this-event)
- [Verifying the setup](#verifying-the-setup)
  - [CHECKING CROSS-DOMAIN ID](#checking-cross-domain-id)
  - [CHECKING CONFIGURATION VARIABLE](#checking-configuration-variable)
  - [CHECKING SERVER-SIDE ENDPOINT](#checking-server-side-endpoint)
  - [TRACKER TAG CONFIGURATION](#tracker-tag-configuration)
  - [LOADING LIBRARIES](#loading-libraries)
  - [CHECKING GOOGLE CONSENT MODE](#checking-google-consent-mode)
  - [ENABLING CROSS-DOMAIN TRACKING](#enabling-cross-domain-tracking)
  - [CHECKING EVENT](#checking-event)
  - [SENDING REQUEST, PROCESSING STATUS and REQUEST STATUS](#sending-request-processing-status-and-request-status)
  - [Cross-domain handshake](#cross-domain-handshake)
  - [Processing status values](#processing-status-values)
- [Troubleshooting](#troubleshooting)



## Nameless Analytics Client-side Tracker Tag UI
The Nameless Analytics Client-side Tracker Tag is designed to simplify complex tracking implementations with a seamless GTM integration.

It provides a structured interface to configure event names, manage deep parameter hierarchies, and handle advanced tracking settings without writing custom code.

This is the UI of the Nameless Analytics Client-side Tracker Tag.

![Nameless Analytics Client-side Tracker Tag UI](https://github.com/user-attachments/assets/2dcce31e-513b-413d-b77e-deca4a37c22c)



## Event data
### Event name
Choose between standard event names or custom event names.

Please note:
- Always trigger a `page_view` event as the very first event on every page load. **Any event triggered before a `page_view` will be rejected.**
- Use standard event names whenever possible.
- Follow naming conventions for event names and event parameters.

#### Standard event name
- page_view: Send this event when a page is viewed. Use this event for both standard and virtual page views. This is the only mandatory event
- consent_update: Send this event when the user gives or withdraws consent to improve the accuracy of consent metrics
- page_load_time: Send this event when a page is loaded
- page_closed: Send this event when a page is closed to improve the accuracy of `time_on_page`, `session_duration`, and other metrics
- search_result_view: Send this event when a search results page is viewed
- search_result_click: Send this event when a search result is clicked
- login: Send this event when a user logs in. It overwrites the session `user_id` with the value carried by the event
- logout: Send this event when a user logs out. It clears the session `user_id`, setting it to `null`
- sign_up: Send this event when a user creates an account
- new_lead: Send this event when a user submits a form
- newsletter_sign_up: Send this event when a user subscribes to a newsletter

`login` and `logout` are the only two events the Server-side Client Tag handles specially: renaming them breaks that behaviour silently, and the session `user_id` simply stops being updated. See [User ID lifecycle](https://github.com/nameless-analytics/nameless-analytics/#user-id-lifecycle).

For more information see [Setup Guides](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/SETUP-GUIDES.md#how-to-track-standard-events).

#### Custom event name
Choose a custom event name for the event.

To maintain consistency between events, it is highly recommended to use _snake_case_ notation style (with underscores between words) to create descriptive, easily interpretable names.

Examples:
- click_button
- start_configuration
- play_video

Avoid:
- Spaces: button clicked
- Hyphens: button-clicked
- CamelCase: ButtonClicked


### Event parameters
Add, override or remove event parameters in the event_data object. See [Parameter Hierarchy](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy) in the main project documentation.

They will be sent to BigQuery with every event.

These event parameters are reserved and can't be modified:
- event_type
- channel_grouping
- source
- campaign
- campaign_id
- campaign_click_id
- campaign_term
- campaign_content
- user_agent
- browser_name
- browser_language
- browser_version
- device_type
- device_vendor
- device_model
- os_name
- os_version
- screen_size
- viewport_size
- tld_source
- city
- country
- cross_domain_id

#### Add/override event level parameters
Add or overwrite parameters for a specific event. Accepted values: strings, integers, floats, JSON and booleans.

These settings can override:
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable
- event parameters from dataLayer added in Nameless Analytics Client-side Tracker Tag

These settings can be overridden by:
- Event parameter added in Nameless Analytics Server-side Client Tag

#### Remove event level parameters
Remove event level parameters by name in event_data object in the payload.

These settings can remove:
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable
- Event parameters from dataLayer added in Nameless Analytics Client-side Tracker Tag

#### Add event level parameters from dataLayer
Add event parameters from the dataLayer.push() event that triggered the tag. Accepted values: strings, integers, floats, JSON and booleans.

These parameters can be overridden by:
- Event parameters added in Nameless Analytics Server-side Client Tag
- Event parameters added in Nameless Analytics Client-side Tracker Tag
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable



## Configuration variable settings
### Configuration variable
The Nameless Analytics Client-side Tracker Tag inherits configuration settings from [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/).

This variable will handle settings like:
- add user level parameters
- add user id
- set session level parameters
- add page status code
- override default page parameters
- add shared event level parameters
- add server-side endpoint domain name and path
- set if Google Consent Mode is respected
- override default acquisition parameters
- enable cross-domain tracking
- load JavaScript libraries in first-party mode
- custom library domain name and path
- add current dataLayer state
- enable logs in JavaScript console



## Advanced settings
### Add ecommerce data from dataLayer
Add ecommerce data as a JSON object inside the ecommerce field.

Please note:
- By default, the table function queries extract data from standard GA4 ecommerce data structure
- The data model can be customized to support any ecommerce data structure by modifying the relative JSON paths in the user, session, ecommerce, product and funnels [table function queries](https://github.com/nameless-analytics/nameless-analytics/tree/main/tables)


### Disable logs in JavaScript console for this event
Disable console log for this specific event when [Enable logs in JavaScript console](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console) is enabled in the Nameless Analytics Client-side Tracker Configuration Variable.



## Verifying the setup
When logs are enabled in the [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console), the tag prints its progress to the browser console, one block per stage. Every line is prefixed with the event name, so several tags firing on the same page stay readable.

This is the console output of a successful `page_view`:

```text
page_view > NAMELESS ANALYTICS
page_view > CHECKING CONFIGURATION VARIABLE
page_view >   🟢 Valid Nameless Analytics Client-side Tracker Configuration Variable
page_view > CHECKING SERVER-SIDE ENDPOINT
page_view >   🟢 Valid server-side endpoint
page_view > TRACKER TAG CONFIGURATION
page_view >   👉 Server-side requests endpoint path: /na/collect
page_view >   👉 Load libraries in first-party mode: No
page_view >   👉 Enable cross-domain tracking? No
page_view >   👉 Respect Google Consent Mode? Yes
page_view > LOADING LIBRARIES
page_view >   🟢 UA parser library loaded from: https://cdn.jsdelivr.net/npm/ua-parser-js@1.0.40/dist/ua-parser.pack.min.js
page_view >   🟢 Main library loaded from: https://cdn.jsdelivr.net/gh/nameless-analytics/client-side-tracker-tag@main/lib/nameless-analytics_v1.0.0.min.js
page_view > CHECKING GOOGLE CONSENT MODE
page_view >   🟢 analytics_storage granted
page_view > CHECKING EVENT
page_view >   🟢 Valid page_view event
page_view > SENDING REQUEST
page_view >   👉 Payload data: {…}
page_view > PROCESSING STATUS
page_view >   👉 Claim request: success
page_view >   👉 Firestore: success
page_view >   👉 BigQuery: success
page_view >   👉 Custom Endpoint: skipped
page_view > REQUEST STATUS
page_view >   🟢 Request processed successfully
```

Reading it top to bottom tells you how far the tag got. The block that does **not** appear is the one that tells you where it stopped.

The stages below are listed in the order they are printed. Any block can be missing: it simply means the corresponding feature is off or the tag never reached it.


### CHECKING CROSS-DOMAIN ID
Printed only on the first `page_view` of a page reached through a decorated cross-domain link, that is when the URL carries an `na_id` parameter.

| Message | Meaning |
|:---|:---|
| `🟢 Valid cross-domain ID` | The value was decoded and its structure and timestamp are valid. The original `session_id` is sent as `cross_domain_id` |
| `🟠 Expired cross-domain ID` | Valid structure, but generated more than five minutes ago |
| `🔴 Invalid cross-domain ID: unable to decode na_id` | The value is not valid Base64 |
| `🔴 Invalid cross-domain ID: invalid format` | The decoded value does not follow the `{session_id}.{decoration_timestamp_ms}` structure |
| `🔴 Invalid cross-domain ID: invalid session_id format` | The structure is correct but the `session_id` is not 15 alphanumeric characters, an underscore, 15 alphanumeric characters |
| `🔴 Invalid cross-domain ID` | The timestamp is invalid or set in the future |

In every case except the first the value is discarded, `cross_domain_id` stays `null` and the event is sent anyway: the destination resolves identity from its own cookies. See [Cross-domain architecture](https://github.com/nameless-analytics/nameless-analytics/#cross-domain-architecture).


### CHECKING CONFIGURATION VARIABLE

| Message | Meaning |
|:---|:---|
| `🟢 Valid Nameless Analytics Client-side Tracker Configuration Variable` | The configuration variable is present and recognised |
| `🔴 Tracker configuration error: event has invalid Nameless Analytics Client-side Tracker Configuration Variable` | The **Configuration variable** field is empty or points to a variable of another type. The tag stops here |

This check runs before anything else, so its error is printed even when console logs are disabled: the log setting itself lives in the configuration variable, and cannot be read when the variable is invalid.


### CHECKING SERVER-SIDE ENDPOINT

| Message | Meaning |
|:---|:---|
| `🟢 Valid server-side endpoint` | Domain and path resolve to a usable endpoint |
| `🔴 Unable to send request. Unauthorized domain: [hostname]` | The current hostname has no endpoint configured. The next line, `👉 No endpoint configured for this hostname`, shows the computed value |
| `🔴 Invalid server-side endpoint domain: [domain]` | The domain contains a protocol or a path. The next line shows the computed value |

Both errors stop the tag, and `REQUEST STATUS` closes with `🔴 Request aborted`.


### TRACKER TAG CONFIGURATION
Four informational lines that echo the resolved configuration. They carry no status: they exist to confirm what the tag is actually using, which is the fastest way to spot a configuration variable that is not the one you edited.

```text
page_view >   👉 Server-side requests endpoint path: /na/collect
page_view >   👉 Load libraries in first-party mode: No
page_view >   👉 Enable cross-domain tracking? No
page_view >   👉 Respect Google Consent Mode? Yes
```


### LOADING LIBRARIES

| Message | Meaning |
|:---|:---|
| `🟢 UA parser library loaded from: [URL]` | The User-Agent parser was injected and loaded |
| `🟢 Main library loaded from: [URL]` | The Nameless Analytics core library was injected and loaded |
| `🔴 UA parser library not loaded from: [URL]` | The browser could not fetch the script, often an ad blocker on the CDN |
| `🔴 Main library not loaded from: [URL]` | Same, for the core library |
| `🔴 Permission denied: unable to load Main library from [URL]` | The GTM sandbox refused the injection: the URL is not in the **Inject Scripts** template permission |
| `🔴 Permission denied: unable to load UA parser library from [URL]` | Same, for the parser |

Any of the four errors stops the tag with `🔴 Request aborted`. See [How to set up first-party library hosting](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/SETUP-GUIDES.md#how-to-set-up-first-party-library-hosting).


### CHECKING GOOGLE CONSENT MODE
Printed only when **Respect Google Consent Mode** is enabled. The `na_temp` messages belong to this block: they describe how the acquisition context is preserved while consent is missing.

| Message | Meaning |
|:---|:---|
| `🟢 analytics_storage granted` | Tracking is allowed and the event proceeds |
| `🟢 Temp cookie found: [JSON]` | Acquisition data was recovered from the `na_temp` cookie |
| `🟢 Temp cookie saved: [JSON]` | Consent is denied: acquisition data was stored in `na_temp` for later |
| `🟢 Temp cookie deleted` | Consent has been granted and the cookie is no longer needed |
| `🔴 analytics_storage denied` | Consent is denied. The event is held until consent is granted |
| `🔴 Google Consent Mode not found` | Consent Mode is not present on the page. The tag stops with `🔴 Request aborted` |


### ENABLING CROSS-DOMAIN TRACKING
Printed on the first `page_view` only, and only when **Enable cross-domain tracking** is on.

```text
page_view > ENABLING CROSS-DOMAIN TRACKING
page_view >   👉 Cross-domain enabled for: example.com, partner.com
```


### CHECKING EVENT

| Message | Meaning |
|:---|:---|
| `🟢 Valid [event_name] event` | The event was built and validated |
| `🔴 Event fired before a page view event. The first event on any page must be page_view.` | An interaction event reached the tag before any `page_view`. The tag stops with `🔴 Request aborted` |


### SENDING REQUEST, PROCESSING STATUS and REQUEST STATUS
These three blocks are printed by the main library after the server has answered.

`SENDING REQUEST` is followed by `👉 Payload data:` with the enriched payload the server returned, which is the quickest way to inspect what was actually stored.

`PROCESSING STATUS` reports one line per pipeline step, taken from the `processing` object of the response. `REQUEST STATUS` closes with the server's own `response` field.

| Message | Meaning |
|:---|:---|
| `🟢 Request processed successfully` | Returned with `status_code: 200` only after Firestore, BigQuery and, when enabled, the custom endpoint have all completed |
| `🔴 Request refused` | The server answered with a status other than 200. The line above it carries the server's reason |
| `🔴 Request not sent successfully` | The request never reached the server. The line above carries the browser error, typically `TypeError: Failed to fetch` |


### Cross-domain handshake
Logged under the `cross-domain` prefix rather than the event name, because it runs on a link click and not inside an event.

```text
cross-domain > NAMELESS ANALYTICS
cross-domain > ASK USER DATA
cross-domain >   👉 User data: {…}
cross-domain > CHECK USER DATA
cross-domain >   🟢 Valid user data. Cross-domain URL decoration will be applied
cross-domain >   👉 Redirect to: https://partner.com/?na_id=…
```

| Message | Meaning |
|:---|:---|
| `🟢 Valid user data. Cross-domain URL decoration will be applied` | The server returned a valid session ID and the outbound URL is decorated with `na_id` |
| `🔴 Error while fetching user data: [error]` | The handshake failed. The visitor is redirected to the original, undecorated URL |
| `Decorating URL with na_temp params: [JSON]` | Consent is denied, so acquisition parameters travel instead of the identifiers |
| `Cookie na_temp not found, no decoration applied.` | Consent is denied and there is no acquisition context to carry over |
| `Google Consent Mode not found. Cross-domain decoration aborted.` | Consent Mode is missing while it is required |

The absence of `ASK USER DATA` on the source page means the click was never intercepted. See [When link decoration does not happen](https://github.com/nameless-analytics/nameless-analytics/#when-link-decoration-does-not-happen).


### Processing status values
Each of the four `PROCESSING STATUS` lines can take one of these values:

| Value | Meaning |
|:---|:---|
| `success` | The step completed |
| `failed` | The step was attempted and did not complete |
| `skipped` | The step was not attempted, either because a previous one failed or because the feature is off. `Custom Endpoint: skipped` is the normal value when **Send data to custom endpoint** is not enabled |
| `pending` | Initial value of every step. It is replaced before the response is returned, so it should never appear in the console |

The steps are executed in the order they are printed and each one gates the next, so a failure marks everything after it as `skipped`.

Two readings that are easy to get wrong:

- `Claim request: failed` does not mean the server ignored the request. The Server-side Client Tag always claims requests on its endpoint: the value means the request was **rejected during validation** (wrong origin, banned IP, bot User-Agent, missing parameters, malformed cookies, orphan event). The reason is in the response message.
- `Custom Endpoint: failed` does not mean the event was lost. Firestore and BigQuery had already succeeded, so the event is stored and only the forwarding failed: the response is still `200` with `🟢 Request processed successfully`.

Any other combination where a step reports `failed` means the event was **not** stored. See the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md) for the message that accompanies it.



## Troubleshooting
If you encounter any issues or see 🔴 error messages in the console, please refer to the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md).

#

[Website](https://namelessanalytics.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics_client_side_tracker_tag_readme) | [Twitter](https://x.com/nmlssanalytics) | [LinkedIn](https://www.linkedin.com/company/nameless-analytics/)
