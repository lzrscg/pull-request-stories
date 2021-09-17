import Amplify, { Auth, Hub } from "aws-amplify";
import { Component } from "react";

import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

export default class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        this.setState({ user });
      })
      .catch(() => console.log("Not signed in"));
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <button
          onClick={() => Auth.federatedSignIn({ provider: "Github" } as any)}
        >
          Open Github
        </button>
        <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
        {user ? (
          <button onClick={() => Auth.signOut()}>
            Sign Out {(user as any).getUsername()}
          </button>
        ) : null}
      </div>
    );
  }
}
