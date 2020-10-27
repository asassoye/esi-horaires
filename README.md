![Lines of code](https://img.shields.io/tokei/lines/git.esi-bru.be/pbt/displaytimetable?label=lines%20of%20code) 
![Website](https://img.shields.io/website?url=http%3A%2F%2Fhoraires.esi-bru.be)

# Display timetable 

Use [Leonaard project][0] to convert iCalendar ics to [FullCalendar][1] json
using [ical.js][2] and adapt for display students and teachers timetables. 

![Screenshot of version pre-pre-alpha](screenshot.png)


# Demo 

Timetables are visible at http://horaires.esi-bru.be

# Contribute

Pull requests and issues are welcome. 

To test locally (using `php -S`) :

- `make updateSchedule` grabs a copy of the current schedule.

- `make serve` launches a local webserver, using the local schedule.

# Contributors


Pierre Bettens *pbt*  
Nicolas Richard *nri*  
Frédéric Servais *srv*

*Fait à l'arrache par Pierre, Nicolas-Némo et Frédéric-Sébastien.*

[0]: https://github.com/leonaard/icalendar2fullcalendar
[1]: http://fullcalendar.io/
[2]: https://mozilla-comm.github.io/ical.js/
