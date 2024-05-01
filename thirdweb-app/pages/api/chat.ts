import { Engine } from "@thirdweb-dev/engine";
import OpenAI from "openai";
import { CHAIN, CONTRACT_ADDRESS } from "../../lib/constants";
import { OpenAIStream, StreamingTextResponse } from "ai";
import fetch from "node-fetch";
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const ENGINE_URL = process.env.ENGINE_URL;
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
import { Agent } from "https";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const agent = new Agent({
    rejectUnauthorized: false
})

export const runtime = 'edge';

const handler = async function POST(req: Request) {
    const { messages, address, tokenId } = await req.json();
    try {
        const engine = new Engine({
            url: process.env.ENGINE_URL as string,
            accessToken: process.env.ENGINE_ACCESS_TOKEN as string
        });

        //console.log(engine)
        if( !NFT_CONTRACT_ADDRESS ||
            !ENGINE_URL ||
            !THIRDWEB_SECRET_KEY ||
            !CHAIN
        ) {
            return new Response("Missing Enviroment Variables", {
                status: 500
            });
        }
        
        const BalanceOf = await fetch(
            `${ENGINE_URL}/contract/${CHAIN}/${NFT_CONTRACT_ADDRESS}/erc1155/balance-of?walletAddress=${address}&tokenId=${tokenId}`,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${THIRDWEB_SECRET_KEY}`,
                    
                },       
            }

        )

        if (BalanceOf.result === "0") {
            return new Response("You do not own this token", {
                status: 403
            });
        }

       

        const nftMetadata = await fetch(
            `${ENGINE_URL}/contract/${CHAIN}/${NFT_CONTRACT_ADDRESS}/erc1155/get?tokenId=${tokenId}`,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${THIRDWEB_SECRET_KEY}`,
                }
            }
        )
         const contextContent = nftMetadata.result.metadata.description;

        const context = {
            role: 'system',
            content: contextContent
        };

        const combinedMessages = [context, ...messages];

        const reponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: combinedMessages,
        });

        const stream = OpenAIStream(reponse);

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log(error);
    }
};

export default handler;