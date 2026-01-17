const log = require('logToConsole');
const getTimestampMillis = require('getTimestampMillis');
const queryPermission = require('queryPermission');
const injectScript = require('injectScript');
const callInWindow = require('callInWindow');
const getUrl = require('getUrl');
const readTitle = require('readTitle');
const getReferrerUrl = require('getReferrerUrl');
const isConsentGranted = require('isConsentGranted');
const addConsentListener = require('addConsentListener');
const templateStorage = require('templateStorage');
const JSON = require('JSON');
const getQueryParameters = require('getQueryParameters');
const getContainerVersion = require('getContainerVersion');
const copyFromDataLayer = require('copyFromDataLayer');
const copyFromWindow = require('copyFromWindow');
const Object = require('Object');
const generateRandom = require('generateRandom');


// ------------------------------------------------------------------------------------------------------------------------------------------------------


const config = data.config_variable;
const event_name = (data.event_name == 'standard') ? data.standard_event_name : data.custom_event_name;

// Logs
let enable_logs = false;
if (config != undefined && config.enable_logs) {
  if (config.enable_logs_debug_mode_only) {
    enable_logs = getContainerVersion().debugMode === true;
  } else {
    enable_logs = true;
  }

  if (enable_logs && data.disable_this_log) {
    enable_logs = false;
  }
} else {
  enable_logs = true;
}


// Event data
const timestamp = getTimestampMillis();
const hostname = getUrl('host');
const referrer_hostname = getReferrerUrl('host');
const datalayer = copyFromWindow('dataLayer');
const datalayer_event_name = copyFromDataLayer('event', 2);
const datalayer_unique_event_id = copyFromDataLayer('gtm.uniqueEventId', 2);

const alphanumeric_page_id = generate_alphanumeric();
const alphanumeric_event_id = generate_alphanumeric();
const cross_domain_id = getQueryParameters('na_id');

const respect_consent_mode = config.respect_consent_mode;

// Acquisition
const utm_source = (config.set_custom_utm_parameters_names) ? getQueryParameters(config.custom_source_name) : getQueryParameters('utm_source');
const utm_campaign = (config.set_custom_utm_parameters_names) ? getQueryParameters(config.custom_campaign_name) : getQueryParameters('utm_campaign');
const utm_id = (config.set_custom_utm_parameters_names) ? getQueryParameters(config.custom_id_name) : getQueryParameters('utm_id');
const utm_term = (config.set_custom_utm_parameters_names) ? getQueryParameters(config.custom_term_name) : getQueryParameters('utm_term');
const utm_content = (config.set_custom_utm_parameters_names) ? getQueryParameters(config.custom_content_name) : getQueryParameters('utm_content');

const gclid = getQueryParameters('gclid'); // Google Ads
const gclsrc = getQueryParameters('gclsrc'); // Google Ads
const wbraid = getQueryParameters('wbraid'); // Google Ads
const gbraid = getQueryParameters('gbraid'); // Google Ads
const dclid = getQueryParameters('dclid'); // Google Floodlight
const msclkid = getQueryParameters('msclkid'); // Bing
const fbclid = getQueryParameters('fbclid'); // Facebook 
const ttclid = getQueryParameters('ttclid'); // TikTok 
const twclid = getQueryParameters('twclid'); // X
const epik = getQueryParameters('epik'); // Pinterest
const li_fat_id = getQueryParameters('li_fat_id'); // Linkedin
const sccid = getQueryParameters('sccid'); // SnapChat

const source = (referrer_hostname == hostname) ? null : ((utm_source) ? utm_source : ((referrer_hostname == '') ? 'direct' : referrer_hostname));
const campaign = utm_campaign || null;
const campaign_id = utm_id || null;
const campaign_click_id = gclid || dclid || gclsrc || wbraid || gbraid || msclkid || fbclid || ttclid || twclid || epik || li_fat_id || sccid || null;
const campaign_term = utm_term || null;
const campaign_content = utm_content || null;

// Default script paths
const default_na_url_min = 'https://cdn.jsdelivr.net/gh/nameless-analytics/nameless-analytics-client-side-tracker-tag@main/nameless-analytics.min.js';
const default_ua_parser_url = 'https://cdn.jsdelivr.net/npm/ua-parser-js/src/ua-parser.min.js';

// Custom script paths
const custom_libraries_path = 'https://' + config.custom_libraries_domain + config.custom_libraries_path;

// Script paths
const na_url = (config.load_libraries_from_custom_location) ? custom_libraries_path + '/nameless-analytics.js' : default_na_url_min;
const ua_parser_url = (config.load_libraries_from_custom_location) ? custom_libraries_path + '/ua-parser.min.js' : default_ua_parser_url;

// Server side path
const endpoint_domain_name = config.endpoint_domain_name;
const endpoint_path = config.endpoint_path;
const full_endpoint = 'https://' + endpoint_domain_name + endpoint_path;


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Check configuration variable
if (enable_logs) { log(event_name, '>', 'NAMELESS ANALYTICS'); }
if (enable_logs) { log(event_name, '>', 'CHECKING CONFIGURATION VARIABLE'); }

if (config == undefined || config.is_na_config_variable != true) {
  if (enable_logs) { log(event_name, '>', '  🔴 Tracker configuration error: event has invalid Nameless Analytics Client-Side tracker configuration variable'); }

  if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
  if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }
  data.gtmOnSuccess();
  return;
} else {
  if (enable_logs) { log(event_name, '>', '  🟢 Valid Nameless Analytics Client-Side tracker configuration variable'); }
}

if (enable_logs && event_name == 'page_view') { log(event_name, '>', 'TRACKER TAG CONFIGURATION'); }
if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  👉 Server-side requests endpoint path:', full_endpoint); }
if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  👉 Load libraries in first-party mode:', (config.load_libraries_from_custom_location) ? 'Yes' : 'No'); }
if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  👉 Enable cross-domain tracking?', (config.enable_cross_domain_tracking) ? 'Yes' : 'No'); }
if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  👉 Respect Google Consent Mode?', (respect_consent_mode) ? 'Yes' : 'No'); }


// Load libraries
if (enable_logs && event_name == 'page_view') { log(event_name, '>', 'LOADING LIBRARIES'); }

// Load UA parser library
if (queryPermission('inject_script', ua_parser_url)) {
  injectScript(
    ua_parser_url,
    () => { // UA parser library loaded
      if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  🟢 UA parser library loaded from:', ua_parser_url); }

      // Load Main library
      if (queryPermission('inject_script', na_url)) {
        injectScript(
          na_url,
          () => { // Main library loaded  
            if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  🟢 Main library loaded from:', na_url); }

            send_request(full_endpoint);
          },
          () => { // Main library not loaded
            if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  🔴 Main library not loaded from:', na_url); }

            if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
            if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }
            data.gtmOnSuccess();
          }, na_url // cached Main library
        );
      } else {
        if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  🔴 Permission denied: unable to load Main library from', na_url); }

        if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
        if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }
        data.gtmOnSuccess();
      }

    },
    () => { // UA parser library not loaded
      if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  🔴 UA parser library not loaded from:', ua_parser_url); }

      if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
      if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }
      data.gtmOnSuccess();
    }, ua_parser_url // cached UA parser library
  );
} else {
  if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  🔴 Permission denied: unable to load UA parser library from', ua_parser_url); }

  if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
  if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }
  data.gtmOnSuccess();
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Send request
function send_request(full_endpoint) {
  // Enable cross-domain
  if (config.enable_cross_domain_tracking) {
    set_cross_domain_listener(full_endpoint);
  }

  // Respect consent mode
  if (respect_consent_mode) {
    if (enable_logs) { log(event_name, '>', 'CHECKING GOOGLE CONSENT MODE'); }

    const consent_type = callInWindow('get_last_consent_values').consent_type;

    // Check if consent mode is present
    if (consent_type == 'Consent mode not present') {
      if (enable_logs) { log(event_name, '>', '  🔴 Google Consent Mode not found'); }

      if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
      if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }
      data.gtmOnSuccess();
    } else if (consent_type == 'Default' || consent_type == 'Update') {
      // Consent denied
      if (!isConsentGranted("analytics_storage")) {
        if (enable_logs) { log(event_name, '>', '  🔴 analytics_storage denied'); }

        var consent_listener_called = false;

        // Add consent listener
        addConsentListener("analytics_storage", (consent_type, consent_status) => {
          // When consent is denied  
          if (consent_listener_called || !consent_status) {
            return;
          }

          // When consent is granted
          consent_listener_called = true;

          if (enable_logs) { log(event_name, '>', '  🟢 analytics_storage granted'); }

          const payload = build_payload();
          if (!payload) {
            return;
          }

          // Send pending requests when consent is granted          
          if (queryPermission('access_globals', 'execute', 'send_queued_requests')) {
            callInWindow('send_queued_requests', full_endpoint, payload, data, enable_logs, config.add_page_status_code);
          }
        });

        // Consent granted  
      } else if (isConsentGranted("analytics_storage")) {
        if (enable_logs) { log(event_name, '>', '  🟢 analytics_storage granted'); }

        const payload = build_payload();
        if (!payload) {
          return;
        }

        // Send requests
        if (queryPermission('access_globals', 'execute', 'send_queued_requests')) {
          callInWindow('send_queued_requests', full_endpoint, payload, data, enable_logs, config.add_page_status_code);
        }
      }
    }

    // Do not respect consent mode
  } else {

    const payload = build_payload();
    if (!payload) {
      return;
    }

    // Send requests
    if (queryPermission('access_globals', 'execute', 'send_queued_requests')) {
      callInWindow('send_queued_requests', full_endpoint, payload, data, enable_logs, config.add_page_status_code);
    }
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Set cross-domain listener
function set_cross_domain_listener(full_endpoint) {

  var cross_domain_listener_status = templateStorage.getItem('cross_domain_listener') || false;
  const domains = config.cross_domain_domains.map(obj => obj.domain);

  if (!cross_domain_listener_status) {
    if (enable_logs && event_name == 'page_view') { log(event_name, '>', 'ENABLING CROSS-DOMAIN TRACKING'); }

    if (queryPermission('access_globals', 'execute', 'set_cross_domain_listener')) {
      callInWindow('set_cross_domain_listener', full_endpoint, domains, respect_consent_mode, enable_logs);
      templateStorage.setItem('cross_domain_listener', true);

      if (enable_logs && event_name == 'page_view') { log(event_name, '>', '  👉 Cross-domain enabled for:', domains.join(', ')); }
    }
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Build the payload
function build_payload() {
  // Save event info in template storage
  const storage_name = 'data_storage';

  const storage_value = JSON.parse(templateStorage.getItem(storage_name));
  const res = set_event_data_in_template_storage(storage_name, storage_value);

  if (!res) { return; }

  const updated_storage_value = JSON.parse(templateStorage.getItem(storage_name));

  const updated_event_storage_value = updated_storage_value[0];
  const updated_page_storage_value = updated_storage_value[1];

  const payload = {};

  const user_info = {};
  const session_info = {};
  const event_info = updated_event_storage_value;
  const page_info = updated_page_storage_value;

  payload.event_id = event_info.event_id;
  payload.event_name = event_name;
  payload.event_timestamp = timestamp;
  payload.event_origin = 'Website';

  payload.page_id = page_info.page_id;

  Object.delete(event_info, 'event_id');
  Object.delete(page_info, 'page_id');


  // DATALAYER DATA
  // Add current dataLayer state (configuration variable)
  if (config.add_current_datalayer_state) {
    let datalayer_def = [];
    let found = false;

    for (let item of datalayer) {
      if (found) break;
      if (typeof item === "object" && item["gtm.uniqueEventId"] === datalayer_unique_event_id) {
        found = true;
      }
      datalayer_def.push(item);
    }
    payload.datalayer = datalayer_def;
  }


  // ECOMMERCE DATA
  // Add ecommerce data from dataLayer
  if (data.add_ecommerce) {
    payload.ecommerce = copyFromDataLayer('ecommerce', 2) || {};
  }


  // USER DATA
  // Add user parameters (configuration variable)
  if (config.add_user_params) {
    const config_user_params = config.user_params;

    if (config_user_params != undefined) {
      for (let i = 0; i < config_user_params.length; i++) {
        const param_name = config_user_params[i].param_name;
        const param_value = config_user_params[i].param_value;

        user_info[param_name] = param_value;
      }
    }
  }

  // Add user info to payload
  payload.user_data = user_info;


  // SESSION DATA
  // Add user id (configuration variable)
  if (config.add_user_id) { session_info.user_id = config.user_id; }

  // Add session parameters (configuration variable)
  if (config.add_session_params) {
    const config_session_params = config.session_params;

    if (config_session_params != undefined) {
      for (let i = 0; i < config_session_params.length; i++) {
        const param_name = config_session_params[i].param_name;
        const param_value = config_session_params[i].param_value;

        session_info[param_name] = param_value;
      }
    }
  }

  // Add session info to payload
  payload.session_data = session_info;


  // PAGE DATA  
  // Add page info to payload
  payload.page_data = page_info;


  // EVENT DATA
  // Add event parameters from dataLayer (tag fields)
  if (data.add_parameters_from_dataLayer) {
    const current_event_pushes = datalayer.filter(item => item.event === datalayer_event_name);
    const last_current_event_push = current_event_pushes.length > 0 ? current_event_pushes[current_event_pushes.length - 1] : null;

    for (var key of Object.keys(last_current_event_push)) {
      if (key != 'event' && key != 'gtm.start' && key != 'gtm.uniqueEventId' && key != 'event_id' && key != 'page_id' && key != 'source' && key != 'campaign' && key != 'campaign_id' && key != 'campaign_term' && key != 'campaign_content' && key != 'ecommerce') {
        event_info[key] = last_current_event_push[key];
      }
    }
  }

  // Add common event parameters (configuration variable)
  if (config.add_common_event_params) {
    const config_event_params = config.common_event_params;

    if (config_event_params != undefined) {
      for (let i = 0; i < config_event_params.length; i++) {
        const param_name = config_event_params[i].param_name;
        const param_value = config_event_params[i].param_value;

        event_info[param_name] = param_value;
      }
    }
  }

  // Add event parameters (tag fields)
  if (data.add_parameters) {
    const event_params = data.add_event_params;

    if (event_params !== undefined) {
      for (let i = 0; i < event_params.length; i++) {
        const param_name = event_params[i].param_name;
        const param_value = event_params[i].param_value;

        event_info[param_name] = param_value;
      }
    }
  }

  // Remove event data (tag fields)
  if (data.remove_parameters) {
    const event_params = data.remove_event_params;

    if (event_params !== undefined) {
      for (let i = 0; i < event_params.length; i++) {
        const param_name = event_params[i].param_name;

        Object.delete(event_info, param_name);
      }
    }
  }

  // Add event info to payload
  payload.event_data = event_info;


  // CONSENT DATA
  // Add consent data
  const consents = callInWindow('get_last_consent_values');

  const consent_info = {
    consent_type: consents.consent_type,
    respect_consent_mode: (respect_consent_mode) ? 'Yes' : 'No',
    ad_user_data: (consents.ad_user_data) ? 'Granted' : ((consents.ad_user_data == null) ? null : 'Denied'),
    ad_personalization: (consents.ad_personalization) ? 'Granted' : ((consents.ad_personalization == null) ? null : 'Denied'),
    ad_storage: (consents.ad_storage) ? 'Granted' : ((consents.ad_storage == null) ? null : 'Denied'),
    analytics_storage: (consents.analytics_storage) ? 'Granted' : ((consents.analytics_storage == null) ? null : 'Denied'),
    functionality_storage: (consents.functionality_storage) ? 'Granted' : ((consents.functionality_storage == null) ? null : 'Denied'),
    personalization_storage: (consents.personalization_storage) ? 'Granted' : ((consents.personalization_storage == null) ? null : 'Denied'),
    security_storage: (consents.security_storage) ? 'Granted' : ((consents.security_storage == null) ? null : 'Denied')
  };

  // Add consent info to payload
  payload.consent_data = consent_info;


  // REQUEST DATA
  const gtm_data = {
    cs_hostname: hostname,
    cs_container_id: getContainerVersion().containerId,
    cs_tag_name: null,
    cs_tag_id: data.gtmTagId
  };

  // Add request info to payload
  payload.gtm_data = gtm_data;

  return payload;
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Save event info in template storage
function set_event_data_in_template_storage(storage_name, storage_value) {
  if (enable_logs) { log(event_name, '>', 'CHECKING EVENT'); }

  const channel_grouping = (queryPermission('access_globals', 'execute', 'get_channel_grouping')) ? callInWindow('get_channel_grouping', source, campaign) : null;

  // Standard and Virtual Page View
  if (event_name == 'page_view') {
    const page_id = alphanumeric_page_id;
    const event_id = page_id + "_" + alphanumeric_event_id;

    const event_info = [{
      event_id: event_id,
      event_type: 'page_view',
      channel_grouping: channel_grouping,
      source: source,
      campaign: campaign,
      campaign_id: campaign_id,
      campaign_click_id: campaign_click_id,
      campaign_term: campaign_term,
      campaign_content: campaign_content,
      cross_domain_id: cross_domain_id
    }, {
      page_id: page_id,
      page_timestamp: timestamp,
      page_hostname_protocol: getUrl('protocol'),
      page_hostname: hostname,
      page_category: config.page_category || null,
      page_title: readTitle(),
      page_location: getUrl('path'),
      page_fragment: getUrl('fragment') || null,
      page_query: getUrl('query') || null,
      page_extension: getUrl('extension') || null,
      page_referrer: (storage_value == null) ? ((getReferrerUrl() == '') ? null : getReferrerUrl()) : storage_value[1].page_location,
    }];

    // Override page data for virtual page view
    if (config.page_title != undefined && config.page_location != undefined) {
      event_info[1].page_title = config.page_title;
      event_info[1].page_location = config.page_location;
      event_info[1].page_fragment = config.page_fragment || null;
      event_info[1].page_query = config.page_query || null;
      event_info[1].page_extension = config.page_extension || null;
    }

    templateStorage.setItem(storage_name, JSON.stringify(event_info));

    if (enable_logs) { log(event_name, '>', '  🟢 Valid', event_name, 'event'); }

    return true;

  } else if (event_name != 'page_view' && !storage_value) {
    if (enable_logs) { log(event_name, '>', '  🔴 Event fired before a page view event. The first event on a page view ever must be page_view.'); }

    if (enable_logs) { log(event_name, '>', 'REQUEST STATUS'); }
    if (enable_logs) { log(event_name, '>', '  🔴 Request aborted'); }

    data.gtmOnSuccess();
    return false;

  } else {
    const current_page_info = storage_value[1];

    const page_id = current_page_info.page_id;
    const event_id = page_id + "_" + alphanumeric_event_id;

    const event_info = [{
      event_id: event_id,
      event_type: 'event',
      channel_grouping: channel_grouping,
      source: source,
      campaign: campaign,
      campaign_id: campaign_id,
      campaign_click_id: campaign_click_id,
      campaign_term: campaign_term,
      campaign_content: campaign_content,
      cross_domain_id: null
    },
      current_page_info
    ];

    templateStorage.setItem(storage_name, JSON.stringify(event_info));

    if (enable_logs) { log(event_name, '>', '  🟢 Valid', event_name, 'event'); }

    return true;
  }
}

// Generate random alphanumeric ID 
function generate_alphanumeric() {
  var max_length = 15;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var alphanumeric_id = '';
  for (var i = 0; i < max_length; i++) {
    alphanumeric_id += chars.charAt(generateRandom(0, chars.length));
  }
  return alphanumeric_id;
}