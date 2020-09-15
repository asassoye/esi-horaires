/**
 * Depends on ./ical_events.js
 */ 
const recur_events = [];

/**
 * Removes non alphanumeric characters
 * 
 * @param {string} string 
 * @returns {string}
 */
function an_filter(string) {
    return string.replace(/[^\w\s]/gi, "");
}

function moment_icaltime(moment, timezone) {
    // TODO timezone
    return new ICAL.Time().fromJSDate(moment.toDate());
}

function expand_recur_events(start, end, timezone, events_callback) {
    const events = [];
    recur_events.forEach((event) => {
        event_properties = event.event_properties;
        expand_recur_event(event, moment_icaltime(start, timezone), moment_icaltime(end, timezone), (event) => {
            fc_event(event, (event) => {
                events.push(merge_events(event_properties, merge_events({className: ["recur-event"]}, event)));
            });
        });
    });
    events_callback(events);
}

function fc_events(ics, event_properties) {
    const events = [];
    ical_events(
        ics,
        (event) => {
            fc_event(event, (event) => {
                events.push(merge_events(event_properties, event));
            });
        },
        (event) => {
            event.event_properties = event_properties;
            recur_events.push(event);
        }
    );
    return events;
}

/**
 * Merges the first event into the second one
 * 
 * @param {Fullcalendar.Event} e an event
 * @param {Fullcalendar.Event} f another event
 * @returns {Fullcalendar.Event} the merged event
 */
function merge_events(e, f) {
    // f has priority
    for (let k in e) {
        if (k == "className") {
            f[k] = [].concat(f[k]).concat(e[k]);
        } else if (!f[k]) {
            f[k] = e[k];
        }
    }
    return f;
}

/**
 * 
 * 
 * @param {Fullcalendar.Event} event 
 * @param {(e: Fullcalendar.Event) => void} event_callback 
 * @returns {void}
 */
function fc_event(event, event_callback) {
    const e = {
        title: event.getFirstPropertyValue("summary"),
        url: event.getFirstPropertyValue("url"),
        id: event.getFirstPropertyValue("uid"),
        className: ["event-" + an_filter(event.getFirstPropertyValue("uid"))],
        allDay: false,
        location: event.getFirstPropertyValue("location"),
        description: event.getFirstPropertyValue("description"),
    };
    try {
        e.start = event.getFirstPropertyValue("dtstart").toJSDate();
    } catch (TypeError) {
        console.debug(`Undefined "dtstart", vevent skipped.`);
        return;
    }
    try {
        e.end = event.getFirstPropertyValue("dtend").toJSDate();
    } catch (TypeError) {
        e.allDay = true;
    }
    event_callback(e);
}
