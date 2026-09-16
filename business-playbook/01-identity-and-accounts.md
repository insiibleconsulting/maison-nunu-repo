# 01 — Identity, email and accounts

Do this before opening a single social account. Accounts opened in the wrong order, on the wrong
email, get abandoned and re-made, and the handle you wanted is gone.

---

## The principle: one root, then branches

Every account the business will ever own hangs off **one email address the client controls**. If
that address is a personal Gmail shared with a consultant, the business does not own its own
identity. Fix it at the start, when it costs nothing.

```
  admin@maisonnunu.com          the root. Owns everything. Rarely logged into.
      ├── Google account        Drive, Sheets, Apps Script, Analytics
      ├── Cloudflare            domain + Pages hosting
      ├── Meta Business Suite   Facebook Page + Instagram
      ├── TikTok Business
      └── password manager
```

---

## Getting @maisonnunu.com email for free

The site already prints `info@maisonnunu.com`. Making it real is a 20 minute job and costs nothing,
because the domain will already be on Cloudflare for hosting.

**Use Cloudflare Email Routing.** It is free, unlimited addresses, and it forwards mail at the
domain into an inbox the client already reads.

1. Cloudflare dashboard → the `maisonnunu.com` zone → **Email** → **Email Routing** → enable.
2. Cloudflare adds the MX and SPF records itself. Accept them.
3. Create these destination routes, all forwarding to one Gmail inbox:

| Address | Forwards to | Used for |
|---|---|---|
| `admin@maisonnunu.com` | the client's Gmail | root account, registrar, banking, nothing public |
| `info@maisonnunu.com` | the client's Gmail | printed on the website and every profile |
| `social@maisonnunu.com` | the client's Gmail | registering Instagram, TikTok, Facebook |

4. In Gmail: **Settings → Accounts → Send mail as** → add `info@maisonnunu.com`. Gmail will ask for
   an SMTP server. Cloudflare Email Routing forwards but does not send, so use Gmail's own SMTP with
   an app password, or accept that replies go out from the Gmail address.

**The honest limitation:** Email Routing receives, it does not send. If the client needs to send
from `info@maisonnunu.com` and have it pass SPF and DKIM properly (worth it once invoices or
supplier orders are involved), that needs a real mailbox:

- **Zoho Mail** free plan: one user, 5 GB, custom domain, webmail only. Free forever. The right
  next step.
- **Google Workspace**: about 21 000 FCFA per user per year at the Starter tier, gives Gmail's
  interface on the domain. Only worth it if the client already lives in Gmail and will not use a
  second webmail.

Start with Email Routing. Move to Zoho when sending matters. Do not buy Workspace on day one.

### Why three addresses and not one

`social@` exists so that a platform breach, a shared login, or a phone handed to a staff member
never touches the address that can reset the domain. `admin@` should be logged into perhaps twice a
year. This separation costs nothing and is the single cheapest security decision available.

---

## Security, in the order that matters

**1. A password manager, on day one.** Bitwarden free tier, or iCloud Keychain if the client is
fully on iPhone. Every password generated, none reused, none written in a WhatsApp note to self.

**2. Two-factor on every account.** Use an authenticator app (Google Authenticator, Authy), not SMS.
SMS 2FA is defeated by SIM swap, which is a real and common attack on phone-number-centric
businesses in the region.

**3. Print the recovery codes.** Every platform issues backup codes when 2FA is enabled. Print them,
put them somewhere physical, and do not photograph them. This is the thing that gets skipped and it
is the thing that saves the account.

**4. The WhatsApp Business number gets its own PIN.** WhatsApp → Settings → Account → Two-step
verification. Without it, anyone who ports or clones the SIM has the business. This number is the
entire sales channel. Treat it like the till.

---

## Ownership and access, stated plainly

| Account | Owner | Insiible Consulting's role |
|---|---|---|
| Domain + Cloudflare | Client | Invited as member, removable |
| Google account / Sheets | Client | Editor on specific files, not the account |
| Facebook Page | Client's personal profile, as Page admin | Added as admin via Business Suite |
| Instagram | Registered on `social@` | Added via Business Suite, not by password sharing |
| TikTok | Registered on `social@` | Shared login until TikTok's team access is available |
| WhatsApp Business | Client's phone, client's number | No access, ever |

**Never share an Instagram password to grant access.** Meta Business Suite exists for exactly this.
Password sharing means the client cannot revoke access without a reset, and it breaks 2FA.

---

## Setup order (do not shuffle this)

1. Domain confirmed and on Cloudflare.
2. Email Routing live, all three addresses forwarding, test each one.
3. Password manager installed, root Google account created on `admin@`, 2FA enabled, codes printed.
4. WhatsApp Business installed on the client's phone with two-step verification set.
5. **Facebook Page created before Instagram.** Instagram's business features, scheduling and the
   WhatsApp contact button all run through the Page. Creating Instagram first and connecting later
   works but is fiddly and often has to be redone.
6. Instagram professional account on `social@`, connected to the Page.
7. TikTok Business account on `social@`.
8. Handles claimed everywhere at once, even on platforms not being used yet.

### Handles

Claim the same handle on Instagram, TikTok, Facebook, Pinterest and X in one sitting, even where
there is no plan to post. It is free and it stops someone else holding the name.

Preference order:

1. `@maisonnunu` (check availability first, it is short and matches the domain)
2. `@maisonnunu.cm`
3. `@maison.nunu`

Avoid underscores and digits. They get misheard, mistyped, and look like a copy of a real account.

---

## Before handover

- [ ] Client has logged into every account personally, at least once, from their own phone
- [ ] Client holds the password manager master password. Nobody else does
- [ ] Recovery codes printed and physically stored
- [ ] A written list of every account, its login email, and who has access
- [ ] Insiible Consulting's access is all revocable through a settings screen, with nothing
      depending on a shared password
