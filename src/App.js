import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import tachyons from 'tachyons';
import ParticlesBg from 'particles-bg'
import React, { useState } from 'react';


const returnClarifaiJSONRequest = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'eedffe04cb79463a8cf54fceef841bb5';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'jcnovak5';       
    const APP_ID = 'face-recognition-brain';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;
    
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
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;
}


function App() {

  const [url,setUrl] = useState('')
  const [searchBox,setSearchBox] = useState('')

  const onInputChange = (event) => {
    setSearchBox(event.target.value);
  }


  const onButtonSubmit = () => {
    setUrl(searchBox);
    console.log('Click');
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiJSONRequest(url))
    .then(response => response.json())
    .then(response => {
      console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    })
  }

  return (
    <div className="App">
      <ParticlesBg className="patricles" color="#FFFFFF" num={200} type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
      <FaceRecognition imageUrl={url} />
    </div>
  );
}

export default App;
