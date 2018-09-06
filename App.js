import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'e9f101adace1466883f784806f3e98bb'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable:true,
        value_area: 800
      }
    }
  }
} /*partical configuration*/

const initialState = {
    input:'', /*state of the input can change*/
    imageUrl:'',
    box:{},
    route:'signin',
    isSignedin: false,
    user: {
      id:'',
      name:'',
      email:'',
      entries:0,
      joined: ''
    }
}
class App extends Component {
  constructor(){
    super();
    this.state= initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
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

  displayFaceBox = (box) => {
    this.setState({box:box})
  }


  onInputChange = (event) => {
    this.setState({input:event.target.value});
  } /*function is listening for an event
  logs the change when an event occurs (for testing)*/

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    /*set the state of imageUrl to the current state of input*/
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
    .then(response => {
      if(response) {
        fetch('http://localhost:3000/image',{
          method:'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.user.id
          })
        })
        .then(response=> response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      this.displayFaceBox(this.calculateFaceLocation(response))
      }
    })
    .catch(err => console.log(err));
    /*this is the code that clarifai gave us to connect to the API*/
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } 
    else if (route === 'home'){
      this.setState({isSignedin:true})
    }
    this.setState({route:route});
  }

  render() {
    const { isSignedin, imageUrl, route,box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange}/>
        {route === 'home'
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries= {this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              /> 
              {/*passes the property "onInputChange" to the 
              ImageLinkForm and feeds in the current state*/}
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>

          : (
              route === 'signin' 
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )        
        }
      </div>
    );
  }
}

export default App;
