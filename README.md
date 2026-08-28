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
Enable logs in the [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console), open GTM Preview and reload the page. `page_view` must be the first Nameless Analytics event on every physical page load.

A successful `page_view` follows this path in the browser console:

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

Validate these points:

1. `CHECKING CONFIGURATION VARIABLE` and `CHECKING SERVER-SIDE ENDPOINT` complete successfully.
2. The four values under `TRACKER TAG CONFIGURATION` match the configuration variable you intend to use.
3. Both libraries load from the expected URLs. With first-party hosting enabled, those URLs should use your own domain.
4. When Consent Mode is respected, `analytics_storage` is granted before the request is sent.
5. `CHECKING EVENT` confirms `page_view` as valid.
6. `Claim request`, `Firestore` and `BigQuery` report `success`. `Custom Endpoint` may report `success` or `skipped`, depending on the configuration.
7. `REQUEST STATUS` ends with `🟢 Request processed successfully`.

In the Network panel, the request to the configured endpoint must use `POST`, return HTTP `200` and include the same successful processing values in its JSON response.

When cross-domain tracking is enabled, also confirm that the configured domains are listed under `ENABLING CROSS-DOMAIN TRACKING`. Clicking a configured outbound link should complete `ASK USER DATA`, validate the returned user data and redirect to a URL containing `na_id`.

If a stage is missing, a status is not successful or the request is not sent, use the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md).



## Troubleshooting
If you encounter any issues or see 🔴 error messages in the console, please refer to the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md).

#

[Website](https://namelessanalytics.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics_client_side_tracker_tag_readme) | [Twitter](https://x.com/nmlssanalytics) | [LinkedIn](https://www.linkedin.com/company/nameless-analytics/)
