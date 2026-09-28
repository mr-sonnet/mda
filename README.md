# Memphis Dawah Association website

Whitehaven Kulliye's multi-page website for Memphis Dawah Association. The site uses HTML, CSS, and JavaScript. Its contact and volunteer forms use PHP, PHPMailer, and Google Workspace SMTP.

## Local preview

Open `index.html` in a browser or serve the folder with a local static server. Form delivery requires PHP, PHPMailer, and an SMTP configuration on the server.

## Key files

- `index.html`: homepage
- Root-level `.html` files: content pages
- `site.js`: shared navigation and footer
- `app.js`: interactive features, including the homepage slider
- `styles.css`: site styling and responsive layouts
- `assets/`: brand assets and site photography
- `contact-handler.php`: contact and volunteer form processing

## Deployment

The site is designed for Hostinger's PHP/HTML hosting. See the [Hostinger deployment guide](outputs/hostinger-deployment-guide.md) for installation, SMTP setup, testing, and rollback steps.

The real `.smtp-config.php` contains a mail credential and must stay off GitHub. Copy `.smtp-config.php.example` on the server and use a Google Workspace app password. Install PHPMailer using `composer install --no-dev --optimize-autoloader` or follow the alternative in the deployment guide.
