.PHONY: update updateSchedule serve

localaddress=localhost:9038

updateSchedule:
	if [ -d ical ]; then rm -r ical; fi
	wget --reject-regex '\?' -nH --no-parent -r 'http://horaires.esi-bru.be/ical/'
	find ical/ -name index.html -delete

serve:
	if ! [ -d ical ]; then $(MAKE) updateSchedule; fi
	php -S "$(localaddress)" & xdg-open "http://$(localaddress)"
