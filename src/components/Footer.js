import React, { Component } from "react";

export default class Footer extends Component {

    render() {
        return (
            <footer id="sticky-footer" className="py-4 bg-dark text-white-50">
                <div className="container text-center">
                    <small>Copyright &copy; Your Website</small>
                </div>
            </footer>
        )
    }
}