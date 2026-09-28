# Hostinger website + Google Workspace email deployment guide

## Before replacing WordPress

Do not delete the current WordPress installation before creating and downloading a complete backup.

1. In Hostinger hPanel, create/download a backup of the current website files.
2. Export or download the WordPress database backup as well.
3. Confirm both backups can be found on your computer.
4. If possible, first test this website on a Hostinger staging subdomain or temporary domain.

The database is not needed by the new static/PHP website, but keep it until the replacement has been tested and approved.

## Replace the main website

1. Open **Websites > Dashboard > File Manager** for the correct domain.
2. Open that domain's `public_html` folder.
3. Archive/download the old WordPress files if you have not already done so.
4. Move the WordPress files out of `public_html` or remove them only after the backup is safely downloaded. This includes `index.php`, `.htaccess`, `wp-admin`, `wp-content`, `wp-includes`, and the other WordPress files.
5. Upload `memphis-dawah-complete-content-site.zip` into `public_html`.
6. Extract the archive inside `public_html`.
7. Confirm that `index.html`, `contact-handler.php`, `styles.css`, `site.js`, `app.js`, the other HTML pages, and the `assets` folder are directly inside `public_html`, not inside another nested folder.
8. Open the domain in a private/incognito window and test navigation, mobile layout, donation links, both forms, and several interior pages.

## Configure Google Workspace email delivery

- Both the contact and volunteer forms submit to `contact-handler.php`.
- Messages are addressed to `admin@whitehavenkulliye.org`.
- Hostinger runs the website and PHP only. Do not create duplicate `admin@` or `website@` mailboxes in Hostinger, and do not change the domain's Google MX records.
- Confirm `admin@whitehavenkulliye.org` receives mail in Google Workspace.
- Confirm `website@whitehavenkulliye.org` is an actual Google Workspace user that can sign in to Gmail. If it is only an alias or Google Group, authenticate with a real Workspace user instead or configure Google Workspace SMTP relay.
- Turn on 2-Step Verification for the `website@whitehavenkulliye.org` Google account.
- While signed in as that user, create a Google App Password for the website form. Use the generated 16-character App Password in the configuration; never use the account's normal sign-in password.
- In Hostinger SSH, open the domain's `public_html` directory and run `composer2 install --no-dev --optimize-autoloader`. This installs PHPMailer from the included `composer.json`.
- Copy `.smtp-config.php.example` to `.smtp-config.php` in File Manager.
- Edit `.smtp-config.php` in Hostinger and replace `REPLACE_WITH_GOOGLE_APP_PASSWORD` with the Google App Password. Leave the server as `smtp.gmail.com` and port as `587`.
- Form notifications will be sent from `website@whitehavenkulliye.org` to `admin@whitehavenkulliye.org`; replies will go to the visitor through the message's Reply-To header.
- The included `.htaccess` blocks web access to the completed SMTP configuration file and disables folder listings.
- Submit one contact message and one volunteer message from the live domain. Check the inbox and spam folder.
- If your hosting plan does not provide SSH/Composer, download PHPMailer from its official GitHub repository and upload the extracted `PHPMailer` folder to `public_html`. The handler also recognizes `public_html/PHPMailer/src/PHPMailer.php` and its companion files.

## Important rollback precaution

Keep the WordPress file and database backups until the new site has operated successfully for several days. If something critical is missing, the old installation can then be restored.

Official references:

- https://www.hostinger.com/support/how-to-upload-a-website-from-backups/
- https://www.hostinger.com/support/9653397-how-to-back-up-a-wordpress-website-in-hostinger/
- https://www.hostinger.com/in/tutorials/how-to-send-emails-using-phpmailer
- https://support.google.com/a/answer/176600
- https://support.google.com/accounts/answer/185833
