.PHONY: update updateSchedule serve

localaddress=localhost:9038

serve:
	if ! [ -d ical ]; then $(MAKE) updateSchedule; exit 1; fi
	php -S "$(localaddress)" & xdg-open "http://$(localaddress)"

updateSchedule:
	@echo "Go to: https://downgit.github.io/#/home?url=https://github.com/HEB-ESI/heb-esi.github.io/tree/gh-pages/ical"
	@echo "Download the file ical.zip thus created"
	@echo "run: unzip path/to/ical.zip"
	@echo "this will create the ical dir"

