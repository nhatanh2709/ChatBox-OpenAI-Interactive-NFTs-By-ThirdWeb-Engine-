import SignIn from '../components/SignIn';
import styles from '../styles/Home.module.css'
import { Web3Button, useContract, useNFTs, useShowConnectEmbed } from '@thirdweb-dev/react';
import Navbar from '../components/Navbar';
import { CONTRACT_ADDRESS } from '../lib/constants';
const Shop = () => {
    const showConnectEmbed = useShowConnectEmbed();
   
    const { contract } = useContract(CONTRACT_ADDRESS);
    const { data:nfts} = useNFTs(contract);

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {showConnectEmbed ? (
                    <SignIn/>
                ): (
                    <>
                        <Navbar/>
                        <div className={styles.gird}>
                            {nfts && nfts.length> 0 ? (
                                nfts.map((nft) => (
                                    <div key={nft.metadata.id} style={{
                                        backgroundColor: "#222",
                                        padding: "1rem",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        minWidth: "200px",
                                        textAlign: "center"
                                    }}> 
                                        {nft.metadata.name}
                                        <Web3Button
                                            contractAddress={CONTRACT_ADDRESS}
                                            action={(contract) => contract.erc1155.claim(nft.metadata.id,1)}
                                            onSuccess={() => alert("GPT claimed!")}
                                        >
                                            Claim GPT
                                        </Web3Button>
                                    </div>
                                ))
                            ) : (
                                <p>No GPTs available </p>
                            )}
                        </div>
                    </>
                )

                }
            </div>
        </main>
    )
}
export default Shop;