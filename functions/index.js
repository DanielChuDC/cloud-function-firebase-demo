'use strict';

const functions = require('firebase-functions');

// For send Firebase Cloud Messaging
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/*
* Using nodemailer to send mail
* Send mail using gmail account
*/
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


/*

* Using CORS Express middleware
*
*

*/

// [END functionsimport]
// [START additionalimports]
// Moments library to format dates.
const moment = require('moment');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true,
});
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cors);
// [END additionalimports]


// [START all]
/**
 * Returns the server's date. You must provide a 'format' URL query parameter or format` value in
 * the request body with which we'll try to format the date.
 *
 * Format must follow the Node moment library. See: http://momentjs.com/
 *
 * Example format: "MMMM Do YYYY, h:mm:ss a".
 * Example request using URL query parameters:
 *   https://us-central1-<project-id>.cloudfunctions.net/date?format=MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a
 * Example request using request body with cURL:
 *   curl -H 'Content-Type: application/json' /
 *        -d '{"format": "MMMM Do YYYY, h:mm:ss a"}' /
 *        https://us-central1-<project-id>.cloudfunctions.net/date
 *
 * This endpoint supports CORS.
 */

// [START trigger]
exports.date = functions.https.onRequest((req, res) => {
  // [END trigger]
  // [START sendError]
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  // [END sendError]

  // [START usingMiddleware]
  // Enable CORS using the `cors` express middleware.
  return cors(req, res, () => {
    // [END usingMiddleware]
    // Reading date format from URL query parameter.
    // [START readQueryParam]
    let format = req.query.format;
    // [END readQueryParam]
    // Reading date format from request body query parameter
    if (!format) {
      // [START readBodyParam]
      format = req.body.format;
      // [END readBodyParam]
    }
    // [START sendResponse]
    const formattedDate = moment().format(format);
    console.log('Sending Formatted date:', formattedDate);
    res.status(200).send(formattedDate);
    // [END sendResponse]
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// Testing Purpose
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

/* Using this function to insert Data
 * Using database snapshot to observe the action
 * Based on the path custOrder/{completeStatus}/{email}/{createDateTime}/{clusterInfo}

 * https://medium.com/codingthesmartway-com-blog/introduction-to-firebase-cloud-functions-c220613f0ef
 * To enable the password authentication
 *
*/

var users = {
  'username': 'admin@gmail.com',
  'password': 'The-authentication-is-not-easier-than-a-piece-of-cake-Do-you-know-that-@#$@#$@#$@#$@#$',

};


app.post('/', (req, res) => { // Ensure the variable are here.

  if (req.body.username !== users.username && req.body.password !== users.password) {
    return res.sendStatus(403).send('forbidden')
  }
  else {
    const formattedDate = moment();

    // Insert the data base on the path
    if (req.body.approveStatus !== null
      && req.body.email !== null
      && req.body.cluster !== null) {
      // replace the dot in email
      // because firebase path cannot have .
      // Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"

      // Write the data into db
      admin.database().ref('/custOrder' + '/'
        + 'clusterInfo').push({
          // ClusterInfo insert here
          // ClusterInfo insert here
          custEmail: req.body.email,
          custId: req.body._id,
          status: req.body.status,
          cluster: req.body.cluster,
          creationDate: req.body.creationDate,
          approveDate: req.body.approveDate,
          approveStatus: req.body.approveStatus,
          processingDate: req.body.processingDate,
          processingStatus: req.body.processingStatus,
          completedDate: req.body.completedDate,
          completedStatus: req.body.completedStatus
        }).then(snapshot => {
          // Return response 303 with database inserted data
          return res.status(200).send(snapshot.ref);
        }).catch(error => { return res.status(422).send(error); });
    }
  }
});
exports.InsertDB = functions.https.onRequest(app);

// Keyword Async is needed to solve (  92:13  error  Parsing error: Unexpected token mailTransport)
//   56:5   error  Expected catch() or return                  promise/catch-or-return
// 63: 15  error  Each then() should return a value or throw promise / always -return

// That looks like an error from some sort of lint program, not from the actual Javascript interpreter. If that's the case, then you can probably make the linter happy with this:
exports.sendMail = functions.database.ref('/custOrder/clusterInfo/{pushId}').onWrite(async (change, context) => {

  const snapshot = change.after;
  const clusterInfo = snapshot.val();
  const uids = [];
  var recipentContent = '';

  // Only edit data when it is first created.
  if (change.before.exists()) {
    return null;
  }
  // Exit when the data is deleted.
  if (!change.after.exists()) {
    return null;
  }

  console.log('Uppercasing', context.params.pushId, clusterInfo);
  if (clusterInfo.custEmail) {
    console.log(clusterInfo.custEmail);

  }

  // Use for in to access the object
  for (var key$ in clusterInfo) {
    if (clusterInfo.hasOwnProperty(key$)) {
      // console.log(`clusterInfo.${key$} = ${clusterInfo[key$]}`);
      if (`clusterInfo.${key$}=== 'CustEmail'`) {
        recipentContent += `clusterInfo.${key$}` +
          ' : ' + `${clusterInfo[key$]}` + ' <br> ';
      }
    }
  }

  if (clusterInfo && !clusterInfo.sanitized) {
    // Send mail from here
    const mailOptions = {
      from: 'admin@gmail.com', // no use, will be overwritten by google backend server for your own email
      to: clusterInfo.custEmail,
    };
    const subscribed = clusterInfo;

    // Building Email message.
    mailOptions.subject = 'Thanks for using our services';
    mailOptions.text = subscribed ?
      'Thanks you for using our services to create cluster. You will receive our the credentials of the cluster in the next email. '
      +
      '<br />'
      +
      clusterInfo :
      'I hereby confirm that I will stop sending you the newsletter.';
    // html
    mailOptions.html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html> <head> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta name="x-apple-disable-message-reformatting" /> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title></title> <style type="text/css" rel="stylesheet" media="all"> /* Base ------------------------------ */ @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap"); body { width: 100% !important; height: 100%; margin: 0; -webkit-text-size-adjust: none; } a { color: #3869D4; } a img { border: none; } td { word-break: break-word; } .preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; } /* Type ------------------------------ */ body, td, th { font-family: "Nunito Sans", Helvetica, Arial, sans-serif; } h1 { margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left; } h2 { margin-top: 0; color: #333333; font-size: 16px; font-weight: bold; text-align: left; } h3 { margin-top: 0; color: #333333; font-size: 14px; font-weight: bold; text-align: left; } td, th { font-size: 16px; } p, ul, ol, blockquote { margin: .4em 0 1.1875em; font-size: 16px; line-height: 1.625; } p.sub { font-size: 13px; } /* Utilities ------------------------------ */ .align-right { text-align: right; } .align-left { text-align: left; } .align-center { text-align: center; } /* Buttons ------------------------------ */ .button { background-color: #3869D4; border-top: 10px solid #3869D4; border-right: 18px solid #3869D4; border-bottom: 10px solid #3869D4; border-left: 18px solid #3869D4; display: inline-block; color: #FFF; text-decoration: none; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); -webkit-text-size-adjust: none; box-sizing: border-box; } .button--green { background-color: #22BC66; border-top: 10px solid #22BC66; border-right: 18px solid #22BC66; border-bottom: 10px solid #22BC66; border-left: 18px solid #22BC66; } .button--red { background-color: #FF6136; border-top: 10px solid #FF6136; border-right: 18px solid #FF6136; border-bottom: 10px solid #FF6136; border-left: 18px solid #FF6136; } @media only screen and (max-width: 500px) { .button { width: 100% !important; text-align: center !important; } } /* Attribute list ------------------------------ */ .attributes { margin: 0 0 21px; } .attributes_content { background-color: #F4F4F7; padding: 16px; } .attributes_item { padding: 0; } /* Related Items ------------------------------ */ .related { width: 100%; margin: 0; padding: 25px 0 0 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; } .related_item { padding: 10px 0; color: #CBCCCF; font-size: 15px; line-height: 18px; } .related_item-title { display: block; margin: .5em 0 0; } .related_item-thumb { display: block; padding-bottom: 10px; } .related_heading { border-top: 1px solid #CBCCCF; text-align: center; padding: 25px 0 10px; } /* Discount Code ------------------------------ */ .discount { width: 100%; margin: 0; padding: 24px; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7; border: 2px dashed #CBCCCF; } .discount_heading { text-align: center; } .discount_body { text-align: center; font-size: 15px; } /* Social Icons ------------------------------ */ .social { width: auto; } .social td { padding: 0; width: auto; } .social_icon { height: 20px; margin: 0 8px 10px 8px; padding: 0; } /* Data table ------------------------------ */ .purchase { width: 100%; margin: 0; padding: 35px 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; } .purchase_content { width: 100%; margin: 0; padding: 25px 0 0 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; } .purchase_item { padding: 10px 0; color: #51545E; font-size: 15px; line-height: 18px; } .purchase_heading { padding-bottom: 8px; border-bottom: 1px solid #EAEAEC; } .purchase_heading p { margin: 0; color: #85878E; font-size: 12px; } .purchase_footer { padding-top: 15px; border-top: 1px solid #EAEAEC; } .purchase_total { margin: 0; text-align: right; font-weight: bold; color: #333333; } .purchase_total--label { padding: 0 15px 0 0; } body { background-color: #F4F4F7; color: #51545E; } p { color: #51545E; } p.sub { color: #6B6E76; } .email-wrapper { width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7; } .email-content { width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; } /* Masthead ----------------------- */ .email-masthead { padding: 25px 0; text-align: center; } .email-masthead_logo { width: 94px; } .email-masthead_name { font-size: 16px; font-weight: bold; color: #A8AAAF; text-decoration: none; text-shadow: 0 1px 0 white; } /* Body ------------------------------ */ .email-body { width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF; } .email-body_inner { width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF; } .email-footer { width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; } .email-footer p { color: #6B6E76; } .body-action { width: 100%; margin: 30px auto; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; } .body-sub { margin-top: 25px; padding-top: 25px; border-top: 1px solid #EAEAEC; } .content-cell { padding: 35px; } /*Media Queries ------------------------------ */ @media only screen and (max-width: 600px) { .email-body_inner, .email-footer { width: 100% !important; } } @media (prefers-color-scheme: dark) { body, .email-body, .email-body_inner, .email-content, .email-wrapper, .email-masthead, .email-footer { background-color: #333333 !important; color: #FFF !important; } p, ul, ol, blockquote, h1, h2, h3 { color: #FFF !important; } .attributes_content, .discount { background-color: #222 !important; } .email-masthead_name { text-shadow: none !important; } } </style> <!--[if mso]> <style type="text/css"> .f-fallback  { font-family: Arial, sans-serif; } </style> <![endif]--> </head>`
      + `<body> <span class="preheader">This is a receipt for your recent purchase on `
      + clusterInfo.approveDate
      + `. No payment is due with this receipt.</span> <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation"> <tr> <td align="center"> <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation"> <tr> <td class="email-masthead"> <a href="https://example.com" class="f-fallback email-masthead_name"> Kubernetes Cluster </a> </td> </tr> <!-- Email Body --> <tr> <td class="email-body" width="100%" cellpadding="0" cellspacing="0"> <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"> <!-- Body content --> <tr> <td class="content-cell"> <div class="f-fallback"> `
      + `<h1>Hi, `
      + clusterInfo.custEmail
      + `</h1> <p>Thanks for using our Service. This email is the receipt for your purchase. No payment is due.</p> <p>This purchase will appear as “[Credit Card Statement Name]” on your credit card statement for your {{credit_card_brand}} ending in {{credit_card_last_four}}. Need to <a href="{{billing_url}}">update your payment information</a>?</p> <!-- Discount --> <table class="discount" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation"> <tr> <td align="center"> <h1 class="f-fallback discount_heading">10% off your next purchase!</h1> <p class="f-fallback discount_body">Thanks for your support! Here's a coupon for 10 % off your next purchase if used by { { expiration_date } }.</p > < !--Border based button https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design --> <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"> <tr> <td align="center"> <a href="http://example.com" class="f-fallback button button--green" target="_blank">Use this discount now...</a> </td> </tr> </table> </td> </tr> </table>`
      + `<table class="purchase" width="100%" cellpadding="0" cellspacing="0" role="presentation"> <tr> <td> <h3>`
      + clusterInfo.custEmail
      + `</h3></td> <td> <h3 class="align-right">`
      + clusterInfo.approveDate
      + `</h3></td> </tr> <tr> <td colspan="2"> <table class="purchase_content" width="100%" cellpadding="0" cellspacing="0"> <tr> <th class="purchase_heading" align="left"> <p class="f-fallback">Description</p> </th> <th class="purchase_heading" align="right"> <p class="f-fallback">Amount</p> </th> </tr>`
      + recipentContent
      + `<tr> <td width="80%" class="purchase_item"><span class="f-fallback">{{description}}</span></td> <td class="align-right" width="20%" class="purchase_item"><span class="f-fallback">{{amount}}</span></td> </tr> {{/each}} <tr> <td width="80%" class="purchase_footer" valign="middle"> <p class="f-fallback purchase_total purchase_total--label">Total</p> </td> <td width="20%" class="purchase_footer" valign="middle"> <p class="f-fallback purchase_total">{{total}}</p> </td> </tr> </table> </td> </tr> </table> <p>If you have any questions about this receipt, simply reply to this email or reach out to our <a href="{{support_url}}">support team</a> for help.</p> <p>Cheers, <br>The [Product Name] Team</p> <!-- Action --> <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation"> <tr> <td align="center"> <!-- Border based button https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design --> <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"> <tr> <td align="center"> <a href="{{action_url}}" class="f-fallback button button--blue" target="_blank">Download as PDF</a> </td> </tr> </table> </td> </tr> </table> <!-- Sub copy --> <table class="body-sub" role="presentation"> <tr> <td> <p class="f-fallback sub">Need a printable copy for your records?</strong> You can <a href="{{action_url}}">download a PDF version</a>.</p> <p class="f-fallback sub">Moved recently? Have a new credit card? You can easily <a href="{{billing_url}}">update your billing information</a>.</p> </td> </tr> </table> </div> </td> </tr> </table> </td> </tr> <tr> <td> <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"> <tr> <td class="content-cell" align="center"> <p class="f-fallback sub align-center">&copy; 2019 [Product Name]. All rights reserved.</p> <p class="f-fallback sub align-center"> [Company Name, LLC] <br>1234 Street Rd. <br>Suite 1234 </p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body> </html> `;
    // Non- useable

    // mailOptions.alternatives = [{
    //   // binary buffer as an attachment
    //   filename: 'receipt.html',
    //   content: recipentContent,
    //   contentType: 'text/html; charset=UTF-8'
    // }];
    try {
      await mailTransport.sendMail(mailOptions)
        .then(() => console.log('Welcome confirmation email sent'))
        .catch((error) => console.error('There was an error while sending the welcome email:', error));
      // console.log(`New ${subscribed ? '' : 'un'}subscription confirmation email sent to:`, "val.email");
    } catch (error) {
      console.error('There was an error while sending the email:', error);
    }
    // Update the Firebase DB with checked message.
    console.log('Message has been moderated. Saving to DB: ', clusterInfo.custEmail);
  }
  return null;
});


