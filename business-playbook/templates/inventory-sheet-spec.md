# Template — the inventory and sales sheet

Build this once. Every formula below is copy-paste ready and written for the **United States
locale**, which uses commas as argument separators. Do not change the spreadsheet locale.
See `05-inventory-and-sales.md` for why.

Create one Google Sheet called `Maison Nunu — operations` with four tabs:
`Inventory`, `Sales`, `Leads`, `Dashboard`.

The `Leads` tab name must be spelled exactly that way. The Apps Script in `apps-script/Code.gs`
looks for it by name and will create a second one if it does not match.

---

## Tab 1 — Inventory

One row per piece the business owns or has ever owned. Never delete a row.

| Col | Header | Type | Filled by |
|---|---|---|---|
| A | `SKU` | text | You. Matches the website exactly: `RNG-01` |
| B | `Name` | text | You |
| C | `Collection` | dropdown | You |
| D | `Supplier` | text | You |
| E | `Date in` | date | You |
| F | `Cost price` | FCFA | You. **At intake, never later** |
| G | `List price` | FCFA | You |
| H | `Qty in` | number | You |
| I | `Qty sold` | formula | Itself |
| J | `On hand` | formula | Itself |
| K | `Days held` | formula | Itself |
| L | `Margin %` | formula | Itself |
| M | `Photo done` | dropdown | You |
| N | `Live on site` | dropdown | You |
| O | `Notes` | text | You |

**Row 2 formulas.** Enter these in row 2, then drag down to row 1000.

```
I2   =SUMIF(Sales!$B$2:$B, $A2, Sales!$D$2:$D)
J2   =IF($A2="", "", $H2-$I2)
K2   =IF($A2="", "", IF($J2<=0, "", TODAY()-$E2))
L2   =IF(OR($A2="", $G2="", $G2=0), "", ($G2-$F2)/$G2)
```

`K2` deliberately returns blank rather than a word like "sold out" when stock is gone. A column
mixing numbers and text breaks the Dashboard's dead-stock filter, which is the exact report this
column exists to feed.

**Dropdowns.** Data → Data validation → Dropdown.

- Column C: `earrings, bracelets, necklaces, watches, rings, raffia, sunglasses, brooches`
  These are the website's eight category ids, lowercase, exactly as they appear in URLs.
- Columns M and N: `yes, no`

**Formatting.**

- F, G: custom number format `#,##0" FCFA"`
- L: percent, 0 decimals
- Freeze row 1: View → Freeze → 1 row
- Conditional formatting on J: *less than or equal to 0* → gray text. *Equal to 1* → amber fill,
  so a last-one is visible at a glance and can be posted as one
- Conditional formatting on K: *greater than 90* → red fill

---

## Tab 2 — Sales

One row per line item sold. If someone buys three pieces at once, that is three rows sharing a date
and a customer.

| Col | Header | Type | Filled by |
|---|---|---|---|
| A | `Date` | date | You |
| B | `SKU` | text | You |
| C | `Name` | formula | Itself |
| D | `Qty` | number | You |
| E | `Unit price` | FCFA | You. **What was actually charged** |
| F | `Revenue` | formula | Itself |
| G | `Cost` | formula | Itself |
| H | `Margin` | formula | Itself |
| I | `Payment` | dropdown | You |
| J | `Channel` | dropdown | You |
| K | `Customer` | text | You |
| L | `Phone` | text | You |
| M | `Notes` | text | You |

**Row 2 formulas.** Drag down to row 2000.

```
C2   =IFERROR(VLOOKUP($B2, Inventory!$A$2:$O$1000, 2, FALSE), "")
F2   =IF($D2="", "", $D2*$E2)
G2   =IFERROR($D2*VLOOKUP($B2, Inventory!$A$2:$O$1000, 6, FALSE), "")
H2   =IF(OR($F2="", $G2=""), "", $F2-$G2)
```

**Dropdowns.**

- Column I `Payment`: leave this list until the client confirms what they actually accept. See
  `09-open-questions.md`. Do not guess at mobile money providers. Once confirmed, likely values are
  cash, MTN MoMo, Orange Money, bank transfer.
- Column J `Channel`: `instagram, tiktok, website, whatsapp direct, walk-in, referral, other`

Channel is the column that tells you where to spend effort. Ask every buyer how they found you and
fill it honestly, including `referral`, which is usually undercounted because it feels like it does
not count.

**Returns and cancellations:** add a new row with a negative `Qty` and a note. Never edit or delete
the original.

---

## Tab 3 — Leads

**Do not build this tab by hand.** The website fills it.

The header row is written by running `setupSheet()` once from the Apps Script editor, and the
columns are fixed by `apps-script/Code.gs`:

```
A Timestamp   B SKU        C Piece     D Page      E Referrer
F Country     G Device     H Name      I Note      J Status
```

Column J is a dropdown the script installs itself. Work it like a queue: every new row is `New`,
and it should not stay that way.

One manual habit worth keeping: when a lead becomes a sale, put the SKU and date into the Sales tab
and mark the lead row `Won`. That single act is what makes the conversion number real.

---

## Tab 4 — Dashboard

No data entry. Put the labels in column A and the formulas in column B.

### This month vs last month

| A | B (this month) | C (last month) |
|---|---|---|
| `Revenue` | `=SUMIFS(Sales!$F$2:$F, Sales!$A$2:$A, ">="&EOMONTH(TODAY(),-1)+1, Sales!$A$2:$A, "<="&EOMONTH(TODAY(),0))` | `=SUMIFS(Sales!$F$2:$F, Sales!$A$2:$A, ">="&EOMONTH(TODAY(),-2)+1, Sales!$A$2:$A, "<="&EOMONTH(TODAY(),-1))` |
| `Margin` | `=SUMIFS(Sales!$H$2:$H, Sales!$A$2:$A, ">="&EOMONTH(TODAY(),-1)+1, Sales!$A$2:$A, "<="&EOMONTH(TODAY(),0))` | `=SUMIFS(Sales!$H$2:$H, Sales!$A$2:$A, ">="&EOMONTH(TODAY(),-2)+1, Sales!$A$2:$A, "<="&EOMONTH(TODAY(),-1))` |
| `Margin %` | `=IFERROR(B3/B2, "")` | `=IFERROR(C3/C2, "")` |
| `Units sold` | `=SUMIFS(Sales!$D$2:$D, Sales!$A$2:$A, ">="&EOMONTH(TODAY(),-1)+1, Sales!$A$2:$A, "<="&EOMONTH(TODAY(),0))` | |
| `Sale lines` | `=COUNTIFS(Sales!$A$2:$A, ">="&EOMONTH(TODAY(),-1)+1, Sales!$A$2:$A, "<="&EOMONTH(TODAY(),0))` | |
| `Avg line value` | `=IFERROR(B2/B6, "")` | |

Rows are assumed to start at row 2 (`Revenue`). Adjust the references in `Margin %` and
`Avg line value` if you lay it out differently.

`Avg line value` is per line, not per order. A customer buying two pieces counts twice. Good enough
to track a trend, not precise enough to quote.

### Stock position

```
Stock at cost      =SUMPRODUCT(Inventory!$J$2:$J$1000, Inventory!$F$2:$F$1000)
Stock at retail    =SUMPRODUCT(Inventory!$J$2:$J$1000, Inventory!$G$2:$G$1000)
Pieces on hand     =SUM(Inventory!$J$2:$J$1000)
SKUs in stock      =COUNTIF(Inventory!$J$2:$J$1000, ">0")
```

`Stock at cost` is cash currently sitting on a shelf. Watch its direction, not its size.

### Dead stock, over 90 days

```
=IFERROR(
  SORT(
    FILTER({Inventory!$A$2:$A$1000, Inventory!$B$2:$B$1000, Inventory!$F$2:$F$1000, Inventory!$K$2:$K$1000},
           ISNUMBER(Inventory!$K$2:$K$1000), Inventory!$K$2:$K$1000 > 90),
    4, FALSE),
  "Nothing over 90 days.")
```

Returns SKU, name, cost and days held, oldest first. `ISNUMBER` is what keeps blank cells in the
`Days held` column out of the result. Act on every row of this list monthly.

### Top five by margin

```
=IFERROR(QUERY(Sales!$A$2:$M$2000,
  "select B, sum(D), sum(F), sum(H) where B is not null group by B order by sum(H) desc limit 5
   label sum(D) 'Units', sum(F) 'Revenue', sum(H) 'Margin'", 0),
  "No sales logged yet.")
```

Sorted by margin, not by units. These are the pieces to reorder.

### Where sales come from

```
=IFERROR(QUERY(Sales!$A$2:$M$2000,
  "select J, sum(F), count(A) where J is not null group by J order by sum(F) desc
   label sum(F) 'Revenue', count(A) 'Sales'", 0),
  "No sales logged yet.")
```

### Enquiry to sale, last 30 days

```
Enquiries      =COUNTIFS(Leads!$A$2:$A, ">="&TODAY()-30)
Sales          =COUNTIFS(Sales!$A$2:$A, ">="&TODAY()-30)
Conversion     =IFERROR(B21/B20, "")
```

Adjust `B20` and `B21` to wherever the two rows above actually sit.

A healthy first-year range is 15 to 30%. Below that with healthy enquiry numbers means the problem
is price, photographs or reply speed. Posting more will not fix it.

---

## Once it is built

- [ ] Locale is United States. Confirm a formula with commas evaluates
- [ ] `#,##0" FCFA"` applied to every price column, zero decimals
- [ ] Row 1 frozen on all four tabs
- [ ] Formulas dragged to row 1000 (Inventory) and 2000 (Sales)
- [ ] Conditional formatting live on `On hand` and `Days held`
- [ ] `setupSheet()` run once from the Apps Script editor, `Leads` header present
- [ ] Owned by the client's Google account, not a consultant's
- [ ] Shared view-only with anyone who does not need to edit
- [ ] A test row entered in Sales, checked against the Dashboard, then deleted
