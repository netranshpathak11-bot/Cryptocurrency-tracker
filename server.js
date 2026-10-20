import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public", {
    index: "coins.html"
}));

app.get("/coins/markets", async (req, res) => {
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
            vs_currency: "inr",
            per_page: "25",
            page: 1
        },
        timeout: 15000
    });
    console.log("Coins recived:", response.data.length);
    res.json(response.data);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get("/coins/:id", async (req, res) => {
    const coinId = req.params.id;
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
            timeout: 15000
        });
        const coinData = {
            name: response.data.name,
            symbol: response.data.symbol,
            description: response.data.description?.en || "No description available.",
            current_price: response.data.market_data?.current_price?.inr,
            market_cap: response.data.market_data?.market_cap?.inr
        };
        res.json(coinData);
    }  catch (error) {
        console.log(`Error: ${error}`)
    }
});

app.listen(port, ()  => {
    console.log(`Cryptocurrrency tracker running on port ${port}`);
});