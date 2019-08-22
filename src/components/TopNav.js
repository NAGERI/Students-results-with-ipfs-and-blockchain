import React , { Component } from "react";

export default class TopNav extends Component{

    render(){
        return ( 
            <nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow navbar-expand-lg">
                <img className="logo" src={require("./logo2.png")} alt="" />
                <p className="navbar-brand col-sm-3 col-md-2 mr-0">Student Transcript Verification</p>
            </nav>
        )
    }
}

