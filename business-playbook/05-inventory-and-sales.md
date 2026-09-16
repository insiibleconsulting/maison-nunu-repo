# 05 — Inventory and sales

One Google Sheet, four tabs, no subscription. It answers four questions the business cannot run
without: what is in stock, what it cost, what sold, and what is not moving.

The full column-by-column spec with every formula is in
[`templates/inventory-sheet-spec.md`](templates/inventory-sheet-spec.md). This file explains why it
is shaped that way and how to actually use it.

---

## The intake loop

**This is the most important process in the business.** Every new piece goes through the same five
steps, in the same order, in one sitting. Roughly fifteen minutes per piece.

```
  1. PHOTOGRAPH    five frames, brand ground, 4:5           04-product-photography.md
  2. SKU           npm run product:add -- <collection> <photo>
  3. LOG           one row in the Inventory tab              cost price NOW, not later
  4. PUBLISH       fill the CSV row, status: real, npm run catalog
  5. POST          into the Monday batch                     03-content-system.md
```

Why the order is fixed: the SKU is minted in step 2 and everything downstream keys off it. Logging
before the SKU exists produces rows keyed to a name, and names change. Photographing after the
piece is on a shelf with eleven others produces inconsistent lighting.

**Step 3 is the one that gets skipped and the one that costs money.** Cost price is knowable for
about a day after a piece arrives and then it is a guess forever. A sheet full of guessed cost
prices cannot tell you what you earn, which means it cannot tell you what to buy more of.

---

## Why track cost price at all

Most small retailers track what they sold and what they took. That produces revenue, which feels
like the number but is not. The number is margin.

Two pieces, both sold this month:

```
  BRC-04    sold  85 000    cost  61 000    margin  24 000   28%
  RNG-02    sold  52 000    cost  19 000    margin  33 000   63%
```

The bracelet has the bigger price tag and the ring made more money. Without cost price in the sheet
this is invisible, and the natural instinct is to reorder the bracelet. **Margin, not revenue, tells
you what to buy.** For a reseller, buying decisions are the whole job.

---

## The four tabs

| Tab | One row is | Filled by |
|---|---|---|
| **Inventory** | A piece the business owns or has owned | The client, at intake |
| **Sales** | A line item sold | The client, at the moment of sale |
| **Leads** | A WhatsApp enquiry from the website | Automatically, by the site |
| **Dashboard** | Nothing. All formulas | Itself |

**The Leads tab already exists in the architecture.** The website fires a beacon on every WhatsApp
click, a Cloudflare Function validates it, and an Apps Script appends a row. The script is written
and sitting in `apps-script/Code.gs`, ready to paste. It has never been connected to a real sheet.
See `08-launch-sequence.md`, week 2.

That connection is what makes the conversion number in `00-the-strategy.md` computable: leads in,
sales out, same spreadsheet.

---

## Setting it up without breaking the formulas

**Keep the spreadsheet locale set to United States.** File → Settings → Locale.

This is counterintuitive and it matters. Setting the locale to Cameroon or France switches Google
Sheets' formula argument separator from a comma to a semicolon, and every formula in the template
stops working. The locale is not what formats the currency.

**Format currency with a custom number format instead.** Select the price columns, then Format →
Number → Custom number format:

```
  #,##0" FCFA"
```

Zero decimal places, deliberately. XAF is a zero-decimal currency, there is no centime in
circulation, and a price column showing `145 000,00 FCFA` is wrong in a way that eventually produces
a wrong invoice.

---

## Reading the Dashboard

Six blocks. Look at it once a month, on the first working day, for about twenty minutes.

**This month.** Revenue, margin, margin %, units, average order value. Compare to last month, not
to a target. Three months of trend is worth more than any single figure.

**Stock value at cost.** The cash currently sitting on the shelf. This is the number that should
make you uncomfortable when it grows faster than revenue.

**Dead stock.** Anything held over 90 days with stock remaining. Act on this list every month
without exception:

- Discount it by 15 to 20% and post it as a real last-one
- Bundle it with a fast mover as a gift set
- Use it as a gift with purchase above a threshold
- Return it to the supplier if the terms allow

Doing nothing is also a decision, and it is the expensive one. A piece held twelve months at 61 000
FCFA cost has consumed a year of whatever the next piece would have earned.

**Top five by margin.** What to reorder. Note this is by margin, not units.

**Channel breakdown.** Which of Instagram, TikTok, the website, walk-in and referral is producing
sales. After three months this stops being a guess and starts directing where the effort goes.
Expect referral to be higher than anyone predicts.

**Enquiry to sale.** Leads count against sales count. If enquiries are healthy and conversion is
poor, the problem is prices, photographs or reply speed, not reach. Posting more will not fix it.

---

## Discipline that keeps the sheet true

- **Log the sale before the customer leaves.** Not that evening. Sales logged from memory are the
  main source of wrong numbers, and they are always wrong in the flattering direction.
- **Record the price actually charged**, including any discount given in the chat. A sheet that
  records list prices while the business sells at a discount reports a margin that does not exist.
- **Never delete a row.** A returned or cancelled sale gets a negative quantity and a note. The
  history is the asset.
- **Never reuse a SKU.** It is enforced in the website's build (`data/retired-skus.txt`) and it
  matters here for the same reason: historical sales rows silently start pointing at the wrong
  piece. See `CLAUDE.md` invariant 6.
- **One person edits.** Share the sheet as view-only with anyone else.
- **Export a copy monthly.** File → Download → Excel, into the Drive backup folder. A Google account
  lockout should not cost the business its records.

---

## What this deliberately is not

Not a POS system, not a barcode setup, not accounting software, not stock sync with Instagram
Shopping. All of those cost money or time the business does not have yet, and all of them can be
introduced later from clean data.

Clean data is the point. A year of accurate rows in this sheet is what makes any future system worth
buying, and the thing no software can retroactively supply.
