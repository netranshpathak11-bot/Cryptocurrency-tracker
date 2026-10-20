
const search = document.getElementById("searchBtn");

// Search page functionality
if (search) {
    search.addEventListener("click", async () => {
        const coinId = document.getElementById("coinInput").value.trim().toLowerCase();

        const resultContainer = document.getElementById("resultContainer");
            
        if (!coinId) {
            resultContainer.textContent = "Please enter a coin ID.";
            return;
        }

        resultContainer.textContent = "Loading...";

        try {
            const response = await fetch(`/coins/${coinId}`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Coin not found.");
            }

            resultContainer.replaceChildren();

            const heading = document.createElement("h3");
            heading.textContent = `${data.name} (${data.symbol.toUpperCase()})`;

            const price = document.createElement("p");
            price.textContent = `Price (INR): ₹${data.current_price?.toLocaleString("en-IN") ?? "N/A"}`;
                
            const marketCap = document.createElement("p");
            marketCap.textContent = `Market Cap (INR): ₹${data.market_cap?.toLocaleString("en-IN") ?? "N/A"}`;
            
            const description = document.createElement("p");
            description.textContent = data.description || "No description available.";
                
            resultContainer.append(heading, price, marketCap, description);
                
        } catch (error) {
            console.error(error);
            resultContainer.textContent = "Unable to fetch coin details.";
        }
    });
}

// All Coins page functionality
const coinTable = document.getElementById("coinTable");

if (coinTable) {
    loadCoins();
}

async function loadCoins() {
    try {
        const response = await fetch("/coins/markets");

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to fetch coins");
}

        const coins = await response.json();
        coinTable.replaceChildren();

        coins.forEach(coin => {
                const row = document.createElement("tr");

            const values = [
                coin.name,
                coin.symbol.toUpperCase(),
                coin.current_price != null
                    ? `₹${coin.current_price.toLocaleString("en-IN")}`
                    : "N/A",
                coin.market_cap != null
                    ? `₹${coin.market_cap.toLocaleString("en-IN")}`
                    : "N/A"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            coinTable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        coinTable.textContent = "Unable to load cryptocurrency data.";
    }
}
