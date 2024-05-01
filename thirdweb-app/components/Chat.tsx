import { useAddress } from "@thirdweb-dev/react";
import { useRef } from "react";
import { useChat } from "ai/react";

type GPTProps = {
    tokenId: string | number | null | undefined;
};

const Chat: React.FC<GPTProps> = ({ tokenId }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const address = useAddress();

    const { messages, input, setInput, handleSubmit, isLoading } = useChat({
        body: {
            address: address,
            tokenId: tokenId,
        },

        onResponse: (response) => {
            if(response.status === 429) {
                console.log("You are being rate limited");
                return;
            } else {
                console.log("Message sent successfully")
            }
        },
        onError: (error) => {
            console.log("Error sending message", error);
        }
    })
    return (
        <main>
            <div style={{
                marginBottom:"6rem",
            }}>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: message.role === "user" ? "white" : "lightgrey",
                                margin: "1rem",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: message.role === "user" ? "green" : "black",
                                }}
                            >
                                {message.role === "user" ? (
                                    <div style={{
                                        padding: "0.1rem 1rem",
                                    }}>
                                        <p>User: </p>
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: "0.1rem 1rem",
                                    }}>
                                        <p>Bot: </p>
                                    </div>
                                )}
                            </div>
                            <p style={{
                                color: "#333",
                                padding: "1rem",
                            }}>
                                {message.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <div style={{ padding:"1rem" }}>
                        <p>Pick a model and start chatting.</p>
                    </div>
                )}
                <div style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: "1rem",
                    borderTop: "1px solid lightgrey",
                    backgroundColor: "white",
                }}>
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <input
                            ref={inputRef}
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    formRef.current?.requestSubmit();
                                    e.preventDefault();
                                }
                                
                            }}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                border: "1px solid lightgrey",
                                width: "100%",
                            }}
                        />
                        <button
                            disabled={isLoading}
                            style={{
                                marginLeft: "1rem",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "green",
                                color: "white",
                            }}
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
};

export default Chat;