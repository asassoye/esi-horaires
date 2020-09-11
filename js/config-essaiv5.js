ics_sources = [
    {url:'http://horaires.esi-bru.be/ical/2020-2021/q1/A111.ics',event_properties:{color:'gold'}},
    {url:'http://horaires.esi-bru.be/ical/2020-2021/q1/A121.ics',event_properties:{color:'pink'}},
    {url:'samples/E24.ics',event_properties:{
        color:'blue'
        }
    }
]


function data_req (url, callback) {
    req = new XMLHttpRequest()
    req.addEventListener('load', callback)
    req.open('GET', url)
    req.send()
}

function load_ics(ics){
    data_req(ics.url, function(){
        $('#calendar').fullCalendar('addEventSource', fc_events(this.response, ics.event_properties))
        //calendar.
        //sources_to_load_cnt -= 1
    })
}

function load_ics(calendar, ics){
    data_req(ics.url, function(){
        calendar.addEvent(fc_events(this.response, ics.event_properties));
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: '2020-09-09',
        headerToolbar: {
            left: 'prev, next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }
    });
    calendar.render();
    ics = {url:'../samples/E24.ics',event_properties:{
        color:'blue'
        }
    }
    console.log('' + fc_events(ics, ics.event_properties));
    data_req(ics.url, function(){
        calendar.addEvent(fc_events(this.response, ics.event_properties));
    });
    calendar.render();
    //load_ics(calendar, ics);
});

