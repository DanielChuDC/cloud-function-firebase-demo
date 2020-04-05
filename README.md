# cloud-function-firebase-demo
This repo will use cloud function for firebase to do a demo

Call functions via HTTP requests

Call functions via HTTP requests using Cloud Function with Firebase

# Prerequisites
1. Install firebase cli to run this project and deploy to firebase.
- Run `sudo npm install -g firebase-tools` to install firebase cli

2. Run `firebase login` if you haven't login using firebase

3. Run `firebase init` for the project you link to firebase

4. You are good to go to deploy the project
- Run `firebase deploy` to deploy this project to firebase function


# How to run the project
- Download the zip file and 
- Navigate to `functions` folder by using `cd functions`
- Run `npm install` to install all the packages

### Set the environment variavle
```
firebase functions:config:set gmail.email="<your email>" gmail.password='<your gmail password>'
```
- To send the mail, you need to pass in the config by the command above
- Your email and your password 

### Deploy yhr firebase function
- Run `firebase deploy` to deploy the whole function
- You may specifc to deploy certain function if you wish to only create/update the function
- Run `firebase deploy --only functions:helloWorld` to deploy specifc function, <helloWorld> is the example of the name of the function


# NodeMailer
https://support.google.com/accounts/answer/185833
Using App Password

When to use App Passwords

To help keep your account secure, use "Sign in with Google" to connect apps to your Google Account. If the app you’re using doesn’t offer this option, you can either:

    Use App Passwords to connect to your Google Account
    Switch to a more secure app

### Add in feature
- Send the cluster info as attachment

https://nodemailer.com/message/attachments/


# Cloud function for RTDB 
### Validate the use case scenario to prevent wrong sending email

```js
// Only edit data when it is first created.
      if (change.before.exists()) {
        return null;
      }
      // Exit when the data is deleted.
      if (!change.after.exists()) {
        return null;
      }
```

### Use this to remove whitespace and make it become oneline
http://removelinebreaks.net/




