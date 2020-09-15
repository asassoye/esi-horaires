// Depends on https://raw.github.com/mozilla-comm/ical.js/master/build/ical.js

function ical_events(ical, event_callback, recur_event_callback) {
    jcal_events(ICAL.parse(ical), event_callback, recur_event_callback);
}

function jcal_events(jcal, event_callback, recur_event_callback) {
    const vevents_comp = new ICAL.Component(jcal).getAllSubcomponents("vevent");
    vevents_comp.forEach((vvent) => {
        if (vvent.hasProperty("rrule")) {
            recur_event_callback(vvent);
        } else {
            event_callback(vvent);
        }
    });
}

function event_duration(event) {
    return new Date(event.getFirstPropertyValue("dtend").toJSDate() - event.getFirstPropertyValue("dtstart").toJSDate()).getTime();
}

function event_dtend(dtstart, duration) {
    return new ICAL.Time().fromJSDate(new Date(dtstart.toJSDate().getTime() + duration));
}

function expand_recur_event(event, dtstart, dtend, event_callback) {
    const exp = new ICAL.RecurExpansion({
        component: event,
        dtstart: event.getFirstPropertyValue("dtstart"),
    });
    const duration = event_duration(event);
    while (!exp.complete && exp.next() < dtend) {
        if (exp.last >= dtstart) {
            event = new ICAL.Component(event.toJSON());
            event.updatePropertyWithValue("dtstart", exp.last);
            event.updatePropertyWithValue("dtend", event_dtend(exp.last, duration));
            event_callback(event);
        }
    }
}
