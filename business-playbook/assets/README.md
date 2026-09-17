# Packaging assets

## `qr-card.svg` · `qr-card-600dpi.png`

The QR printed on the earring card and reusable on the hang tag.

| | |
|---|---|
| **Encodes** | `https://maisonnunu.com` |
| **Colour** | burgundy `#7a2036` on soft beige `#ede9e4` |
| **Size** | 22 mm square minimum. The SVG is drawn at true size in mm |
| **Quiet zone** | 4 modules, already built into the file. **Do not crop it** |
| **Version** | 2 (33 × 33 modules), error correction M |

**It encodes the domain, never the phone number.** A QR pointing at
`wa.me/<number>` is frozen the moment it is printed: change the number and every
card ever produced is dead, with no redirect and no way to reach those customers.
The domain keeps the number editable in one config line, and the site routes the
visitor onward. It costs the customer one extra tap.

### Rules that keep it scanning

- Never invert it. Scanners need dark modules on a light ground
- Never crop the quiet zone, and keep other artwork out of it
- Never stretch it. Square only
- Never drop a logo in the centre. Error correction M has no budget for it
- Below 22 mm it gets unreliable on cheap print

### Verified

Decoded back with a real reader at 300 and 600 dpi, sharp and blurred, at 22 mm.
Re-run that check after any regeneration — a QR that looks right and does not
scan is the failure mode here, and it is invisible by eye.

To regenerate after a domain change:

```bash
python3 -m pip install segno
python3 -c "
import segno
q = segno.make('https://maisonnunu.com', error='M')
q.save('qr-card.svg', kind='svg', scale=1, border=4, dark='#7a2036', light=None, unit='mm')
q.save('qr-card-600dpi.png', scale=16, border=4, dark='#7a2036', light='#ede9e4')"
```
