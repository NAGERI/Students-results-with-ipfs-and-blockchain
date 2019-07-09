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
  onSubmit = (event) => {
    event.preventDefault();
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

  renderForm = () => {
    return (
      <div className="card">
        <div className="card-header">
          Verify Student Transcript
          </div>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          {/* <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" /> */}
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input type="file" onChange={this.captureFile} />
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" />
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div role="main" className="App col-md-9 col-lg-10 px-4">
        <TopNav />
        {this.renderForm()}

        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        <p className="imageCaption">{this.state.hashedPDF}</p>
      </div>
    );
  }
}

export default App;
