# Fonctionnement du fichier de configuration

Le fichier de configuration `calendars.json` ressemble a ceci:

```json
{
    "default": "groupes",
    "data": {
        "cours": {
            "key": "cours",
            "name": "Cours",
            "items": {
                "ALG3": {
                    "key": "ALG3",
                    "name": "ALG3",
                    "calendar": "ical/2021-2022/q1/cours/ALG3.ics"
                }
            }
        },
        "groupes": {
            "key": "groupes",
            "name": "Groupes",
            "items": {
                "E21": {
                    "key": "E21",
                    "name": "E21",
                    "calendar": "ical/2021-2022/q1/groupes/E21.ics"
                }
            }
        },
        "profs": {
            "key": "profs",
            "name": "Profs",
            "items": {
                "ABS": {
                    "key": "ABS",
                    "name": "Romain Absil",
                    "calendar": "ical/2021-2022/q1/profs/ABS_ABSIL_Romain.ics"
                }
            }
        },
        "salles": {
            "key": "salles",
            "name": "Salles",
            "items": {
                "004": {
                    "key": "004",
                    "name": "004",
                    "calendar": "ical/2021-2022/q1/salles/004.ics"
                }
            }
        }
    }
}
```

Veuillez respecter les points suivants si vous voulez survivre :

- Les elements `key` doivent impérativement être uniques dans tout le fichier
- Les elements `key` doit uniquement contenir des caractères de type `A-Z`, `a-z` ou `-`
- Les liens `calendar` est un lien relatif vers les icals
- La case `name` est affiché a l'écran, le `key` est utilisé par react et pour les liens

Un tel fichier peut être généré à partir des icals. Depuis la racine du dépôt:
1. placer les iCal dans `/ical/2021-2022/q1/{groupes,cours,profs,salles}`
2. placer le fichier `/config/personnel.json` depuis https://github.com/HEB-ESI/he2besi-web/raw/master/jekyllsrc/_data/personnels.json
3. Generer le fichier avec la commande ci-dessous
```bash
$ yarn generate:config
```


Le fichier de configuration des calendriers est fetch au chargement de la page à l'adresse `protocol://domain-name.be:port/config/calendars.json`
Si le fichier est mal formé ou non présent, cela fait planter le site. Et c'est entièrement votre faute! 😈

Have fun!
