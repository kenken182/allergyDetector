# allergyDetector
allergyDetect is a React Native iOS application that allows a user to take a photo of their meal, and will cross reference the meal's ingredients with the users list of allergies in order to determine if the user is allergic to the meal or not. This was created using Expo CLI, with a Express.js backend, and various Google APIs such as Firebase, and Google Cloud Vision API. Included is user-specific allergens, as well as sign up and login pages.

# Images 
![Screen Shot 2019-12-13 at 12 24 34 AM](https://user-images.githubusercontent.com/46588890/70769938-8d9c2100-1dbf-11ea-9943-02e2516625c7.png)
![Screen Shot 2019-12-13 at 12 25 21 AM](https://user-images.githubusercontent.com/46588890/70769940-8e34b780-1dbf-11ea-9a0c-60c1611040f6.png)
![Screen Shot 2019-12-13 at 12 25 26 AM](https://user-images.githubusercontent.com/46588890/70769941-8e34b780-1dbf-11ea-98e8-a0c6e743d612.png)
![Screen Shot 2019-12-13 at 12 25 34 AM](https://user-images.githubusercontent.com/46588890/70769942-8ecd4e00-1dbf-11ea-9e0f-42c602a70b16.png)

# Not shown in the photos, however is a feature: 
(iOS simulator does not allow for photos, however on an iPhone, these are functional and tested)
- List of foods after photo is taken
- Showing the user if they are allergic or not

# Requirements 
In order to use this, you need to initialize a Firebase app. A config.js file is needed with a variable called firebaseConfig, like this:

```JavaScript
export const firebaseConfig = {
    apiKey: "x",
    authDomain: "x",
    databaseURL: "x",
    projectId: "x",
    storageBucket: "x",
    messagingSenderId: "x",
    appId: "x",
    measurementId: "x",
    googleCloudVisionApiKey: "x",
  };
```
The config.js file should be located in the root of your project.

You will also need to initialize an environment file with the following:
```JavaScript
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
EDAMAME_APP_ID=
EDAMAME_APP_KEY=
GOOGLE_CLOUD_VISION_API=
```

The .env file should be located in the root of your project.

For the Edamame environment variables, you will need an Edamame API key. This is used in order to provide recipes to the client to cross-reference ingredients.
One more thing you need is a GCP API Key for Cloud Vision, which is the environment variable GOOGLE_CLOUD_VISION_API.
