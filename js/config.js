document.addEventListener("DOMContentLoaded", () => {

    /**
     * Un array tel que ['A121', 'A122' ] produira 
     * des liens vers les horaires correspondant, 
     * placés dans le noeud donné par le sélecteur.
     */
    function addLinks(array, selector) {
        let resultNode = '?';
        if (array && array.length > 0) {
            resultNode = $("<ul>").addClass('inline')
            array.forEach(it => {
                let link = makeLink(it)
                $("<li>").append(link).appendTo(resultNode)
            })
        }
        setChild(selector, resultNode)
    }

    /**
     * Remplace les enfants du noeud sélectionnér par l'enfant donné. 
     */
    function setChild(selector, newChild) {
        $(selector).html('')
        $(selector).append(newChild ?? "?");

    }


    /** 
     * Crée un lien vers la cible donnée (local, prof ou groupe)

     * Le lien créé possède la bonne href (pour permettre le copier-coller),
     * mais, si cliqué, ne produira pas de changement de page.
     */
    function makeLink(target, toMode) {
        // urlTarget ne sert qu'à avoir un lien copiable par clic droit, il n'est pas utilisé en interne
        let urlTarget = new URL(document.location)
        urlTarget.searchParams.set('q', target);
        if (toMode) urlTarget.searchParams.set('mode', toMode);
        else urlTarget.searchParams.delete('mode');
        return $("<a>")
            .attr("href", String(urlTarget))
            .data('query', target)
            .click(function (e) {
                e.preventDefault()
                let query = $(e.target).data('query')
                changeValue(query, toMode)
                $("#meetmodal").modal('hide')
            })
            .text(target)
    }

    /** 
     * Quand un événement FullCalendar est cliqué,
     * affiche une modale détaillant le cours cliqué
     * 
     * La modale est fournie par Bootstrap
     * (https://getbootstrap.com/docs/4.0/components/modal/)
     * 
     * Ceci est fait pour être appelé comme eventClick 
     * (https://fullcalendar.io/docs/eventClick)
     */
    function showCourseInModal({ jsEvent, event }) {
        jsEvent.preventDefault(); // don't let the browser navigate

        let cours = parseDesc(event.extendedProps.description);
        let { profacro, aa, lieux, groupes } = cours;


        setChild("#profacro", profacro ? makeLink(profacro) : "?");
        setChild("#aa", makeLink(aa, "cours") ?? "?");

        addLinks(groupes, "#groupes");

        if (profacro
            && profacro.length === 3
            && cours.type != 'Examen'
            && cours.lieux?.some(it => it.match(/distance/))) {
            let link =  meetlink(profacro)
	    $("#meetlink").attr("href", link).text(link);
            setChild("#lieux", "À distance")
        } else {
            $("#meetlink").attr("href", "").text("");
            addLinks(lieux, "#lieux")
        }

        $("#meetmodal").modal('show');
    }

    let mode //peut valoir "cours" ou être indéfini. Dans le premier cas ça change les couleurs en fonction du groupe
    const prefix = new URLSearchParams(window.location.search).get("prefix") 
        || "";
    const calendarEl = document.getElementById("calendar");
    const selectGroup = document.getElementById("selectGroup");
    const selectProf = document.getElementById("selectProf");
    const selectLocal = document.getElementById("selectLocal");
    const ical = document.getElementById("ical");
    const icalButton = document.getElementById("icalbutton");
    const addToCalendarButton = document.getElementById("addToCalendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        weekends: true,
        hiddenDays: [0], // hide Sunday
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
        navLinks: true,
        eventClick: showCourseInModal
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

    function changeValue(value, toMode){
        mode = toMode
        load_ics(calendar, ical, {
            url: `${value}.ics`,
            event_properties: {
                color: "hsl(221, 70%, 59%)"
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

    function currentlySelectedInput() {
        for (let input of [selectGroup, selectProf, selectLocal]) {
            if (input.selectedIndex > 0) {
                return input.value;
            }
        }
    }

    /**
     * Initializes the timetable
     * 
     * @returns {void}
     */
    function initialTimetable() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get("q");

        if (query) changeValue(query, urlParams.get("mode"));
        else {
            // Firefox, e.g., keeps the selected value in memory when refreshing or using the back() button.
            // It doesn't fire an onchange() event.
            // If there's a value, use it.
            let selectedVal = currentlySelectedInput();
            if (selectedVal) {
                changeValue(selectedVal)
            }
            // Perhaps we should listen for DOMAutoComplete event, or oninput ?
            // (source : https://stackoverflow.com/questions/865490/firefox-capture-autocomplete-input-change-event/7600335)
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
                if(! response.ok) {
                    throw new Error("HTTP error: " + response.status);
                }
                return response.text();
            })
            .then(response => {
                calendar.batchRendering(() => {
                    let fullCalendarEventSource = 
                        fc_events(response, ics.event_properties);
                    fullCalendarEventSource.forEach(item => {                        
                        if (item.url === null) {
                            delete item.url
                        }
                        if (mode == "cours") {
                            let parsed = parseDesc(item.description)
                            
                            if (parsed.groupes) {
                                item.color = hash_color(parsed.groupes[0])
                            }
                        }
                        else {
                            if (item.location !== null 
                                && item.description.includes("À distance")) {
                                item.color = "hsl(341, 70%, 59%)";
                            }
                            if (item.title.includes("Remédiation")){
                                item.color = "hsl(71, 70%, 50%)";                            
                            }
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
            .catch(e => {
                console.error(e.message)
                $("#errormodal").modal('show');
            });
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
        return `hsl(${hash_code(string) % 360}, 30%, 50%)`;
    }
});

// renvoie un objet avec les clefs: aa, groupes, profs (les noms), lieux, profacro (l'acronyme. A priori un seul.), type

function parseDesc(description) {
    let obj = {};
    // chaque ligne de /description/ est de la forme: "truc : valeur"

    if (! description) return obj;

    for (let item of description.split('\n')) {
	let [key, value] = item.split(' : ')
        if (! value) continue;
        
	switch (key) {
	case "Matière":
	    key = 'aa';
	    break;
	case "TD":
	    key = 'groupes'
	    value = value.split(', ')
	    break;
	case "Enseignant":
	case "Enseignants":
	    key = 'profs'
	    if (value.match(/^[A-Z][A-Z][A-Z]\b/)) // récupérer l'acronyme du prof
		obj['profacro'] = value.slice(0, 3);
            value = value.split(', ')
	    break;
	case "Salle":
        case "Salles":
            key = 'lieux'
            value = value.split(', ')
            break
        case "Type":
            key = 'type';
            break;
	default:
	    continue;
	}
	obj[key] = value;
    }
    return obj;
}

function meetlink(prof) {
    return "https://g.co/meet/esi-" + prof.toLowerCase();
}
