# Managing the catalogue

For whoever runs the shop. No technical knowledge needed — if you can use a
web form, you can use this.

---

## Signing in

Go to **`/admin/login`** on the website (for example
`https://yoursite.com/admin/login`) and enter the username and password you
were given.

You stay signed in for **8 hours**, then it asks again. That is normal, not an
error.

If you get **"Too many sign-in attempts"**, wait the number of seconds it tells
you. This protects the shop from someone guessing the password — it is not a
fault.

> **There is no "forgot password" link.** Resetting the password needs whoever
> maintains the site. Keep it somewhere safe.

---

## The product list

Everything lives on one page: **Products**.

- **Search** filters as you type — by name, SKU or category.
- Products with no price set show **"On request"**. That is intentional.
- Each row has two switches and a delete button.

### Visible / Hidden

**This is the switch you will use most.**

Turning a product to **Hidden** removes it from the website immediately — the
shop page, the home page, and search engines. Customers cannot reach it even
with a direct link.

Nothing is lost. It stays in your list, greyed out, and switching it back to
**Visible** puts it straight back on the site. Use this for products you have
stopped stocking, seasonal items, or anything you are still writing.

### In stock / Out of stock

The product **stays on the website** but is clearly marked "Out of Stock", and
customers cannot add it to an inquiry. Use it for something you sell but
happen not to have right now.

The difference in one line:

| | Shows on the site? | Can be added to an inquiry? |
| --- | --- | --- |
| **Hidden** | No | No |
| **Out of stock** | Yes, marked | No |

### Delete permanently

Removes the product completely. **There is no undo.** It asks you to confirm
first.

Almost every time, **Hidden is what you actually want.** Only delete something
added by mistake, like a duplicate.

---

## Adding or editing a product

Press **Add Product**, or the edit button on a row.

Only **Name** is required. Everything else can be filled in later.

| Field | What it does | Tips |
| --- | --- | --- |
| **Name** | The product title | The one thing customers search for. Include the size — "Adson Tissue Forceps 12cm" beats "Forceps" |
| **Category** | Which section it appears under | Pick from the list |
| **SKU** | Your product code | Appears on the card **and in the WhatsApp message**, so you know exactly what a customer means |
| **Price** | Shown on the card | **Leave blank for "on request".** Blank is not zero — zero would display as free |
| **Summary** | One line, shown on the card in the grid | Keep it short. The most useful detail — material, size, pack quantity |
| **Description** | The full text on the product page | Longer. What it is used for, what it is made of |
| **Unit** | How it is sold | "Per piece", "Box of 100" |
| **Image URL** | A photo | See below |
| **Artwork** | A drawing used when there is no photo | Pick the closest shape, or "None (generic box)" |

And three checkboxes:

- **Visible on the website** — same as the switch in the list
- **In stock** — same as the switch in the list
- **Featured on the home page** — puts it in the row of highlighted products.
  Use it for your best sellers; if you tick everything, nothing stands out

Press **Add product** / **Save changes**. The website updates **immediately** —
no waiting, no publish step. Refresh the shop page and it is there.

### About photos

**You cannot upload a photo from your computer yet.** This has not been built.

The Image URL box needs a *web address* of an image that already exists online
— something ending in `.jpg` or `.png`. If you leave it blank, the product
shows a clean line drawing instead, which looks perfectly good.

If uploading photos matters to you, tell whoever maintains the site — it needs
a piece of setup that is not there yet.

---

## What customers see

There is **no checkout and no online payment**. Nobody can buy from the site,
and no card details are ever involved.

Instead, a customer adds products to an **inquiry list**, presses one button,
and **WhatsApp opens on their phone** with the list already written out and
addressed to you. They press send; you reply with pricing and availability.

So: **an inquiry arriving on WhatsApp is the website working correctly.** The
message deliberately does **not** include prices, even where you have set them
— it is a request, not a quote, which leaves you free to quote per customer.

---

## If something looks wrong

**The shop page says the catalogue is unavailable.**
The website is fine; the part that stores products is not responding. This is
not something you can fix from the admin panel — contact whoever maintains the
site. Customers still see your phone number and WhatsApp button, so you are
not losing enquiries.

**I changed something and it has not appeared.**
Changes are instant. Refresh the page (Ctrl+R, or Cmd+R on a Mac). If it is
still wrong, check you pressed Save, and that the product is **Visible**.

**A product vanished from the website.**
Almost always the Visible switch. Find it in your list — hidden ones are still
there, greyed out.

**It logged me out.**
Sessions last 8 hours. Sign in again.
