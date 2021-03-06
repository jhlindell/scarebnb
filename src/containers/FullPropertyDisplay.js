import React from "react";
import {Button, Row, Col, Container} from 'reactstrap';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Sound from 'react-sound';

const LOCAL_URL = 'http://localhost:8080/api';
const HEROKU_URL = 'https://scarebnb-db.herokuapp.com/api';
const URL = HEROKU_URL;

class FullPropertyDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {},
      owner: {},
      displayScare: false
    };
  }

  componentDidMount() {
    axios.get(`${URL}/properties/${this.props.match.params.id}`)
    .then((property) => {
      this.setState({property: property.data[0]});
      axios.get(`${URL}/users/${this.state.property.owner_id}`)
      .then((user) => {
        this.setState({owner: user.data[0]});
      });
    });
    this.jumpScareTimer();
  }


  makeReservation = (event) => {
    console.log(this.state.owner.email, "email");
    if(!this.state.property.bookedOnHalloween){

      window.location.href = `mailto:${this.state.owner.email}?subject=${"Interested in booking a reservation"}&body=`;
    }
    if (this.state.property.bookedOnHalloween) {
        console.log("already booked");
        console.log(toast('This room has already been booked'));
        return
    }
    event.preventDefault()
    axios.patch(`${URL}/properties/${this.props.match.params.id}`, {bookedOnHalloween: true}).then((data) => {
        console.log(data);
        this.setState({property: data.data});
    });
  }

  jumpScareTimer(){
    setTimeout(() => this.changeScareState(true), 10000);
    setTimeout(() => this.changeScareState(false), 11000);
  }

  changeScareState(scareState){
    this.setState({displayScare: scareState});
  }

  render() {
    if (!this.state.property.id) {
      return <div>Loading...</div>
    }
    if(this.state.displayScare){
      return (<div>
        <img className="jumpScare" src="/images/jumpscare.jpg" />
        <Sound
          url="/Scream.mp3"
          playStatus={Sound.status.PLAYING}
          playFromPosition={300 /* in milliseconds */}
        />
      </div> )
    } else {
    return (
      <Container className="fullPropContainer">
        <Row className="fullPropDetails">
          <Col xs="6">
            <div className="fullPropDesc">
              <h3>
                {this.state.property.property_name}
              </h3>
              <p>
                {this.state.property.description}
              </p>
            </div>
          </Col>
          <Col xs="6">
            <div className="fullPropImageDiv">
              <img className="fullPropImage" src={this.state.property.photo_url} alt="a something should go here" height="200px"></img>
            </div>
          </Col>
        </Row>
        <Row className="fullPropDetails">

          <Col className="fullPropDetsCol" xs="4">
            <h5>Address:</h5>
            <div>{this.state.property.street_address}</div>
            <div>{this.state.property.city}</div>
            <div>{this.state.property.state}</div>
            <div>{this.state.property.zip_code}</div>
          </Col>
          <Col className="fullPropDetsCol" xs="4">
            <h5>Amenities:</h5>
            <div>{this.state.property.amenities}</div>
          </Col>
          <Col className="fullPropDetsCol" xs="4">
            <h5>House Rules:</h5>
            <div>{this.state.property.house_rules}</div>
          </Col>

        </Row>
        <Row className="fullPropDetails">
          <Col className="fullPropDetsCol" xs="1">
            <h5 className="propTextColor">When:</h5>
          </Col>
          <Col className="fullPropDetsCol" xs="4">
            <div className="propTextColor">Halloween, 2017</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <ToastContainer/>
            <Button className={`reservationBtn disabled`} onClick={this.makeReservation}>
              <span className="reservationBtnText">Reserve this room</span>
            </Button>
          </Col>
        </Row>
      </Container>
    )
    }
  }
}

export default FullPropertyDisplay
