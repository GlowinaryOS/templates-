# Glowinary templates

This repository holds **Studio templates as JSON files** and nothing else. No
application code, no credentials, no database. One file is one design.

You work here. Glowinary reads this repo and publishes the ones the CEO keeps,
on its own machine where the credentials live.

---

## How a night works

1. **Find what is working.** In this order, and do not stop to ask:

   * **`trends/` in this repo**, if it holds anything from the last week. That
     is where Agent Reach's findings are dropped, from the laptop where it is
     installed. Read the newest file and work from it.
   * **Otherwise install Agent Reach where you are and use it** — see the
     section below. It is free and needs no keys.
   * **Only if that genuinely fails**, research the web yourself. Say which
     happened, in one line, and never stop to ask.

   Either way, take the **STRUCTURE** only: how many shots, how long each is
   held, where the cuts land, where words appear. Never anybody's artwork,
   footage, wording or name.
2. **Design the templates**, as many as the CEO asked for.
3. **Number every one**, starting from the next free number in `templates/`.
   The number is the file's own prefix: `templates/07-cream-curve.json` is
   template 7. It never changes and it is how the CEO refers to it.
4. **Make the previews**: `node scripts/preview.mjs`, then commit
   `templates/` and `previews/` together.
5. **Show the CEO the list, numbered**, with one line each saying what makes
   that design different from the others. Then wait.
6. **He answers by number.** *"Keep 1, 3 and 7, delete the rest"*, or *"delete
   4"*. Delete the JSON and its preview for the ones he drops, commit, and stop.
   The ones he keeps stay for Glowinary to publish.

**Never publish anything yourself and never assume a yes.** A design he has
not seen is not approved, and the whole point of the numbers is that he can
answer in three words.

---

## What to make

**Nine clips to one still.** CEO, 2026-09-24: *"From now on 90% will be clips,
10% will be normal image templates."*

Every design must be **genuinely different** from the ones already in
`templates/` and from the live library. Never a recolour, never the same layout
with new photographs. If you cannot say in one sentence what makes it
different, it is not different.

Aim at reels: motion, transitions, pacing. The premium feel comes from
**structure and timing**, not from effects.

---

## Agent Reach, and how to make it work where you are

**Agent Reach is an installer and a skill, not a service.** It puts the
open-source backends in place (yt-dlp, Jina Reader, the per-platform CLIs) and
teaches an agent how to route to them. So it does not "reach" anywhere from
somebody else's machine: it has to exist where YOU are running.

**If it is not already there, install it. Do not ask, and do not fall back to
ordinary searching until you have tried.** It is free, MIT licensed, and needs
no API keys:

```bash
pip install https://github.com/Panniantong/agent-reach/archive/main.zip
agent-reach install --env=auto
agent-reach doctor
```

`doctor` prints which channels are live. Several want a cookie from a logged
in account and will not be available; that is expected. The ones that work with
nothing at all are the ones we need: **YouTube** videos and captions, **any web
page** through Jina Reader, and **RSS**. Between them you can read what beauty
professionals are posting and how their reels are built.

Its own routing table is in `skills/agent-reach/SKILL.md` in this repo, copied
from the project under its MIT licence, so you have the method even if an
install is partial.

**If the install genuinely fails** — no network, no Python, a sandbox that
refuses it — say so in one line, research the web instead, and carry on. Never
stop and wait. But try first.

---

## Where the trends come from

`trends/` is filled from the CEO's laptop, where **Agent Reach** is installed:
one markdown file per run, named by date, holding what is trending and the shot
structure of anything worth copying the shape of.

It may be empty, and often will be. That is not a problem and not a reason to
stop: research the web instead and say in your summary which of the two you
used, so the CEO knows how well grounded the batch is.

---

## Where the rules are

Read **`RULES.md`** before writing a single file. It is Glowinary's Studio
rulebook: paint order, geometry, the techniques, what we refuse to fake, and
the never-a-variant test. Every rule in it was paid for by rendering something
and finding out why it was wrong.

---

## The shape of a file

`templates/NN-a-short-slug.json`, where `NN` is the number:

```json
{
  "name": "Two words, describing the DESIGN",
  "category": "general",
  "media_type": "video",
  "format": "reel",
  "config": {
    "width": 1080,
    "height": 1920,
    "background": { "type": "solid", "colors": ["#101014"] },
    "texts": [],
    "badges": [],
    "shapes": [],
    "mediaSlots": [
      { "id": "clip", "x": 0, "y": 0, "w": 100, "h": 100,
        "sample": { "url": "https://…", "type": "video" } }
    ]
  }
}
```

`format` is one of `post`, `square`, `story`, `reel`, `landscape`.
`media_type` is `photo` or `video`.

---

## The preview

`node scripts/preview.mjs` writes `previews/NN-name.html` for every template
and an index listing them by number. Open one to look at a design.

**It shows layout, colour, type and where the media sits. It does not show
motion, transitions, timing or the grade.** Judge composition from it; never
conclude a design is finished from it. The real render is the Glowinary app.

---

## What is refused, every time

Glowinary's publish script checks these and says no with a reason. Do not work
around it; it is the same list you should be following anyway.

* **No width or height** in the config. A template without them renders blank.
* **A slot with no `sample`.** Every upload slot wears a sample until the
  professional replaces it, or a tile is an empty box.
* **The Glowinary mark, anywhere.** Glowinary speaks for itself; a template
  never carries our name.
* **A real trading name** in the text. Names inside a design are unmistakable
  placeholders: `Your Studio Name`, `@yourname`, `123 Anywhere St, Your City`.
* **A phone number outside Ofcom's drama range**, 07700 900000 to 900999. The
  070 range is real and chargeable.
* **An `author_id`.** Templates here belong to nobody.

---

## What never happens in this repo

* **Nothing is edited once the CEO has kept it.** A design that was wrong is
  wrong in a NEW numbered file. The only deletions are the ones he asks for.
* **Nothing is copied.** Structure, never substance.
* **No credentials, ever.** If something seems to need a key, it belongs on
  Glowinary's side, not here.
