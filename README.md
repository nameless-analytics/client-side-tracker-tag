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
    - [Add event parameters from dataLayer](#add-event-parameters-from-datalayer)
- [Configuration variable settings](#configuration-variable-settings)
  - [Configuration variable](#configuration-variable)
- [Advanced settings](#advanced-settings)
  - [Add ecommerce data from dataLayer](#add-ecommerce-data-from-datalayer)
  - [Disable logs in JavaScript console for this event](#disable-logs-in-javascript-console-for-this-event)
- [Verifying the setup](#verifying-the-setup)
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
* page_view: Send this event when a page is viewed. Use this event for both standard and virtual page views. This is the only mandatory event
* consent_update: Send this event when the user gives or withdraws consent to improve the accuracy of consent metrics
* page_load_time: Send this event when a page is loaded
* page_closed: Send this event when a page is closed to improve the accuracy of `time_on_page`, `session_duration`, and other metrics
* search_result_view: Send this event when a search results page is viewed
* search_result_click: Send this event when a search result is clicked
* login: Send this event when a user logs in
* logout: Send this event when a user logs out
* sign_up: Send this event when a user creates an account
* new_lead: Send this event when a user submits a form
* newsletter_sign_up: Send this event when a user subscribes to a newsletter

For more information see [Setup Guides](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/SETUP-GUIDES.md#how-to-track-standard-events).

#### Custom event name
Choose a custom event name for the event.

To maintain consistency between events, it is highly recommended to use _snake_case_ notation style (with underscores between words) to create descriptive, easily interpretable names. 

Examples:
* click_button
* start_configuration
* play_video

Avoid:
* Spaces: button clicked
* Hyphens: button-clicked
* CamelCase: ButtonClicked


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

#### Add event parameters from dataLayer
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
When logs are enabled in the [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console), you can verify that the tag is working correctly by checking the browser console.

The following success and status messages indicate a correct implementation:

| **Scope** | **Message** | **Description** |
|:---|:---|:---|
| Config | [event_name] > 🟢 Valid Nameless Analytics Client-side Tracker Configuration Variable | Tag configuration variable is correctly set and verified |
| | [event_name] > 🟢 UA parser library loaded from: [URL] | The User-Agent parser library was successfully injected and loaded |
| | [event_name] > 🟢 Main library loaded from: [URL] | The Nameless Analytics core library was successfully injected and loaded |
| Consent | [event_name] > 🟢 analytics_storage granted | Tracking is allowed by Google Consent Mode |
| | [event_name] > Temp cookie saved: [JSON] | Confirms that acquisition data is being persisted while consent is denied |
| Events | [event_name] > 🟢 Valid [event_name] event | The event was successfully built and validated |
| Processing | [event_name] > PROCESSING STATUS | Header indicating commencement of server response processing details |
| | [event_name] > Claim request: [Status] | Claim request processing outcome |
| | [event_name] > Firestore: [Status] | Firestore user and session persistence outcome |
| | [event_name] > BigQuery: [Status] | BigQuery streaming insertion outcome |
| | [event_name] > Custom Endpoint: [Status] | Forwarding outcome to custom endpoint |
| | [event_name] > 🟢 Request processed successfully | The `response` returned by the server, printed after `REQUEST STATUS`. This is the message of a fully processed event: it is sent with `status_code: 200` only after Firestore, BigQuery and, when enabled, the custom endpoint have all completed. Any other value means the event was not stored |
| Cross-domain | cross-domain > 🟢 Valid user data. Cross-domain URL decoration will be applied | The server-side handshake returned a valid session ID and the outbound URL will be decorated with an encoded `na_id` value |
| | cross-domain > Decorating URL with na_temp params: [JSON] | Confirms that anonymous acquisition data is being transferred across domains while consent is denied |
| | [page_view] > CHECKING CROSS-DOMAIN ID | An `na_id` value was detected and is being validated on the first page view |
| | [page_view] > 🟢 Valid cross-domain ID | The value was decoded successfully and its structure and timestamp are valid |
| | [page_view] > 🟠 Expired cross-domain ID | The value has a valid structure but was generated more than five minutes ago |
| | [page_view] > 🔴 Invalid cross-domain ID: unable to decode na_id | The `na_id` value could not be decoded from Base64 |
| | [page_view] > 🔴 Invalid cross-domain ID: invalid format | The decoded value does not contain a valid session ID and timestamp |
| | [page_view] > 🔴 Invalid cross-domain ID: invalid session_id format | The structure is correct but the `session_id` does not match the required format: 15 alphanumeric characters, an underscore, 15 alphanumeric characters |
| | [page_view] > 🔴 Invalid cross-domain ID | The decoded value contains an invalid timestamp or a timestamp in the future |


### Processing status values
The four `PROCESSING STATUS` lines come from the `processing` object of the server response, which reports one status per pipeline step. Each step can take one of these values:

| Value | Meaning |
|:---|:---|
| `success` | The step completed |
| `failed` | The step was attempted and did not complete |
| `skipped` | The step was not attempted, either because a previous one failed or because the feature is off. `Custom Endpoint: skipped` is the normal value when "Send data to custom endpoint" is not enabled |
| `pending` | Initial value of every step. It is replaced before the response is returned, so it should never appear in the console |

The steps are executed in the order they are logged and each one gates the next, so a failure marks everything after it as `skipped`:

```text
Claim request: success
Firestore: success
BigQuery: success
Custom Endpoint: skipped
```

Two readings that are easy to get wrong:

- `Claim request: failed` does not mean the server ignored the request. The Server-side Client Tag always claims requests on its endpoint: the value means the request was **rejected during validation** (wrong origin, banned IP, bot User-Agent, missing parameters, malformed cookies, orphan event). The reason is in the response message.
- `Custom Endpoint: failed` does not mean the event was lost. Firestore and BigQuery had already succeeded, so the event is stored and only the forwarding failed: the response is still `200` with `🟢 Request processed successfully`.

Any other combination where a step reports `failed` means the event was **not** stored. See the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md) for the message that accompanies it.


## Troubleshooting
If you encounter any issues or see 🔴 error messages in the console, please refer to the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md).

# 

[Website](https://namelessanalytics.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics_client_side_tracker_tag_readme) | [Twitter](https://x.com/nmlssanalytics) | [LinkedIn](https://www.linkedin.com/company/nameless-analytics/)


