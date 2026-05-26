# GitHub Secrets Setup Guide

## Required Secrets for Email Notifications

Go to your GitHub repository:
Settings → Secrets and variables → Actions → New repository secret

Add these 3 secrets:

### Secret 1: NOTIFY_EMAIL
Name: NOTIFY_EMAIL
Value: your-personal-email@gmail.com
Purpose: The email address that receives all PR notifications

### Secret 2: EMAIL_USERNAME
Name: EMAIL_USERNAME
Value: your-sender-gmail@gmail.com
Purpose: Gmail account used to send notification emails

### Secret 3: EMAIL_APP_PASSWORD
Name: EMAIL_APP_PASSWORD
Value: xxxx xxxx xxxx xxxx
Purpose: Gmail App Password (NOT your regular password)

---

## How to Get Gmail App Password

1. Go to your Google Account: myaccount.google.com
2. Click Security in the left sidebar
3. Under "How you sign in to Google" enable 2-Step Verification
4. Go back to Security
5. Search for "App passwords" or go to:
   myaccount.google.com/apppasswords
6. Select app: Mail
7. Select device: Other → type "GitHub Actions"
8. Click Generate
9. Copy the 16-character password shown
10. Paste it as your EMAIL_APP_PASSWORD secret

---

## Email Notifications You Will Receive

| Event | Email Subject |
|-------|--------------|
| New PR opened | 🆕 New PR: [title] |
| Copilot review done | 🤖 Copilot Review: [title] |
| PR merged | ✅ PR Merged: [title] |
| PR closed without merge | ❌ PR Closed: [title] |

---

## Verification

After adding secrets, create a test PR.
You should receive an email within 1-2 minutes.

If no email arrives:
1. Check GitHub Actions tab for workflow errors
2. Check spam/junk folder
3. Verify Gmail App Password is correct
4. Ensure 2-Step Verification is enabled on Gmail
