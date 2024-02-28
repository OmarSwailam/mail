document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', sendEmail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose-recipients').readOnly = false;
  document.querySelector('#compose-subject').readOnly = false;
  document.querySelector('#compose-body').readOnly = false;

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 id="mailbox">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {

        let newEmailDiv = document.createElement('div');
        newEmailDiv.className = email['read'] ? "read" : "unread"
        newBadge = document.createElement('span');
        newBadge.innerHTML = "New"
        newBadge.className = "badge"

        newEmailDiv.classList.add('custom-card')

        newEmailDiv.innerHTML = `
          <p>From: ${email['sender']}</p>
          <h5>${email['subject']}</h5>
          <p>At: ${email['timestamp']}</p>
        `
        if (newEmailDiv.classList.contains("unread")) {
          newEmailDiv.append(newBadge)
        }
        newEmailDiv.addEventListener('click', () => viewEmail(email.id));

        document.querySelector('#emails-view').append(newEmailDiv);
      });

    })

}


function viewEmail(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      const sent = document.querySelector('#mailbox').innerHTML
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      const emailView = document.querySelector('#email-view')
      emailView.style.display = 'block';
      emailView.className = "email-card"
      emailView.innerHTML = `
        <p><strong>From: </strong> ${email['sender']}</p>
        <p><strong>To: </strong> ${email['sender']}</p>
        <p><strong>Subject: </strong>${email['subject']}</p>
        <p><strong>Time: </strong> ${email['timestamp']}</p><hr>
        <span>${email['body']}</span><br>
        <button id="replay" class="btn btn-outline-dark replay">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
            <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"/>
          </svg>
          Replay
        </button>
        <button id="archive" class="btn btn-outline-dark archive">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
      `

      if (!email.read) {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
      }

      const archiveButton = document.querySelector('#archive')
      archiveButton.style.display = (sent == 'Sent') ? 'none' : 'block'
      archiveButton.innerHTML += email.archived ? "Unarchive" : "Archive"
      archiveButton.addEventListener('click', () => archive(email))

      document.querySelector('#replay').addEventListener('click', () => {
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-recipients').readOnly = true;
        let subject = email.subject
        if (subject.split(' ', 1)[0] != 'Re:') {
          subject = 'Re: ' + email.subject;
        }
        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-subject').readOnly = true;
        document.querySelector('#compose-body').value = `'''on ${email.timestamp} ${email.sender} wrote: ${email.body}'''`;
      })


    });
}

function archive(email) {


  if (email.archived) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
      .then(() => viewEmail(email.id))

  } else if (!email.archived) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
      .then(() => viewEmail(email.id))
  }
}

function sendEmail(event) {
  event.preventDefault()
  recipients = document.querySelector('#compose-recipients').value;
  subject = document.querySelector('#compose-subject').value;
  body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('One of the emails doesn\'t exist')
    })
    .then(result => {
      const alert = document.createElement('div')
      alert.classList.add("alert")
      alert.classList.add("alert-succuss")
      alert.innerHTML = `${result} success`
      document.querySelector('#emails-view').prepend(alert);
      load_mailbox('sent');
    })
    .catch(error => {
      const alert = document.createElement('div')
      alert.classList.add("alert")
      alert.classList.add("alert-danger")
      alert.innerHTML = error
      document.querySelector('#compose-view').prepend(alert);
    })

}