// this block of code returns the Clarifai JSON Request
const ReturnClarifaiRequestOptions = (imgUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = process.env.PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imgUrl;
 
    const raw = JSON.stringify({
     "user_app_id": {
         "user_id": USER_ID,
         "app_id": APP_ID
     },
     "inputs": [
         {
             "data": {
                 "image": {
                     "url": IMAGE_URL
                 }
             }
         }
     ]
   });
   const requestOptions = {
     method: 'POST',
     headers: {
         'Accept': 'application/json',
         'Authorization': `Key ${PAT}`
     },
     body: raw
 };
 
 return requestOptions
 }

 // handles client request for face detection
 // makes an API calll to Clarifai, 
 // API call is processed on the server-side (back-end)
 // detected face data is sent back to the client (front-end) as a JSON response
 // The server acts as the middleman and handles API calls and processes the API response before sending relevant data back to the client.
 // This approach is common in web applications where sensitive or complex API calls are performed on the server to prevent exposing API keys or other sensitive information to the client-side.
 const handleApiCall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", ReturnClarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('API RESPONSE FAILED'))
 }

//image route
//connecting to our database, using KNEX, to increase user entry count
//if user is not found, send JSON response that says "unable to fetch entries"
const handleImage = (req, res, db) => {
    const { id } = req.body
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to fetch entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}

