/* 
  NAMELESS ANALYTICS 
  MAIN LIBRARY V.1.0.0
  Tommaso Moretti - 2020-2026
*/


//----------------------------------------------------------------------------------------------------------------------------------------------------


// STANDARD REQUESTS
// Create requests queue
let queue = Promise.resolve();

const cross_domain_request_timeout_ms = 2000;

function send_queued_requests(full_endpoint, payload, data, enable_logs, retrieve_page_status_code) {
  // Ensure that, even in case of an error, the queue continues processing subsequent requests.
  queue = queue
    .catch(() => { }) // Swallow previous error
    .then(() => build_payload(full_endpoint, payload, data, enable_logs, retrieve_page_status_code));
  return queue;
}


// Build payload
function build_payload(full_endpoint, payload, data, enable_logs, retrieve_page_status_code) {
  return new Promise((resolve, reject) => {
    const formatted_event_datetime = format_datetime(payload.event_timestamp);
    const formatted_page_datetime = format_datetime(payload.page_data.page_load_timestamp);
    const ua_info = parse_user_agent();

    payload.event_date = formatted_event_datetime.date;
    // payload.event_datetime = formatted_event_datetime.date_time_micros;
    payload.event_data.user_agent = ua_info.ua;
    payload.event_data.browser_name = ua_info.browser.name;
    payload.event_data.browser_language = ua_info.browser.language;
    payload.event_data.browser_version = ua_info.browser.version;
    payload.event_data.device_type = ua_info.device.type || "desktop";
    payload.event_data.device_vendor = ua_info.device.vendor;
    payload.event_data.device_model = ua_info.device.model;
    payload.event_data.os_name = ua_info.os.name;
    payload.event_data.os_version = ua_info.os.version;
    payload.event_data.screen_size = window.screen.width + "x" + window.screen.height;
    payload.event_data.viewport_size = window.innerWidth + "x" + window.innerHeight;
    payload.page_date = formatted_page_datetime.date;
    payload.page_data.page_language = document.documentElement.lang;


    if (retrieve_page_status_code && payload.event_data.event_type === 'page_view') {
      fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
          payload.page_data.page_status_code = response.status;
        })
        .catch(() => {
          payload.page_data.page_status_code = null;
        })
        .finally(() => {
          send_requests(full_endpoint, payload, data, enable_logs, resolve, reject);
        });
    } else {
      send_requests(full_endpoint, payload, data, enable_logs, resolve, reject)
    }
  });
}


// Send requests
function send_requests(full_endpoint, payload, data, enable_logs, resolve, reject) {
  if (enable_logs) console.log(payload.event_name, '>', 'SENDING REQUEST');

  fetch(full_endpoint, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    keepalive: true,
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(response_json => {
      if (response_json.status_code === 200) {
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Payload data: ', response_json.data); }

        if (enable_logs) { console.log(payload.event_name, '>', 'PROCESSING STATUS'); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Claim request:', response_json.processing.claim_request); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Firestore:', response_json.processing.firestore); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 BigQuery:', response_json.processing.bigquery); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Custom Endpoint:', response_json.processing.custom_endpoint); }

        if (enable_logs) { console.log(payload.event_name, '>', 'REQUEST STATUS'); }
        if (enable_logs) { console.log(payload.event_name, '>', ' ', response_json.response); }

        data.gtmOnSuccess();
        resolve(response_json.data);
      } else {
        if (enable_logs) { console.log(payload.event_name, '>  ', response_json.response); }

        if (enable_logs) { console.log(payload.event_name, '>', 'PROCESSING STATUS'); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Claim request:', response_json.processing.claim_request); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Firestore:', response_json.processing.firestore); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 BigQuery:', response_json.processing.bigquery); }
        if (enable_logs) { console.log(payload.event_name, '>', '  👉 Custom Endpoint:', response_json.processing.custom_endpoint); }

        if (enable_logs) { console.log(payload.event_name, '>', 'REQUEST STATUS'); }
        if (enable_logs) { console.log(payload.event_name, '>', '  🔴 Request refused'); }

        data.gtmOnSuccess();
        resolve(response_json.data);
      }
    })
    .catch(error => {
      if (enable_logs) console.log(payload.event_name, '>', '  🔴', error);

      if (enable_logs) { console.log(payload.event_name, '>', 'REQUEST STATUS'); }
      if (enable_logs) { console.log(payload.event_name, '>', '  🔴 Request not sent successfully'); }

      data.gtmOnSuccess();
      reject(error);
    });
}


// Format timestamp into date 
function format_datetime(timestamp) {
  const date = new Date(timestamp)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0')

  const formatted_date = {
    date: `${year}-${month}-${day}`,
    date_time: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`,
    date_time_millis: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}` + `.${milliseconds}`,
    date_time_micros: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}` + `.${milliseconds}000`,
    year: year,
    month: month,
    day: day,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: `.${milliseconds}`,
    microseconds: `.${milliseconds}000`
  }

  return formatted_date
}


// Parse user agent
const parse_user_agent = function () {
  var uap = new UAParser()
  var uap_res = uap.getResult()

  uap_res.browser.language = navigator.language
  return uap_res
}


//----------------------------------------------------------------------------------------------------------------------------------------------------


// CROSS-DOMAIN 
// Cross-domain listener and link decorator
function set_cross_domain_listener(full_endpoint, cross_domain_domains, respect_consent_mode, enable_logs) {
  const saved_full_endpoint = full_endpoint;
  const saved_cross_domain_domains = cross_domain_domains;

  let cross_domain_listener = function (event) {
    if (!(event.target instanceof Element)) return;

    // Let the browser handle modified clicks (new tab, new window, download) and non-primary buttons
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target.closest('a');
    if (!target) return;

    if (target && target.getAttribute("href")) {
      const original_href = (target.getAttribute("href") || "").trim();
      if (!original_href) return;

      const is_junk = /^(#|javascript:|tel:|mailto:)/i.test(original_href);
      if (is_junk) return;

      let link_url;
      try {
        link_url = new URL(original_href, window.location.href);
      } catch (e) {
        return;
      }

      const link_hostname = link_url.hostname;

      const domain_matches = saved_cross_domain_domains.some(domain => link_hostname === domain || link_hostname.endsWith(`.${domain}`));
      const is_self = saved_cross_domain_domains.some(domain =>
        (window.location.hostname === domain || window.location.hostname.endsWith(`.${domain}`)) &&
        (link_hostname === domain || link_hostname.endsWith(`.${domain}`))
      );

      const link_target = target.getAttribute("target");

      // Browsers imply noopener on target="_blank" unless rel="opener" is set: keep the same behaviour
      const link_rel = (target.getAttribute("rel") || "").toLowerCase().split(/\s+/);
      const keep_opener = link_rel.indexOf('opener') !== -1;

      const consent_values = get_last_consent_values();

      if (respect_consent_mode && consent_values.consent_type === 'Consent mode not present') {
        if (enable_logs) { console.log('cross-domain > Google Consent Mode not found. Cross-domain decoration aborted.'); }
        return;
      }

      const analytics_storage_value = consent_values.analytics_storage === true;
      const consent_granted_or_not_needed = respect_consent_mode ? analytics_storage_value : true;


      let popupWindow = null;

      // If the link is not cross-domain
      if (!domain_matches || is_self) {
        return;
      }

      // If the link is cross-domain but consent is denied
      if (domain_matches && !consent_granted_or_not_needed) {
        event.preventDefault();
      
        const na_temp = get_na_temp_cookie();
        if (na_temp && typeof na_temp === 'object') {
          Object.entries(na_temp)
            .filter(([_, v]) => v !== null && v !== undefined)
            .forEach(([key, value]) => {
              link_url.searchParams.set('na_' + key, value);
            });
          if (enable_logs) {console.log('cross-domain > Decorating URL with na_temp params:', na_temp);}
        } else {
          if (enable_logs) {console.log('cross-domain > Cookie na_temp not found, no decoration applied.');}
        }
      
        if (enable_logs) {console.log('cross-domain >   👉 Redirect to: ' + link_url.href);}
      
        if (link_target === '_blank') {
          if (keep_opener) {
            window.open(link_url.href, '_blank');
          } else {
            window.open(link_url.href, '_blank', 'noopener');
          }
        } else {
          window.location.href = link_url.href;
        }
      
        return;
      }

      // If the link is cross-domain and consent is granted
      event.preventDefault();

      // Create new window if link has target: _blank
      if (domain_matches && link_target === "_blank") {
        popupWindow = window.open("about:blank", "_blank");

        // about:blank is same-origin: drop the opener reference before navigating it cross-domain
        if (popupWindow && !keep_opener) {
          try { popupWindow.opener = null; } catch (e) { }
        }
      }

      get_user_data(saved_full_endpoint, { event_name: 'get_user_data', event_origin: 'Website' }, enable_logs)
        .then(response_json => {
          if (enable_logs) { console.log('cross-domain > NAMELESS ANALYTICS'); }
          if (enable_logs) { console.log('cross-domain > ASK USER DATA'); }

          const user_data = response_json.data;

          if (enable_logs) { console.log('cross-domain >   👉 User data: ', user_data) }
          if (enable_logs) { console.log('cross-domain > CHECK USER DATA'); }

          const client_id = user_data.client_id;
          const session_id = user_data.session_id;

          if (session_id && session_id !== 'undefined') {
            if (enable_logs) { console.log('cross-domain >   🟢 Valid user data. Cross-domain URL decoration will be applied') }
            const cross_domain_id = user_data.session_id + '.' + Date.now();
            const encoded_cross_domain_id = btoa(cross_domain_id);
            link_url.searchParams.set('na_id', encoded_cross_domain_id);
          } else {
            if (enable_logs) { console.log('cross-domain > ', response_json.response) }
          }

          if (enable_logs) { console.log('cross-domain >   👉 Redirect to: ' + link_url.href) }

          if (popupWindow) {
            popupWindow.location.href = link_url.href;
          } else {
            window.location.href = link_url.href;
          }
        })
        .catch(error => {
          if (enable_logs) { console.log('cross-domain > NAMELESS ANALYTICS'); }
          if (enable_logs) { console.log('cross-domain > ASK USER DATA'); }

          if (enable_logs) { console.log('cross-domain >   🔴 Error while fetching user data: ' + error); }
          if (enable_logs) { console.log('cross-domain >   👉 Redirect to: ' + original_href) }

          if (popupWindow) {
            popupWindow.location.href = original_href;
          } else {
            window.location.href = original_href;
          }
        });
    }
  };

  document.addEventListener('click', cross_domain_listener)
}


// Get na_temp cookie with temporary acquisition values
function get_na_temp_cookie() {
  const match = document.cookie.split('; ').find(row => row.startsWith('na_temp='));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
  } catch (e) {
    return null;
  }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------


// CONSENTS
// Get last consent values
function get_last_consent_values() {
  if (typeof google_tag_data !== 'undefined' && google_tag_data) {
    const used_default = google_tag_data.ics.usedDefault;
    const used_update = google_tag_data.ics.usedUpdate;
    const raw_consent_data = google_tag_data.ics.entries;

    function read_consent(raw, key) {
      if (!raw || !raw[key]) {
        return null;
      }

      if (raw[key].update !== undefined && raw[key].update !== null) {
        return raw[key].update;
      }

      if (raw[key].default !== undefined && raw[key].default !== null) {
        return raw[key].default;
      }

      return null;
    }

    return {
      consent_type: (!used_default) ? "Consent mode not present" : ((used_default && !used_update) ? "Default" : "Update"),
      ad_user_data: used_default ? read_consent(raw_consent_data, 'ad_user_data') : null,
      ad_personalization: used_default ? read_consent(raw_consent_data, 'ad_personalization') : null,
      ad_storage: used_default ? read_consent(raw_consent_data, 'ad_storage') : null,
      analytics_storage: used_default ? read_consent(raw_consent_data, 'analytics_storage') : null,
      functionality_storage: used_default ? read_consent(raw_consent_data, 'functionality_storage') : null,
      personalization_storage: used_default ? read_consent(raw_consent_data, 'personalization_storage') : null,
      security_storage: used_default ? read_consent(raw_consent_data, 'security_storage') : null
    };
  } else {
    return {
      consent_type: "Consent mode not present",
      ad_user_data: null,
      ad_personalization: null,
      ad_storage: null,
      analytics_storage: null,
      functionality_storage: null,
      personalization_storage: null,
      security_storage: null
    }
  }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------


// USER DATA
// Get user data from GTM Server-side
function get_user_data(saved_full_endpoint, payload, enable_logs) {
  if (!saved_full_endpoint || typeof saved_full_endpoint !== 'string') {
    return Promise.reject(new Error('Invalid server endpoint'));
  }

  let timeout_id;

  const timeout_request = new Promise((resolve, reject) => {
    timeout_id = setTimeout(() => {
      reject(new Error('Cross-domain request timeout'));
    }, cross_domain_request_timeout_ms);
  });

  const user_data_request = fetch(saved_full_endpoint, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    keepalive: true,
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid server response');
      }

      return response.json();
    });

  return Promise.race([user_data_request, timeout_request])
    .finally(() => {
      clearTimeout(timeout_id);
    });
}
