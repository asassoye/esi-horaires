document.addEventListener("DOMContentLoaded", () => {
    const prefix = new URLSearchParams(window.location.search).get("prefix") 
        || "";
    const calendarEl = document.getElementById("calendar");
    //const select = document.getElementById("select");
    const selectGroup = document.getElementById("selectGroup");
    const selectProf = document.getElementById("selectProf");
    const selectLocal = document.getElementById("selectLocal");
    const ical = document.getElementById("ical");
    const icalButton = document.getElementById("icalbutton");
    const addToCalendarButton = document.getElementById("addToCalendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        weekends: false,
        headerToolbar: {
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        locale: "fr",
        slotMinTime: "08:00:00",
        slotMaxTime: "22:00:00",
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Thursday
            startTime: '08:15', 
            endTime: '18:00', 
        },
        buttonText: {
            list: "Semainier",
        },
        fixedWeekCount: false,
        showNonCurrentDates: false,
        eventDidMount: ({event}) => {
	    let location = event.extendedProps.location;
            if (location && !event.title.endsWith(location)) {
                event.setProp(
                    "title", 
                    `${event.title} - ${location}`);
            }
        },
        navLinks: true
    });
    calendar.render();

    /**
     * Action on menu prof
     */
    selectLocal.addEventListener("change", () => {
        changeValue(selectLocal.value);
        document.getElementById("selectGroup").selectedIndex = 0;
        document.getElementById("selectProf").selectedIndex = 0;
    });

    /**
     * Action on menu
     */
    selectGroup.addEventListener("change", () => {
        changeValue(selectGroup.value);
        document.getElementById("selectLocal").selectedIndex = 0;
        document.getElementById("selectProf").selectedIndex = 0;
    });

    /**
     * Action on menu
     */
    selectProf.addEventListener("change", () => {
        changeValue(selectProf.value);
        document.getElementById("selectGroup").selectedIndex = 0;
        document.getElementById("selectLocal").selectedIndex = 0;
    });

    function changeValue(value){
        load_ics(calendar, ical, {
            url: `${value}.ics`,
            event_properties: {
                color: hash_color(value),
            },
        });
        document.getElementById("title").innerHTML = "Horaires " + value;
    }

    /**
     * Copy link to clipboard
     */
    ical.addEventListener("click", () => {
        copyCalLink(ical);
    });

    /**
     * Copy link to clipboard
     */
    icalButton.addEventListener("click", () => {
        copyCalLink(ical);
    });

    /**
     * Load first timetable
     */
    initialTimetable();

    /**
     * Initializes the timetable
     * 
     * @returns {void}
     */
    function initialTimetable() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get("q");
        if (query) {
            load_ics(calendar, ical, {
                url: query + ".ics",
                event_properties: {
                    color: hash_color(query),
                },
            });
        document.getElementById("title").innerHTML = "Horaires " + query;
        }
    }

    /**
     * Loads an ics on the calendar
     * 
     * @param {Fullcalendar.Calendar} calendar the calendar to load ics to
     * @param {HTMLInputElement} ical the link to the ics
     * @param {{url: string, event_properties: {color: string}}} ics the ics to add to the calendar
     * @returns {void}
     */
    function load_ics(calendar, ical, ics) {
        calendar.removeAllEvents();
        const fullUrl = `//${location.host}/ical/${prefix}/2020-2021/q2/${ics.url}`;
        fetch(fullUrl)
            .then(response => {
                if(response.status < 200 || response.status > 300) {
                    throw new Error("Not found");
                }
                return response;
            })
            .then(response => response.text())
            .then((response) => {
                calendar.batchRendering(() => {
                    let fullCalendarEventSource = 
                        fc_events(response, ics.event_properties);
		            fullCalendarEventSource.forEach(item => {                        
                        if (item.url === null) {
			                delete item.url
                        }
                        /*
                         * default color is blue but,
                         * change color for specifics events
                        */                                            
                        if (item.location !== null 
                                && item.description.includes("À distance")) {
                            // dark red
                            item.color = "hsl(0, 100%, 20%)";
                        }
                        if (item.title.includes("Remédiation")){
                            // very dark yellow
                            item.color = "hsl(51, 100%, 25%)";
                            //item.color = "hsl(91, 40%, 36%)";
                        }                        
		            });		    
                    calendar.addEventSource(fullCalendarEventSource);
                });
                Array
                    .from(document.getElementsByClassName("valid-feedback"))
                    .forEach(e => {
                        e.style.display = "none";
                    });
                ical.value = "https:" + fullUrl;
                addToCalendarButton.href = 
                    `https://www.google.com/calendar/render?cid=https:${fullUrl}`;
            })
            .then(() => calendar.render())
            .catch(e => console.error(e.message));
    }

    /**
     * Copies the ics link to the user's clipboard
     * 
     * @param {HTMLInputElement} ical the link to the ics
     * @returns {void}
     */
    function copyCalLink(ical) {
        ical.focus();
        ical.select();
        ical.setSelectionRange(0, 99999); /*For mobile devices*/
        if (document.execCommand("copy")) {
            Array.from(document.getElementsByClassName("valid-feedback")).forEach(e => {
                e.style.display = "block";
            });
        }
    }

    /**
     * Returns a number based on a string
     * 
     * @param {string} string the string to generate the number from
     * @returns {number} a number based on the provided string
     */
    function hash_code(string) {
        let h = 0;
        for (let i = 0; i < string.length; ++i) {
            h = string.charCodeAt(i) + ((h << 5) - h);
        }
        return h;
    }

    /**
     * Returns a hsl color based on a string
     * 
     * @param {string} string the string to generate the color from
     * @returns {string} a hsl color based on the provided string
     */
    function hash_color(string) {
        //return `hsl(${hash_code(string) % 360}, 30%, 50%)`;
        // default color, always blue
        return `hsl(210, 67%, 53%)`;
    }
});
