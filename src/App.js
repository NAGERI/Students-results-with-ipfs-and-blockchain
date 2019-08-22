import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3"; // web3 helps ur client side app talk to the Blockchain
import ipfs from "./ipfs";
import TopNav from "./components/TopNav";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    contract: null,
    buffer: null,
    ipfsHash: "",
    hashedPDF: ""
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  // we get the file and convert it to format that IPFS can understand
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      // get array of data that we can pass to the buffer
      // this gives us a format that we can post to IPFS
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    }

  }

  // here we want to add the buffer file ti IPFS
  onSubmit = () => {
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.log(error);
        return
      }
      this.setState({ ipfsHash: result[0].hash });
      this.setState({ hashedPDF: `https://ipfs.io/ipfs/${this.state.ipfsHash}` });
      console.log("ipfsHash", this.state.ipfsHash);
    });
  }

  renderUni = () => {
    return (
      <div className="card text-center">
        <div className="card-body">
          <img src={require('./components/maklogo.jpeg')} alt="" />
        </div>
      </div>

    );
  }

  renderForm = () => {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Upload a file below to verify</h5>
        </div>
        <div className="card-body">
          <img src={require('./components/done2.png')} alt="" />
          <div className="form-group">
            <input type="file" onChange={this.captureFile} />
          </div>
          <div className="form-group">
            <button className="btn btn-success" onClick={this.onSubmit()}>Verify Transcript</button>
          </div>
        </div>
      </div>
    );
  }

  renderVerified = () => {
    return (
      <div className="card vrified">
        <ul className="list-group list-group-flush">
          <li className="list-group-item1"><h6>Transcript uploaded:</h6> <i className="fa fa-arrow-up"></i> <p className="uploadedHash">{this.state.ipfsHash}</p></li>
          <li className="list-group-item1"><h6>Transcript in System:</h6> <i className="fa fa-arrow-down"></i> <p className="returnedHash">{this.state.ipfsHash}</p></li>
        </ul>
        <div className="card-body">
          <h5 className="card-title"><i className="fa fa-check"></i>Transcript is Authentic... <i className="fa fa-thumbs-o-up"></i></h5>
          <p className="card-text">The ID of the uploaded transcript matches that of the original transcript stored in the system. Below are the details of the student.</p>
        </div>
        <img className="card-img-top" src={require("./components/trans.png")} alt="Card image cap" />
      </div>
    )
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="tops">
        {this.renderUni()}
        <div className="row">
          <TopNav />

          <div role="main" className="App col left">
            {this.renderForm()}
            <div className="card">
              <div className="card-header">
                <p>You may also access the transcript online using the link below: <i className="fa fa-link"></i></p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><p className="imageCaption">{this.state.hashedPDF}</p></li>
              </ul>
            </div>
            
          </div>
          <div className="col right load-results">
            {this.renderVerified()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
