
var REP = "ical/2020-2021/q1/"

function data_req (url, callback) {
    req = new XMLHttpRequest()
    req.addEventListener('load', callback)
    req.open('GET', url)
    req.send()
}

function load_ics(ics){
    data_req(ics.url, function(){
        $('#calendar').fullCalendar('addEventSource', fc_events(this.response, ics.event_properties))
    })
    // Set link in textarea
    var full_url = "http://" + $(location).attr('hostname') + "/" + ics.url;
    $('#ical').val(full_url);
    $('.valid-feedback').hide();
    // Set download link
    $('#download').attr('href', ics.url);
}

function initialTimetable() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
	$("#select").val(query);
    }
    return $("#select").val();
}

$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        defaultView: 'agendaWeek',
        hiddenDays: [0,6],
        locale: 'fr',
        eventRender: function(event, element, view) {
            if (event.location) element.find(".fc-title").append(" - " + event.location);
        },
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [ 1, 2, 3, 4, 5 ], // Monday - Thursday
            start: '08:00', 
            end: '18:00', 
        },
        minTime: '08:00:00',
        maxTime: '22:00:00',
        navLinks: true,
        buttonText: {list: 'Semainier'}
    });

    function load_timetable(timetable) {
	load_ics({
            url: REP + timetable + '.ics',
            event_properties: {color: hash_color(timetable)}
	});
    }

    // Load first timetable
    load_timetable(initialTimetable());

    // Action on menu
    $('#select').on('change', function() {
        $('#calendar').fullCalendar('removeEvents');
	load_timetable($(this).val());
    });

    // Copy link to clipboard
    $(function() {
        $('#ical').click(function() {
          $(this).focus();
          $(this).select();
          var success = document.execCommand('copy');
          if (success) {
            $('.valid-feedback').removeClass("invisible");    
            $('.valid-feedback').show();    
          };          
        });
     });

     
    $(function() {
        $('#icalbutton').click(function(){
            var copyText = document.getElementById("ical");
            copyText.focus();
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/
            var success = document.execCommand("copy");        
            if (success) {
                $('.valid-feedback').removeClass("invisible");    
                $('.valid-feedback').show();    
              };
        });
    });
})
