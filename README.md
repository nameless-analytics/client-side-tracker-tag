# Nameless Analytics | Client-side Tracker Tag

The Nameless Analytics Client-side Tracker Tag builds website events and sends them to the [Nameless Analytics Server-side Client Tag](https://github.com/nameless-analytics/server-side-client-tag), combining event-specific fields with the shared settings provided by the Configuration Variable.

For an overview of how Nameless Analytics works [start from here](https://github.com/nameless-analytics/nameless-analytics/#overview).


### 🚧 Nameless Analytics and the documentation are currently in beta and subject to change


## Table of Contents

- [Template interface](#template-interface)
- [Event data](#event-data)
  - [Event name](#event-name)
    - [Standard event names](#standard-event-names)
    - [Custom event names](#custom-event-names)
  - [Event parameters](#event-parameters)
    - [Add/override event level parameters](#addoverride-event-level-parameters)
    - [Remove event level parameters](#remove-event-level-parameters)
    - [Add event level parameters from dataLayer](#add-event-level-parameters-from-datalayer)
- [Configuration Variable](#configuration-variable)
- [Advanced settings](#advanced-settings)
  - [Add ecommerce data from dataLayer](#add-ecommerce-data-from-datalayer)
  - [Disable logs in JavaScript console for this event](#disable-logs-in-javascript-console-for-this-event)
- [Verifying the setup](#verifying-the-setup)



## Template interface
Use the template to select an event name, configure event-specific parameters, connect the shared Configuration Variable and enable optional behavior for that event.

![Nameless Analytics Client-side Tracker Tag UI](https://github.com/user-attachments/assets/2dcce31e-513b-413d-b77e-deca4a37c22c)



## Event data
### Event name
Choose a standard event whenever it represents the interaction; otherwise, use a custom event name. `page_view` must be the first Nameless Analytics event on every physical page load. Any earlier event is rejected because no page context exists yet.

#### Standard event names

| Event | When to use it |
|:---|:---|
| `page_view` | When a standard or virtual page is viewed. This is the only mandatory event. |
| `consent_update` | When the user grants, changes or withdraws consent. Consent Mode values are collected separately. |
| `page_load_time` | After the page load completes, to record page-speed metrics. |
| `page_closed` | When the page is closed or hidden, to improve time-on-page and session-duration metrics. |
| `search_result_view` | When a search-results page or view is displayed. |
| `search_result_click` | When a search result is selected. |
| `login` | When a user logs in. It replaces the current session `user_id` with the value carried by the event. |
| `logout` | When a user logs out. It clears the current session `user_id`. |
| `sign_up` | When a user creates an account. |
| `new_lead` | When a relevant lead action is completed. |
| `newsletter_sign_up` | When a user subscribes to a newsletter. |

Only `login` and `logout` have special server-side behavior. Renaming them prevents the session `user_id` lifecycle from running. See [User ID lifecycle](https://github.com/nameless-analytics/nameless-analytics/#user-id-lifecycle) and [How to track standard events](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/SETUP-GUIDES.md#how-to-track-standard-events).

#### Custom event names
Custom event names must use `snake_case`: lowercase letters and numbers separated by single underscores. Standard event names are reserved and must be selected from the standard list.

Valid examples: `click_button`, `start_configuration`, `play_video`.

Invalid examples: `button clicked`, `button-clicked`, `ButtonClicked`.


### Event parameters
Custom event parameters are added to `event_data` when this tag fires. Accepted values are strings, integers, floats, booleans and JSON-compatible values.

The browser builds custom parameters in this order:

1. parameters copied from the triggering `dataLayer` event;
2. shared parameters from the Configuration Variable;
3. parameters added or overridden in this tag;
4. parameters removed in this tag.

After the request reaches the server, the Server-side Client Tag can add, override or remove custom parameters again. See [Parameter hierarchy](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy).

<details><summary>Reserved event parameters</summary>

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

</details>

#### Add/override event level parameters
Add fields that apply only to this tag. A matching name replaces the value copied from `dataLayer` or inherited from the Configuration Variable.

#### Remove event level parameters
Remove a custom field before the browser sends the request. This also removes a field configured under **Add/override event level parameters** when both lists contain the same name.

#### Add event level parameters from dataLayer
Copy custom fields from the latest `dataLayer` push matching the current GTM event. The `event` key, GTM internal keys, reserved parameters and `ecommerce` are excluded. Use **Add ecommerce data from dataLayer** for the ecommerce object.



## Configuration Variable
Select a valid [Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/). It provides shared user, session, page and event fields together with endpoint, consent, acquisition, cross-domain, library and logging settings.

The tag aborts before building the request when the selected value is missing or is not a Nameless Analytics Configuration Variable.



## Advanced settings
### Add ecommerce data from dataLayer
Copy the current `ecommerce` object from `dataLayer` into the top-level `ecommerce` field of the payload.

The provided [reporting tables](https://github.com/nameless-analytics/nameless-analytics/tree/main/tables) expect GA4-compatible ecommerce keys and event names. Other structures are still stored, but their reporting queries must be adapted. Large item arrays also increase the request size; see [Request never sent](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md#request-never-sent).


### Disable logs in JavaScript console for this event
Disable browser-console logs only for this tag execution. This overrides [Enable logs in JavaScript console](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console) without changing logging for other events.



## Verifying the setup
Enable logs in the [Nameless Analytics Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-logs-in-javascript-console), open GTM Preview and reload the page. `page_view` must be the first Nameless Analytics event on every physical page load.

| Check | Expected result |
|:---|:---|
| Configuration | The console confirms a valid Configuration Variable and server-side endpoint; the values under `TRACKER TAG CONFIGURATION` match your setup. |
| Libraries | Both libraries load from the expected URLs. With first-party hosting enabled, they use your domain. |
| Consent | When Consent Mode is respected, `analytics_storage` is granted before the request is sent. |
| Event | `CHECKING EVENT` confirms `page_view` as valid. |
| Request | The Network panel shows a `POST` request to the configured endpoint with HTTP `200`. |
| Processing | `claim_request`, `firestore` and `bigquery` are `success`; `custom_endpoint` is `success` or `skipped`. |
| Final status | The console ends with `🟢 Request processed successfully`. |

When cross-domain tracking is enabled, also confirm that the configured domains are listed under `ENABLING CROSS-DOMAIN TRACKING`. Clicking a configured outbound link should complete `ASK USER DATA`, validate the returned user data and redirect to a URL containing `na_id`.

If a stage is missing, a status is not successful or the request is not sent, use the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md).

#

[Website](https://namelessanalytics.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics_client_side_tracker_tag_readme) | [Twitter](https://x.com/nmlssanalytics) | [LinkedIn](https://www.linkedin.com/company/nameless-analytics/)
