Tasks concerning the miai value study app as it exists today:
- Figure out how to package SGF files
- Create a tree of board positions from an sgf
- Refactor constants in goban components
- Improve type annotations



The rest of this document is for more long-term plans.
Gokaisho (碁会所) should eventually be a fully-featured study app and game.
It will recreate the experience of playing in a Go club, with an explorable
environment populated by virtual characters who play and study Go.

Note this is not intended to be an online game. Gokaisho will run locally
and all opponents will be powered by AI running on the user's computer.


Study topics:
- Miai values
- Kifu: one side
- Kifu: both sides
- Joseki
- Life and death
- Basic technique problems
- Capturing problems
- Game review

Game variants:
- Small boards
- Ancient chinese rules
- Blind go
- One-color go
- Gambling
- Just the opening
- Just the endgame
- Blitz
- Pair go

Play styles:
- Modern AI style
- Group tax style (9d)
- Conservative risk-averse style (7d)
- Overplay risk-loving style (4d)
- Pro style
- 3d style
- 1d style
- 2k style
- 4k style
- 7k style
- 10k style
- 14k style
- Monte Carlo style
- GOFAI style

Other activities:
- Read books
  - See "online books" at https://senseis.xmp.net/?books
  - Math and CGT books?
  - AI/ML books?
  - Chinese, Japanese, or Korean classics?
- Watch videos
- Listen to music
- Drink tea or alcohol

Character profiles:
- Receptionist
- Owner
- Owner's friend
- Regular player 1
- Regular player 2

Rooms:
- Main playing area
- Back office
- Onsen
- Kitchen

NPC leveling:
NPCs all have a given initial strength and a final target strength.
When they are stronger than the player, they will level up very slowly, e.g. 1 stone per year.
When they are weaker than the player, they will level up quickly, e.g. 1 stone per week.
They will also stay buffered below the next stronger AI by default.
It will also be possible to temporarily raise or lower their strength with potions.
Or to permanently remove their growth limits via some means.
