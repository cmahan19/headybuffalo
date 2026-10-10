# Hosting and costs: running Heady Buffalo for as close to $0 as possible

Checked on 2026-10-10 against each provider's own pages.

## The short answer

**Host on AWS Amplify.** For a small shop it's free at first, then likely pennies to a few dollars a month, and it
allows selling.

| Option | Monthly cost | Can a store use it? | Why / why not |
| --- | --- | --- | --- |
| **AWS Amplify** ✅ | $0 with new-account credits; afterwards pay-per-use (typically under a few $ at small-shop traffic) | Yes | Runs everything this site needs (checkout, contact form, admin login). No shutdown risk. |
| Netlify Free | $0 | Yes | Hard cap of 300 credits a month (each deploy costs 15, bandwidth 20 per GB). Its terms say free projects "may be shut down without notice for any reason." Fine as a backup. |
| Vercel Hobby | $0 | **No** | Vercel's fair-use rules: "Hobby teams are restricted to non-commercial personal use only," and they list "any method of requesting or processing payment" as commercial. A store needs Pro at **$20/month**. |
| Cloudflare Workers Free | $0 | Yes | 10 ms CPU limit per request is too small for this app, and the contact-form email code can't run there. |
| Plain S3 | ~$0 | No | S3 only serves static files. Checkout, email, and admin would all break. |

### AWS Amplify pricing (from aws.amazon.com/amplify/pricing)
- New accounts (since July 15, 2025): up to **$200 in credits**, usable for 6–12 months.
- Monthly free allowance: **1,000 build minutes, 5 GB stored, 15 GB served, 500,000 server requests,
  100 GB-hours of server time.**
- Beyond that: $0.01 per build minute, $0.15 per GB served, $0.30 per million requests, $0.20 per GB-hour.
- A small shop with a few thousand visits a month typically stays inside or near those numbers. **Set a $5 AWS
  Budget alert** so you're emailed before anything costs money.
- Avoid the optional Web Application Firewall add-on ($15/month). You don't need it to start.

## Costs you can't avoid

| Item | Cost | Notes |
| --- | --- | --- |
| Domain (headybuffalo.com) | ~$10–20/year | **It currently doesn't resolve.** Renew it or fix its DNS at your registrar first. |
| Stripe | $0/month; 2.9% + 30¢ per card sale (US standard) | Check your exact rate in the Stripe Dashboard. Only paid when you sell. Payment Links are free too. |

## Free everything else
- **Email for the contact form:** Gmail with an app password (already supported via `EMAIL_USER` / `EMAIL_PASS`).
- **Payment links for made-to-order quotes:** Stripe Payment Links, free to create, normal card fee when paid.
- **Product photos:** your phone, a window, and a white poster board.
- **Admin database (only if you want to save admin approvals online):** Supabase or Neon free tiers. Optional:
  products are managed in `src/data/handmade-products.ts`, which needs no database.

## Deploying to AWS Amplify (about 20 minutes)

1. Put the code on GitHub (private repo is fine).
2. AWS Console → **Amplify** → *Create new app* → *GitHub* → pick the repo and the `main` branch.
   Amplify detects Next.js and uses the included `amplify.yml`.
3. **Environment variables** (Amplify → App settings → Environment variables):
   - `NEXT_PUBLIC_SITE_URL` = `https://headybuffalo.com`
   - `STRIPE_SECRET_KEY` (use a **test** key first), `STRIPE_WEBHOOK_SECRET`
   - `EMAIL_USER`, `EMAIL_PASS` (Gmail app password), `CONTACT_TO_EMAIL`
   - Optional admin: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
4. Deploy, open the `amplifyapp.com` preview URL, and test: request a product, send a contact message, open the cart.
5. **Custom domain:** Amplify → *Domain management* → add `headybuffalo.com` and follow the DNS steps (free SSL).
6. **Stripe webhook:** Stripe Dashboard → Developers → Webhooks → add `https://headybuffalo.com/api/stripe/webhook`
   and copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
7. **Budget alert:** AWS Billing → Budgets → *Create budget* → monthly cost budget of **$5** with email alerts.

### Known limits on serverless hosting
- The private admin's approval buttons save to a file, and serverless hosts don't keep files. The pages load but
  changes won't persist until a database is connected. Products are managed in code, so the shop is unaffected.
- After changing environment variables or product data, redeploy (automatic on every push to GitHub).
