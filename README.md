# Mail

This project implements a single-page email client using Django, HTML, JavaScript, and CSS. The client provides functionalities such as composing and sending emails, viewing inbox, sent, and archived emails, replying to emails, and archiving/unarchiving emails.

[Demonstration video](https://youtu.be/ugjDpPIMPg0?si=FzyJqOnNtZiiPhv-)


## Installation

#### Clone repository
```
  git clone https://github.com/OmarSwailam/mail.git
```

#### Create a virtualenv(optional)
```
  python3 -m venv venv
```

#### Activate the virtualenv
```
  .venv/scripts/activate
```
#### Install all dependencies
```
   pip install -r requirements.txt
```
#### Migrate DB changes
```
  python manage.py migrate
```
#### Run application
```
  python manage.py runserver
```

## Usage
* Register for a new account using the "Register" link.
* Sign in with your registered credentials.
*  Upon signing in, you will be directed to the Inbox page.
* Use the navigation buttons to switch between Inbox, Sent, and Archived mailboxes.
* Click the "Compose" button to compose a new email. Fill in the recipient, subject, and body fields, then click "Send" to send the email.
* Click on an email in the Inbox to view its details. You can also reply to the email from this view.
* Archive or unarchive emails from the Inbox view by clicking the respective buttons.
* Emails in the Sent mailbox cannot be archived or unarchived.
* The application provides an API for fetching, sending, and updating emails, facilitating seamless integration with JavaScript.

### API Routes
* GET /emails/str:mailbox: Retrieves a list of emails in the specified mailbox.
* GET /emails/int:email_id: Retrieves details of a specific email by its ID.
* POST /emails: Sends an email with specified recipients, subject, and body.
* PUT /emails/int:email_id: Updates the read/unread or archived/unarchived status of an email.

Author: Omar Swailam