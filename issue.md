# Issue 1
```js
There was an error while sending the email: { Error: Invalid login: 534-5.7.9 Application-specific password required. Learn more at
534 5.7.9  https://support.google.com/mail/?p=InvalidSecondFactor l3sm10169213ioj.7 - gsmtp
    at SMTPConnection._formatError (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:781:19)
    at SMTPConnection._actionAUTHComplete (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:1516:34)
    at SMTPConnection._responseActions.push.str (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:554:26)
    at SMTPConnection._processResponse (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:940:20)
    at SMTPConnection._onData (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:746:14)
    at TLSSocket.SMTPConnection._onSocketData (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:189:46)
    at emitOne (events.js:116:13)
    at TLSSocket.emit (events.js:211:7)
    at addChunk (_stream_readable.js:263:12)
    at readableAddChunk (_stream_readable.js:250:11)
  code: 'EAUTH',
  response: '534-5.7.9 Application-specific password required. Learn more at\n534 5.7.9  https://support.google.com/mail/?p=InvalidSecondFactor l3sm10169213ioj.7 - gsmtp',
  responseCode: 534,
  command: 'AUTH PLAIN' }
```

### Solution:
- Use in-app password


# Issue 2

```js
There was an error while sending the email: { Error: No recipients defined
    at SMTPConnection._formatError (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:781:19)
    at SMTPConnection._setEnvelope (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:993:34)
    at SMTPConnection.send (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:619:14)
    at sendMessage (/srv/node_modules/nodemailer/lib/smtp-transport/index.js:227:28)
    at connection.login.err (/srv/node_modules/nodemailer/lib/smtp-transport/index.js:285:25)
    at SMTPConnection._actionAUTHComplete (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:1530:9)
    at SMTPConnection._responseActions.push.str (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:554:26)
    at SMTPConnection._processResponse (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:940:20)
    at SMTPConnection._onData (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:746:14)
    at TLSSocket.SMTPConnection._onSocketData (/srv/node_modules/nodemailer/lib/smtp-connection/index.js:189:46) code: 'EENVELOPE', command: 'API' }
```

### Solution:
-
Read more from
https://stackoverflow.com/questions/44816844/firebase-cloud-function-database-snapshot

```js
 const uids = [];

 snapShot.forEach(single => {
    uids.push(single.key);
 });
```

The answer above can be use but can access the email though here
```js
  const clusterInfo = snapshot.val();
  // Access the email 
  clusterInfo.custEmail
```


