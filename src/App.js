import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
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
  const [box, setBox] = useState({})
  const MODEL_ID = 'face-detection';


  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    console.log(box);
    setBox(box);
  }

  const onInputChange = (event) => {
    setUrl(event.target.value);
  }


  const onButtonSubmit = () => {
    console.log('Click');
    setSearchBox(url);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiJSONRequest(url))
    .then(response => response.json())
    .then(response => displayFaceBox(calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  return (
    <div className="App">
      <ParticlesBg className="patricles" color="#FFFFFF" num={200} type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
      <FaceRecognition box={box} imageUrl={searchBox} />
    </div>
  );
}

export default App;
