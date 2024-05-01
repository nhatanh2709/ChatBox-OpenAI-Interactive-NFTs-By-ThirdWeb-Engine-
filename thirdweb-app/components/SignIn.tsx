import { ConnectEmbed, darkTheme } from "@thirdweb-dev/react";

const customeTheme = darkTheme({
    colors: {
      modalBg: "black",
    }
  })

const SignIn = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}>
            <h1>Login to chat</h1>
            <ConnectEmbed
              theme={customeTheme}
              style={{
                border: "none",

              }}
            />
          </div>
    )
}

export default SignIn;