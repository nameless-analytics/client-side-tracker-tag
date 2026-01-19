/* 
  NAMELESS ANALYTICS 
  MAIN LIBRARY V.1.0
  Tommaso Moretti - 2020-2026
*/


//----------------------------------------------------------------------------------------------------------------------------------------------------


// STANDARD REQUESTS
// Create requests queue
let queue = Promise.resolve();

function send_queued_requests(full_endpoint, payload, data, enable_logs, add_page_status_code) {
  // Ensure that, even in case of an error, the queue continues processing subsequent requests.
  queue = queue
    .catch(() => { }) // Swallow previous error
    .then(() => build_payload(full_endpoint, payload, data, enable_logs, add_page_status_code));
  return queue;
}


// Build payload
function build_payload(full_endpoint, payload, data, enable_logs, add_page_status_code) {
  return new Promise((resolve, reject) => {
    const formatted_event_datetime = format_datetime(payload.event_timestamp);
    const formatted_page_datetime = format_datetime(payload.page_data.page_timestamp);
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


    if (add_page_status_code && payload.event_data.event_type == 'page_view') {
      fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
          payload.page_data.page_status_code = response.status

          send_requests(full_endpoint, payload, data, enable_logs, resolve, reject)
        })
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

        if (enable_logs) { console.log(payload.event_name, '>', 'REQUEST STATUS'); }
        if (enable_logs) { console.log(payload.event_name, '>', ' ', response_json.response); }

        data.gtmOnSuccess();
        resolve(response_json.data);
      } else {
        if (enable_logs) { console.log(payload.event_name, '>  ', response_json.response); }

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


// CHANNEL GROUPING
function get_channel_grouping(source, campaign) {
  const patterns = {
    search_engine: new RegExp('360\\.cn|alice|aol|ar\\.search\\.yahoo\\.com|ask|bing|google|yahoo|yandex|baidu|ecosia|duckduckgo|sogou|naver|seznam', 'i'),
    social: new RegExp('facebook|twitter|instagram|pinterest|linkedin|reddit|vk\\.com|tiktok|snapchat|tumblr|wechat|whatsapp', 'i'),
    shopping: new RegExp('amazon|ebay|etsy|shopify|stripe|walmart|mercadolibre|alibaba|naver\\.shopping', 'i'),
    video: new RegExp('youtube|vimeo|netflix|twitch|dailymotion|hulu|disneyplus|wistia|youku', 'i'),
    ai: new RegExp('chatgpt|gemini|bard|claude|alexa|siri|assistant|\\.ai([/]|$)', 'i'),
    email: new RegExp('email|e-mail|newsletter|mailchimp|sendgrid|sparkpost', 'i')
  };

  if (!source) return 'internal_traffic';
  if (source === 'direct') return 'direct';
  if (source === 'tagassistant.google.com') return 'gtm_debugger';
  if (patterns.search_engine.test(source)) return campaign ? 'paid_search_engine' : 'organic_search_engine';
  if (patterns.social.test(source)) return campaign ? 'paid_social' : 'organic_social';
  if (patterns.shopping.test(source)) return campaign ? 'paid_shopping' : 'organic_shopping';
  if (patterns.video.test(source)) return campaign ? 'paid_video' : 'organic_video';
  if (patterns.ai.test(source)) return 'ai';
  if (patterns.email.test(source)) return 'email';
  if (!campaign) return 'referral';
  if (campaign) return 'affiliate';

  return 'undefined';
}


//----------------------------------------------------------------------------------------------------------------------------------------------------


// CROSS-DOMAIN 
// Cross-domain listener and link decorator
function set_cross_domain_listener(full_endpoint, cross_domain_domains, respect_consent_mode, enable_logs) {
  const saved_full_endpoint = full_endpoint;
  const saved_cross_domain_domains = cross_domain_domains;

  let cross_domain_listener = function (event) {
    var target = event.target.closest('a');

    if (target && target.getAttribute("href")) {
      var original_href = target.getAttribute("href");
      var link_url = new URL(original_href);
      const is_junk = /^(#|javascript:|tel:|mailto:)/.test(link_url.href);

      if (!is_junk) {
        var link_hostname = link_url.hostname;

        const domain_matches = saved_cross_domain_domains.some(domain => link_hostname === domain || link_hostname.endsWith(`.${domain}`));
        const is_self = link_hostname.includes(window.location.hostname);
        var link_target = target.getAttribute("target");

        const consent_values = get_last_consent_values();
        const analytics_storage_value = (consent_values.analytics_storage == true || consent_values.analytics_storage == null) ? true : false;
        const consent_granted_or_not_needed = (respect_consent_mode) ? analytics_storage_value : true;

        let popupWindow = null;

        // If the link is not cross-domain
        if (!domain_matches || is_self) {
          return;
        }

        // If the link is cross-domain but consent is denied
        if (domain_matches && !consent_granted_or_not_needed) {
          return;
        }

        // If the link is cross-domain and consent is granted
        event.preventDefault();

        // Create new window if link has target: _blank 
        if (domain_matches && link_target === "_blank") {
          popupWindow = window.open("about:blank", "_blank");
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

            if (session_id && session_id != 'undefined') {
              if (enable_logs) { console.log('cross-domain >   🟢 Valid user data. Cross-domain URL link decoration will be applied') }
              link_url.searchParams.set('na_id', session_id);
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

            console.log('cross-domain >   🔴 Error while fetch user data: ' + error);
            if (enable_logs) { console.log('cross-domain >   👉 Redirect to: ' + original_href) }

            if (popupWindow) {
              popupWindow.location.href = original_href;
            } else {
              window.location.href = original_href;
            }
          });
      }
    }
  };

  document.addEventListener('click', cross_domain_listener)
}


//----------------------------------------------------------------------------------------------------------------------------------------------------


// CONSENTS
// Get last consent values
function get_last_consent_values() {
  if (typeof google_tag_data !== 'undefined' && google_tag_data) {
    const used_default = google_tag_data.ics.usedDefault;
    const used_update = google_tag_data.ics.usedUpdate;
    const raw_consent_data = google_tag_data.ics.entries;

    return {
      consent_type: (!used_default) ? "Consent mode not present" : ((used_default && !used_update) ? "Default" : "Update"),
      ad_user_data: used_default ? (raw_consent_data.ad_user_data.update || raw_consent_data.ad_user_data.default) : null,
      ad_personalization: used_default ? (raw_consent_data.ad_personalization.update || raw_consent_data.ad_personalization.default) : null,
      ad_storage: used_default ? (raw_consent_data.ad_storage.update || raw_consent_data.ad_storage.default) : null,
      analytics_storage: used_default ? (raw_consent_data.analytics_storage.update || raw_consent_data.analytics_storage.default) : null,
      functionality_storage: used_default ? (raw_consent_data.functionality_storage.update || raw_consent_data.functionality_storage.default) : null,
      personalization_storage: used_default ? (raw_consent_data.personalization_storage.update || raw_consent_data.personalization_storage.default) : null,
      security_storage: used_default ? (raw_consent_data.security_storage.update || raw_consent_data.security_storage.default) : null,
    }
  }
}


//----------------------------------------------------------------------------------------------------------------------------------------------------


// USER DATA
// Get user data from GTM Server-side
function get_user_data(saved_full_endpoint, payload, enable_logs) {
  if (saved_full_endpoint.split('/')[2].split('.')[1] !== 'undefined') {
    return fetch(saved_full_endpoint, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      keepalive: true,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(response_json => {
        return response_json;
      })
  }
}
