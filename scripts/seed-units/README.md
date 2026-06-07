# Seed Unit Data

Unit profiles for Bushido Risen Sun, manually sourced from GCT Studios' official
profile card PDFs (available at https://gctstudios.com/pages/rules-resources).

## File naming

One JSON file per faction, using the faction slug:

```
prefecture-of-ryu.json
cult-of-yurei.json
temple-of-ro-kan.json
the-savage-wave.json
ito-clan.json
silvermoon-trade-syndicate.json
the-descension.json
jung-pirates.json
shadow-wind-clan.json
minimoto-clan.json
shiho-clan.json
kinshi-temple.json
the-awoken.json
the-imperial-court.json
horse-lords-of-ataka.json
ronin.json
```

## Unit format

```json
[
  {
    "id": "prefecture-of-ryu/atsushi",
    "name": "Atsushi",
    "faction": "prefecture-of-ryu",
    "type": "model",
    "riceCost": 8,
    "profile": {
      "move": 5,
      "strength": 3,
      "kiPool": 3,
      "wounds": 12,
      "defence": 4,
      "armour": 3,
      "size": "medium",
      "base": 30
    },
    "traits": [
      { "id": "bushido", "name": "Bushido", "description": "...", "keywords": [] }
    ],
    "kiFeats": [
      {
        "id": "way-of-the-warrior",
        "name": "Way of the Warrior",
        "cost": 2,
        "range": "S",
        "description": "...",
        "keywords": []
      }
    ],
    "special": "",
    "unique": false,
    "ronin": false
  }
]
```

## Profile stat abbreviations

| Field | Meaning |
|---|---|
| move | Move in inches |
| strength | Strength |
| kiPool | Ki pool (max Ki tokens) |
| wounds | Wound track total |
| defence | Defence |
| armour | Armour |
| size | small / medium / large / huge |
| base | Base size in mm (25, 30, 40, 50) |
