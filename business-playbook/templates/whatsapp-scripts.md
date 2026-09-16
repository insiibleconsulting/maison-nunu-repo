# Template — WhatsApp scripts

Quick replies and conversation scripts. Set the quick replies up in
Settings → Business tools → Quick replies, using the shortcuts shown.

**Two blanks below are marked `[CONFIRM]`.** They stay blank until the client answers questions 2
and 3 in `09-open-questions.md`. Do not fill them with an assumption. A guessed payment method or an
invented exchange window is a promise the business has to keep.

---

## Automated messages

### Greeting message

Sent to a first-time sender, or after 14 days of silence.

```
Hi, thanks for messaging Maison Nunu 🤍

Tell me which piece you’re looking at and I’ll send photos,
sizing and availability.
```

Short on purpose. A long automated wall is the first thing that makes a shop feel like a bot.

### Away message

Set to outside business hours. **The hours must match `SITE.hours` and the WhatsApp profile.**

```
Thanks for your message. We’re away right now and will reply
when we open, Mon to Fri, 9am to 5pm.

If it’s about a specific piece, send the ref code (for example
RNG-01) and it’ll be waiting for you.
```

The ref code ask means the overnight message arrives already actionable.

---

## Quick replies

### `/ref` — someone sent a screenshot with no context

```
Lovely choice. Can you send me the ref code under the piece?
It looks like RNG-01. That way I’ll send you the right one.
```

### `/size` — ring sizing

```
Easiest way to check at home: take a ring that already fits the
right finger, measure straight across the inside in millimetres,
and send me the number.

If you don’t have one, wrap a strip of paper around the finger,
mark where it meets, and measure the length. Send me that.

Measure at the end of the day, when fingers are largest.
```

### `/care` — looking after it

```
Last on, first off. Put it on after perfume and lotion, take it
off before swimming, showering or sleeping.

Wipe it with a soft dry cloth after wearing. Store pieces apart
so they don’t scratch each other.

Gold vermeil is a thick layer of gold over silver. Treated well
it lasts years. Treated badly it wears through at the edges first.
```

Adapted from the site’s `/guide/` page so the answers match.

### `/see` — arranging to see a piece

```
Happy to. We handle everything in person, by appointment, so you
can see it properly before deciding.

Which day suits you? I’ll confirm a time and a place here.
```

### `/pay` — how to pay

```
[CONFIRM — question 2 in 09-open-questions.md]

Do not write anything here until the client has said, in their own
words, which payment methods they accept and whether a deposit is
ever taken. Leave the quick reply unset rather than guessing.
```

### `/exchange` — wrong size or change of mind

```
[CONFIRM — question 3 in 09-open-questions.md]

The most common hesitation in a WhatsApp jewelry sale. A clear,
true answer converts. An invented one is a policy the business
is then held to.
```

### `/source` — asking for something not in stock

```
The site shows what we carry, not everything we can get.

Tell me what you’re looking for, or send a picture, and I’ll check
what’s possible and come back to you with a price and a timeline.
```

Only set this one up once question 8 confirms sourcing genuinely works.

---

## The conversation

### A price question

**Never answer with only a number.** A bare figure invites a comparison and ends the thread. Price,
one concrete line about the piece, then a question.

```
That’s the {name}, {price} FCFA. Ref {SKU}.

{One concrete detail: 9ct gold vermeil with a hand-brushed face,
and it takes engraving well.}

Do you know your size, or shall I send you how to measure?
```

### "Is it available?"

```
Yes, {one/two} in stock. Ref {SKU}, {price} FCFA.

Would you like to see it in person? I can hold it for you
until {day}.
```

A hold with an expiry converts much better than an open one, and it is honest as long as the piece
really is released afterwards.

### "That’s expensive"

Do not defend the price, and do not discount immediately. Explain the difference, then offer a
genuine alternative.

```
I understand. That one’s {material}, which is why it sits where
it does. It will still look like this in five years.

If the budget is nearer {lower figure}, look at the {alternative},
ref {SKU}, at {price} FCFA. Same feel, lighter weight.
```

Every collection should have a cheaper honest alternative ready. That is what the website's price
bands are for: under 75k, under 120k, under 200k, over 200k.

### The close

The most common failure in a WhatsApp shop is a good conversation nobody closes. Ask.

```
Shall I set it aside for you?
```

Then, once they agree:

```
Done, it’s reserved under your name until {day}.

{Payment instructions — [CONFIRM]}

We’ll agree a time and place here once that’s through.
```

### The follow-up — once, at 48 hours

```
Hi {name}, just checking in on the {name}, ref {SKU}. Still here
if you’d like it. No rush either way.
```

**One follow-up. Not three.** One is service, three is pressure, and in a market this size pressure
costs referrals. If it gets nothing, leave the thread labeled `Sent details` and move on. People
come back months later.

### After the sale

```
Thank you {name}, it was lovely to meet you.

If anything about it needs attention later, message me here.

If you wear it and like it, I’d love to see a photo. I’d always
ask before posting anything.
```

Three things in six lines: an after-sale contact, permission sought properly, and a customer photo
requested. That photo becomes a Pillar 3 post, which is the highest-converting content the account
can run.

### Something you cannot answer

```
Good question, I don’t want to guess. Let me check and come
back to you today.
```

Then actually come back, the same day, even if the answer is no. A reseller's credibility is built
out of accurate small answers.

---

## Never say

| Do not say | Because |
|---|---|
| "We make these" / "our house piece" / "hand-finished by us" | False. Maison Nunu resells. `CLAUDE.md` invariant 5c |
| A payment method before question 2 is answered | It becomes a commitment the moment it is typed |
| A returns window before question 3 is answered | Same |
| "Last one" when it is not | Found out quickly in a small market, and it stops working forever |
| "I'll check" without checking | The only thing that permanently damages a WhatsApp shop |
| A delivery promise not confirmed with the client | Question 10 |
