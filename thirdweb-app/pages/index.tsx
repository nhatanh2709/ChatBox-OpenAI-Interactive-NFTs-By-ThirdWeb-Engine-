import { useAddress, useContract, useOwnedNFTs, useShowConnectEmbed } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import Navbar from "../components/Navbar";
import { CONTRACT_ADDRESS } from "../lib/constants";
import { useState } from "react";
import Chat from "../components/Chat";
import SignIn from "../components/SignIn";

const Home: NextPage = () => {
  const showConnectEmbed = useShowConnectEmbed();

  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);

  const { data: ownedNFTs } = useOwnedNFTs(contract, address);

  const [selectedGPT, setSelectedGPT] = useState<string | number | null | undefined>("Select GPT");
  const [selectedGPTId, setSelectedGPTId] = useState<string | number | null | undefined>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {showConnectEmbed ? (
          <SignIn/>
        ) : (
          <>
            <Navbar/>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
            }}>
              <h3>GPT Chat</h3>
              <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div style={{
                  position: "relative",
                  minWidth: "200px",
                }}>
                  <div 
                    style={{
                      marginLeft: "1rem",
                      border: "1px solid #333",
                      padding: "0rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsModalOpen(!isModalOpen)}
                  >
                    <p style={{ fontSize: '12px' }}>{selectedGPT}</p>
                  </div>
                  {isModalOpen && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      backgroundColor: "#131313",
                      padding: "1rem",
                      marginTop: "0.5rem",
                      borderRadius: "8px",
                    }}>
                      {ownedNFTs && ownedNFTs.length > 0 ? (
                        ownedNFTs.map((nft) => (
                          <p
                            key={nft.metadata.id}
                            style={{
                              fontSize: "12px", 
                              padding: '0.25rem 0.5rem' 
                            }}
                            className={styles.modelItem}
                            onClick={() => {
                              setSelectedGPT(nft.metadata.name);
                              setSelectedGPTId(nft.metadata.id);
                              setIsModalOpen(false);
                            }}
                          >
                            {nft.metadata.name}
                          </p>
                        ))
                      ) : (
                        <p style={{ fontSize: "12px" }}>No GPTs owned.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Chat tokenId={selectedGPTId}/>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;