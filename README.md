# Nameless Analytics | Client-side Tracker Tag

The Nameless Analytics Client-side Tracker Tag is a highly customizable GTM custom template designed to send requests to the [Nameless Analytics Server-side Client Tag](https://github.com/nameless-analytics/server-side-client-tag). 

For an overview of how Nameless Analytics works [start from here](https://github.com/nameless-analytics/nameless-analytics/#high-level-data-flow).

### 🚧 Nameless Analytics and the documentation are currently in beta and subject to change 🚧


## Table of Contents
- [Nameless Analytics Client-side Tracker Tag UI](#client-side-tracker-tag-ui)
- [Event data](#event-data)
  - [Event name](#event-name)
    - [Standard event name](#standard-event-name)
    - [Custom event name](#custom-event-name)
  - [Event parameters](#event-parameters)
    - [Add/override event level parameters](#addoverride-event-level-parameters)
    - [Remove event level parameters](#remove-event-level-parameters)
    - [Add event parameters from dataLayer](#add-event-parameters-from-datalayer)
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

![Nameless Analytics Client-side Tracker Tag UI](https://github.com/user-attachments/assets/84e73a78-e64c-46f6-b952-b1659d22afcd)



## Event data
### Event name
Choose between standard event names or custom event names. 

Please note:
- Always trigger a `page_view` event as the very first event on every page load. **Any event triggered before a `page_view` will be rejected.**
- Use standard event names whenever possible.
- Follow naming conventions for event names and event parameters.

#### Standard event name
Choose a standard event name for the event:

* page_view: Send this event when a page is viewed. Use this event for both standard and virtual page views. This is the only mandatory event
* consent_update: Send this event when the user gives or withdraws consent to improve the accuracy of consent metrics.
* page_load_time: Send this event when a page is loaded (on the `gtm.load` JavaScript event)
* page_closed: Send this event when a page is closed to improve the accuracy of `time_on_page`, `session_duration`, and other metrics
* view_search_results: Send this event when a search results page is viewed
* select_search_result: Send this event when a search result is clicked
* login: Send this event when a user logs in
* logout: Send this event when a user logs out
* sign_up: Send this event when a user creates an account

#### Custom event name
Choose a custom event name for the event.

To maintain consistency between events, it is highly recommended to use _snake_case_ notation style (with underscores between words) to create descriptive, easily interpretable names. 

Examples:
* button_clicked
* form_submitted
* video_played

Avoid:
* Spaces: button clicked
* Hyphens: button-clicked
* CamelCase: ButtonClicked


### Event parameters
Add, override or remove event parameters in the event_data object. See [Parameter Hierarchy & Overriding](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy--overriding) in the main project documentation.

This is the hierarchy of event parameter importance:

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

#### Add/override event level parameters
Add or overwrite parameters for a specific event. Accepted values: strings, integers, floats, and JSON.

This settings can override:
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable
- dataLayer event parameters added in Nameless Analytics Client-side Tracker Tag

This settings can be overridden by:
- Event parameter added in Nameless Analytics Server-side Client Tag

#### Remove event level parameters
Remove event level parameters in event_data object in the payload.

#### Add event parameters from dataLayer
Add event parameters from the dataLayer.push() event that triggered the tag. Accepted values: strings, integers, floats, and JSON.

These parameters can be overridden by:
- Event parameters added in Nameless Analytics Server-side Client Tag
- Event parameters added in Nameless Analytics Client-side Tracker Tag
- Shared event parameters added in Nameless Analytics Client-side Tracker Configuration Variable



## Configuration variable settings
### Configuration variable
The Nameless Analytics Client-side Tracker Tag inherits configuration settings from [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/). 

This variable will handle settings like:
- [set user level parameters](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#user-parameters)
- [set session level parameters](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#session-parameters)
- [set page level parameters](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#page-parameters)
- [set common event parameters](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#event-parameters)
- [set server-side endpoint settings](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#server-side-endpoint-settings)
- [respect google consent mode](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#respect-google-consent-mode)
- [override default acquisition parameters]
- [enable cross-domain tracking](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-cross-domain-tracking)
- [load JavaScript libraries in first-party mode](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#load-javascript-libraries-in-first-party-mode)
- [add current dataLayer state](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#add-current-datalayer-state)
- [enable logs in javascript console](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console)



## Advanced settings
### Add ecommerce data from dataLayer
Add ecommerce data as a JSON object inside the ecommerce field.

Please note: 
- By default, the table function queries extract data from standard GA4 ecommerce data structure
- The data model can be customized to support any ecommerce data structure by modifying the relative JSON paths in the user, session, ecommerce, product and funnels table function queries


### Disable logs in JavaScript console for this event
Disable console log for this specific event when [Enable logs in JavaScript console](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console) is enabled in the Nameless Analytics Client-side Tracker Configuration Variable. 



## Verifying the setup
When logs are enabled in the [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console), you can verify that the tag is working correctly by checking the browser console.

The following success and status messages indicate a correct implementation:

| **Scope** | **Message** | **Description** |
|:---|:---|:---|
| Config | [event_name] > 🟢 Valid Nameless Analytics Client-Side tracker configuration variable | Tag configuration variable is correctly set and verified |
| | [event_name] > 🟢 UA parser library loaded from: [URL] | The User-Agent parser library was successfully injected and loaded |
| | [event_name] > 🟢 Main library loaded from: [URL] | The Nameless Analytics core library was successfully injected and loaded |
| Consent | [event_name] > 🟢 analytics_storage granted | Tracking is allowed by Google Consent Mode |
| Events | [event_name] > 🟢 Valid [event_name] event | The event was successfully built and validated |
| Cross-domain | cross-domain > 🟢 Valid user data. Cross-domain URL link decoration will be applied | Success log for `na_id` link decoration |


## Troubleshooting
If you encounter any issues or see 🔴 error messages in the console, please refer to the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING.md).

---

Reach me at: [Email](mailto:hello@namelessanalytics.com) | [Website](https://namelessanalytics.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics_client_side_tracker_tag_readme) | [Twitter](https://x.com/nmlssanalytics) | [LinkedIn](https://www.linkedin.com/company/nameless-analytics/)

