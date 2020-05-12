import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from "axios";

// class SubComponent extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>{this.props.title}</h2>
//         <h4>{this.props.content}</h4>
//       </div>
//     )
//   }
// }

// class App extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       billet: [],
//     }
//   }

//   componentDidMount() {
//     axios.get("http://localhost:4242/").then((data) => {
//       this.setState({billet: data.data});
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h1>Hello world </h1>
//         {this.state.billet.map((e) => {
//           return (
//             <SubComponent title={e.title} content={e.content} login={e.login}/>
//           )
//         })}
//       </div>
//     )
//   }
// }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
