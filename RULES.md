# Building a Glowinary Studio template

> CEO, 2026-08-11: *"upgrade the level of capability while you do those templates so you
> get better and better… think like a big platform like CapCut. There is no difference,
> we can also be that big. I want pros in the UK to say Glowinary is one of the best
> places to get a template and post for my social media."*
>
This file is the craft. `CLAUDE.md` says what Studio *is*; this says how to build a
template in it that is worth a professional's name. Read it before writing a
`studio_templates` row, and add to it whenever something new is learned the hard way.

---

## 0. The rule above all the others

> CEO, 2026-08-11: *"Glowinary speaks for itself, without us as the Glowinary team
> saying anything."*

**The work is the marketing. Nothing else is.**

That is not a slogan — it decides things:

- **No Glowinary mark goes on a template. Ever.** No watermark, no "made with", no
  badge in the corner, no logo in the export. Not as a free-plan nag, not as a credit.
  A pro posts it as **their** work, because it *is* their work.
- **The quality is the signature.** The only thing that should make another
  professional ask *"what did you make that with?"* is that the post is better than
  theirs. If a template needs our name on it to be traced back to us, it was not good
  enough to be worth tracing.
- **So every template must be one a pro is proud to post under their own name.** That
  is the pass mark, and it is higher than "finished". A template that is merely correct
  — the layout works, nothing overlaps, the text fits — is not yet good enough to ship.
  Ask: *would a professional in Manchester put their name on this?*
- **Never ask the pro to do our marketing.** No template asks them to tag us, mention
  us, or thank us. The post earns the next pro; we say nothing.

Everything below this section is in service of that one paragraph.

---

## 1. The engine's fixed facts

These are not preferences. Designs that ignore them render wrong.

**Paint order is: background → media slots → shapes → images → text → badges.**
It cannot be changed for one template without changing every published one.

- A shape drawn over a photo **hides** it. There is no z-index.
- Therefore: a photo can never sit *on top of* a card, a panel, or a wedge.
- Badges are last, so a badge **can** straddle a panel's edge — which is a real
  layering effect, and one of the cheapest premium details available.

**Consequences worked around in shipped templates**, so you don't rediscover them:

| Wanted | Reality | What to do instead |
|---|---|---|
| Photo inset inside a white card | Card covers photo | Photo **above** the card, card's top edge 1% **into** it — the card swallows the photo's lower corners and the two read as one object *(Package Compare)* |
| Photo lying across a diagonal | Wedge covers photo | Move them so the photo tucks **behind** the wedge's edge — a real relationship, not a crescent *(Barber Card)* |
| Photo inside a row card | Card covers photo | Two tiles of equal height and radius butted together *(Service Rows)* |
| A line connecting markers over a photo | Shape cuts across the picture | Don't draw it. Position carries the curve *(Step Arc)* |

**Slots paint in array order**, so later slots sit on earlier ones. Use it deliberately
— that is how *Polaroid Stack* gets a pile of prints.

**Geometry is by CORNER, not centre**, for shapes and slots: `x + w` is what matters.
A panel at `x30 w78` on a 1080 square runs to 108 and eats the page *(Spa Mosaic, fixed)*.
Badges are the exception — their `x` **is** the centre.

**Everything is % of canvas except `size`, `radius`, `letterSpacing`, `blur` and
shadow offsets, which are px at canvas scale.**

**Percentages are NOT square.** On any non-square format, `w: 46, h: 46` is an egg. A
round slot needs `h = w × (canvasWidth / canvasHeight)` — on 1080×1350 that is
`h = w × 0.8`. It never bites on a square canvas, which is exactly why it slipped
through on the first circle drawn on a post *(Detail Callout, fixed)*.

**Rotation happens in PIXELS while position is in PERCENT.** Any angled element —
a diagonal wedge, a leader line — has geometry that is specific to that canvas size
and must be recomputed if the format changes. Work the endpoints out in px, then
convert back.

---

## 2. Techniques — the vocabulary we actually have

Reach for these before deciding something is impossible.

**The arch.** A slot with `radius: 999` whose height runs **past the bottom of the
canvas**. The radius clamps to half the narrow side, so the top rounds into a true
semicircle and the stadium-making bottom corners are never seen. Domes, niches,
windows. *(Arch Poster)*

**The soft edge between two areas.** One enormous ellipse, **two to three times wider
than the frame**, with its bottom just past where the curve should sit. An ellipse
narrows towards its own bottom, so an ellipse sized to the visible curve always
collapses at the sides. *(Care Tips — got this wrong first, then right)*

**The ring / hairline frame.** A glass shape with `blur: 0` and a near-transparent
tint paints **only its border**. Outlined boxes and hollow circles with the photograph
passing through untouched. *(Routine Steps, Step Arc, Care Tips)*

**The diagonal.** A rotated rectangle running past three edges. Honest limit: where it
meets the frame the cut is straight, not mitred. At 8–14° nobody reads it as a
rectangle. *(Spa Mosaic, Barber Card)*

**Depth.** Two slots: one full-bleed with `blur: 20–30` as atmosphere, one sharp on
top. The only way to get a background genuinely *behind* something. *(Discount Card)*

**A circle.** `radius: 999` on a slot, as the app does for avatars.

**Print thickness.** `rotation` + a white `border` turns a rectangle into a photograph
you could pick up. *(Polaroid Stack)*

**The quarter-round corner block.** The arch trick sideways: `radius: 999` on a rect
with three of its corners pushed off the canvas, so the only rounded corner you see is
the one facing into the page. *(Corner Blocks)*

**The general principle behind all of these: a shape is cheapest when most of it is
off-canvas.** Every soft form in this library — the arch, the Care Tips curve, the
corner blocks — is an ordinary primitive with its awkward parts hidden outside the
frame. Reach for that before concluding a shape is impossible.

**Pointing at something.** A blurred full-bleed slot plus the SAME photo sharp in a
circular slot, joined by a rotated hairline. The only way the library has to say
"look here" rather than "look at this". *(Detail Callout)*

**The carved edge.** Overlapping ellipses **in the background colour**, laid over a
photograph's edge to eat a soft wave into it. Everywhere else "shapes paint above
slots" is a constraint; here it is the whole mechanism. *(We Come To You)*

**Four ways to divide a page between colour and photograph**, all now in the library
and all different objects — a **seam** *(Salon Card)*, a floating **panel**
*(Package Panel)*, a straight **cut** *(Studio Card)*, and a **carve**
*(We Come To You)*. Before adding a fifth, it has to be a fifth kind of boundary.

---

## 3. What we do not fake — and the escape hatch

**FIRST: READ `SHAPE_PATHS` IN `lib/studio.ts` BEFORE DECLARING A SHAPE MISSING.**
It holds about forty paths and many are domain-specific — `scissors`, `polish`,
`lipstick`, `lotus`, `leaf`, `flower`, `candle`, `burst`, `sunburst`, `blob`, `arch`,
`scallop`, `rosette`, `wave`, `droplet`, `butterfly`. The Barber Card shipped with
diamond bullets and a comment confidently explaining that Studio had no scissors,
which it does. A claim of "we cannot draw that" made from memory costs a design
something every time.

Then: every reference has ornament we genuinely cannot draw. **Approximating a
supplied illustration produces something that looks like a failed copy of it, which is
worse than its absence.** Declined so far, and each was the right call:

filament swirls · a line-art face · an iridescent swirl · torn-paper edges ·
five bespoke line-art icons · botanical arrangements · dotted leaders · a tick glyph

**A note on shaped photographs.** `blob` and `scallop` exist as SHAPES, but a media
slot has only `radius` — it cannot be masked to a path. So a scalloped *photo frame*
is still out of reach, while a scalloped *shape* is one word. Know which one the
reference is asking for.

**The escape hatch is real and cheap:** upload the artwork to `studio_assets` via
`/api/admin/studio/upload` and any template can place it as an image layer. If the CEO
wants leaves, leaves become an asset — not fifty lines of bezier guesswork.

**One is a hard engine limit, not taste:** dotted leaders. A leader must stretch to fill
whatever space a name leaves, which needs measured text — and the preview measures in
the DOM while the export measures on canvas. That is precisely the drift the engine
exists to prevent.

---

## 4. The rule the CEO enforces: never a variant

> *"Never ship palette-swap variants — every template must be a genuinely different
> design (layout, structure, motion), not a recolour of an existing one."*

Two templates may share a **primitive** if they use it for an **opposite structure**.
Before writing a row, name the difference in one sentence. If you cannot, do not build it.

Worked examples, all shipped:

- **Glass** — *Why You Need*: five separate pills, one word each, a checklist of what one
  treatment does. *Our Services*: one panel with ruled lines, a formal menu.
  *Everything I Offer*: fourteen solid pills staggered on a gradient, read as abundance.
- **Before/after** — *Before / After*: reel, stacked, curved words, no captions, for a
  story. *Transformation Pair*: square, side by side, labelled and captioned, for a feed
  where somebody is reading as much as looking.
- **Price** — *Treatment List*: one column, every treatment equal, a specialist's menu.
  *Sectioned Prices*: two headed sections with photographs, for a salon that does more
  than one thing. *Package Compare*: three packages across, a **choice** not a menu.
- **Barber** — *Barber Card*: navy, gold wedge, condensed, one circular photo, geometric.
  *Polaroid Stack*: black, no wedge, heavy sans, three tilted prints, physical.
- **Teaching** — *Routine Steps*: three steps, a paragraph each, a routine you read.
  *Step Arc*: five steps on an arc, two words each, an instruction you glance at.
  *Care Tips*: five tips, **no sequence**, which is why it is ticked and not numbered.

**A template with a purpose nothing else covers is worth more than a prettier version of
one we have.** The library's strongest entries are the ones that were missing:
*Dates Left* (asks for a booking on a named day), *New Opening* (announces an event),
*The Chair* (sells the place, not the service), *Routine Steps* (gives something away).

---

## 5. Making it premium

**Structure over effect.** From `docs/studio-cinematic.md`, measured off real reels: the
expensive feel comes from pacing and structure, not transitions. The same holds for
stills — no template here needs a filter to look costly.

**One idea per template.** *Just Added* can only say one thing at 150px, and that is what
stops a pro cramming five things into it. A template that permits everything produces
nothing good.

**Emphasis must be decided, not distributed.** *Discount Card* and *Treat Yourself* have
the same ingredients and inverted hierarchies — the offer is the hero in one, a detail in
the other. Choosing wrong is how a good offer gets scrolled past.

**Contrast that survives any input.** *Photo Column* is one word at weight 900 above the
same size at 400; *Editorial Cover* is 700/300/700. A pro can type any words and the
structure holds. A size-stepped headline breaks the moment the words change length.

**Containers are how amateur layouts make text safe.** Removing them is a statement —
*Editorial Cover* has none, and it is the most expensive-looking page in the set. Earn it
with a scrim of 0.15 and typography that can carry itself.

**Six percent is a recommendation.** Lifting *Package Compare*'s middle card turns a table
into an endorsement. The cheapest premium moves are positional.

**Restraint is a design.** *The Chair* says almost nothing over a dark room and is nobody's
second choice — it is the only template that works with no person in the photograph, which
matters for a pro who has a room before they have a portfolio.

**Ornament is large and slow, never small and scattered** (CEO rule): no particle balls,
no floating glass buttons. `spark` shapes go where light would catch an edge.

---

## 6. Copy inside a template

The seeded example copy is what **every pro starts from**, so it is product, not filler.

- **British English.** Colour, moisturise, ageing, £.
- Keep every line to **one rendered line** at its width. A description that wraps breaks a
  fixed-height grid — and it will break in the example copy first *(Treatment List, fixed)*.
- Placeholders are `Your Name`, `@yourname`, `123 Anywhere St, Your City`, `07000 000000`.
  Brand Kit rewrites `@yourname` and `Your Name` automatically on open.
- Write copy a real professional would post. "Six weeks of waking up ready" sells a lash
  lift; "Lash Lift Treatment Available Now" does not.

---

## 7. Before it is a row

1. **Name the difference** from every existing template in one sentence (§4).
2. **Pick the format for the job**, not by habit — reel for a story, square for a feed,
   post for detail, landscape when three columns of copy need the width.
3. **Draft the config**, then **apply and RENDER it**. Never ship a template nobody has
   looked at. Every bug in this library was found in a picture, not in review:
   a number placed at another marker's y, a panel that ate the page, photos floating
   above their cards, a curve that collapsed at the sides, a headline off the top of the
   frame. All of them read as perfectly plausible JSON.
4. **Seed as `draft`.** The CEO previews and publishes. A template that reaches pros
   before anyone has looked at it cannot be un-seen.
5. **A seed never updates a row it did not make.** Matching on name and category is
   not ownership: the first run of `seed-template-pack-v1.mjs` found a published
   *In Their Words* from 22 July under the same name and category and wrote over it.
   It came back from `studio_template_versions` the same evening. Refuse any existing
   row older than the seed itself, and check the name is free before choosing it.
6. **Write the migration's comment for the next person** — what the reference was, what
   was refused and why, what the numbers mean. Those comments are why this file exists.

---

## 8. The cheap zone — measured from 59 designs the CEO threw out

> CEO, 2026-08-22, after clearing the gallery by hand: *"I have deleted similar
> designs like those. They are not Glowinary style."*

He archived **59** templates in one sitting, 52 of a batch of 123 and **7 from
the original library**, which is what makes this a taste rule rather than a
verdict on one bad afternoon. Both sets were rendered and compared, and the
difference is measurable rather than a matter of opinion.

**What did NOT separate them.** Not a white card floating on a photograph: 23%
of the rejected and 21% of the kept. Not a missing photograph: 13% against 10%.
Not loud colour: 2% against 1%. Every one of those was my first guess from
looking, and every one was wrong. Measure before concluding.

**What did.** A drawn shape sized between roughly a quarter and two thirds of
the canvas:

| | rejected (52) | kept (71) |
|---|---|---|
| any drawn shape (not rect/ellipse/circle) | 62% | 25% |
| a drawn shape **24–64%** wide | **38%** | **4%** |
| a circle or ring **26%+** wide | 21% | 4% |

Nine times more common in the rejected set. That band is the cheap zone.

### Why that band and not a size limit

Because the same shape is fine on either side of it.

- **Under about 20% it is punctuation.** A small leaf in a corner, a sun, a
  moon, a droplet above a headline. Kept: *Wash It Less*, *Put It Down*,
  *Morning Or Evening*, *Festive Hours*, *The Quiet Hours*.
- **Over about 68% it is structure.** An edge, a ground, a container: a torn
  edge at 112%, a wave at 120%, a speech bubble at 84% with the words inside it.
  Kept: *Half A Reveal*, *Under Water*, *Tell Me First*, *I Have To Move Things*.
- **In between it is a picture of a thing.** Big enough to be looked at, too
  small to be the page. Rejected: a gift at 34% for a voucher, a clock at 32%
  for "back in ten", a pin at 14% inside rings for an address, a heart at 14%
  for a charity day, an envelope at 62% for a mailing list, a ticket at 84%
  behind an offer, four icons in four white boxes for an aftercare label.

### The rule underneath it

**A shape may be STRUCTURE, or PUNCTUATION, or it may be nothing. It may never
be the SUBJECT.**

And the sharper form, which explains every rejection in one line:

**Never draw a picture of what the post is already about.** The words say
voucher; a gift box adds nothing and costs the page its credibility. This is an
industry that sells photographs, and a vector gift box sitting beside real
photographs is the single fastest way to look like a free template.

Four kept designs sat inside the band when this was written, and two of them
have since been archived as well. **See section 9: the exception list below was
wrong**, and it is left here rather than quietly edited because a rulebook that
hides its own mistakes teaches nothing.

*How To Pay* (a zigzag as a receipt's torn edge) and *Step Away From The
Scissors* (scissors at 8% opacity as a watermark) survive. *Look Closer At
Skin*, which this section defended as "a ring that POINTS at something", and
*Tell Me First*, whose bubble is a container rather than an illustration, were
both thrown out on the next pass. There is no structure-or-pointer exemption.
Section 9 has the rule that actually separates them.

### What to do instead

The rejected templates all had a real purpose. The purpose was not the problem.

- **Let the photograph be the picture.** It already is one, and it is theirs.
- **Let the type carry the meaning.** *Wash It Less* says one instruction at
  150px over a photograph and is one of the strongest in the library.
- **If a page needs an object, make it structural**: a band, a carve, an arch
  the photograph sits inside, an edge that divides the page.
- **A number is not a badge.** Setting "48" inside a big yellow disc made a
  sticker. Setting it large in the type, on the ground, would have been enough.

### The reference design: *Three Panes*

> CEO, 2026-08-22: *"I will tell you which one was the top number one best
> template you made today. Only number 223. I like it, and that's a Glowinary
> style I am talking about."*

Position 223 in the gallery is **Three Panes**, and it is worth studying because
it is the rule stated as a design rather than as a paragraph:

- **One photograph, full bleed.** The professional's own work is the ground, not
  an inset, not a thumbnail, not a strip.
- **Three shapes, and every one of them a plain rectangle.** No drawn object
  anywhere. They are 62% wide, which would be the cheap zone for an icon and is
  fine here, because a rectangle at that size is a PANEL: something the words
  live on, not a picture of anything.
- **They are glass**, so the photograph shows through the structure rather than
  being covered by it. The page has depth without a single illustration.
- **The type does the talking**, three lines of it, one per pane.

When in doubt, build that: a photograph, primitives used as structure, and
words. Everything the CEO archived departed from it in the same direction, by
adding a drawing of the thing the words already said.

### Feeding the design engine

When the AI design button in Growth lets professionals generate their own
templates, this section is what it must be given, and the 24–64% test is
mechanical enough to check rather than merely ask for. **Invariant 22 already
fails the deploy** if a template migration seeds a drawn shape inside the band,
so the rule is enforced on us before it is ever offered to them.

---

## 9. The correction — a template must not look like an INTERFACE

> CEO, 2026-08-23, on a second and much smaller pass: five more, *"they are not
> Glowinary style."*

Five out of sixty-six is a far sharper signal than fifty-nine out of a hundred
and twenty-three, and it says something section 8 got wrong.

**Two of the five were designs section 8 had explicitly defended.** It listed
*Look Closer At Skin* as an acceptable use of a shape in the cheap zone, "a ring
that POINTS at something", and the same reasoning protected *Tell Me First*,
whose speech bubble is a container rather than an illustration. Both were
archived. The exception list was wrong, and being wrong in a rulebook is worse
than not having written it.

**And two of the five contain no drawn shape at all.** *Five And The Sixth* and
*Both Of You* are built entirely from rectangles and circles, which section 8's
test cannot see. So the rule was not merely too generous, it was measuring the
wrong thing.

### What the five actually have in common

| | what it draws |
|---|---|
| *Five And The Sixth* | five stamps in a row, four filled: a loyalty CARD |
| *Both Of You* | two boxes with a plus between them: an EQUATION |
| *Look Closer At Skin* | a circle on a leader line: a MAGNIFIER |
| *Tell Me First* | a speech bubble with words inside: a CHAT WINDOW |
| *All The Way Down* | half the page a flat panel carrying four lines |

The first four are **user interface**. A progress indicator, a diagram, a
tooltip, a message bubble. Every one of them explains a MECHANISM: how the
loyalty scheme counts, how the referral maths works, where to look, that this is
a conversation.

**That is the real rule, and it subsumes section 8.** An icon depicting the
subject is one special case of it. A gift box for a voucher is cheap for the
same reason a stamp row is cheap: both draw the *idea* instead of showing the
work.

> **A template is a photograph with words on it. It is never a diagram, a
> control, or a screen from an app.**

No progress bars, no stamp rows, no step indicators, no plus or equals between
boxes, no arrows explaining a flow, no magnifiers, no speech bubbles, no toggles,
no cards that look tappable. Those are how software explains itself to a user.
A beauty professional is not explaining software; they are showing what they
did to somebody's hair.

### The fifth one is a different fault, worth naming separately

*All The Way Down* has no widget. Its problem is proportion: a flat dark panel
takes fifty-two per cent of a story to carry four short lines, and the
photograph is squeezed into a strip beside it. **Flat colour must earn its area.**
Half a page of it needs either a headline big enough to fill it or a reason to
be empty. Compare *Chair To Rent*, which was kept: the same dark ground, but the
arch cuts into it and the type sits at a size that occupies it.

### What this changes about section 8

Section 8's measurement still holds and its numbers are real. But its **exception
list is deleted**: there is no "structure, ground, pointer" exemption that makes
a drawn object safe. *How To Pay* and *Step Away From The Scissors* survive
because a receipt's torn edge and a watermark are not interfaces, not because
they were granted a licence.

Test in this order:

1. **Does the page look like a screen, a diagram, or a control?** If yes, stop.
2. **Does a shape draw the thing the words already said?** If yes, stop.
3. **Does every area of flat colour earn its size?** If no, cut it or fill it.
4. **Is the professional's photograph the substrate?** If not, it needs a reason.
