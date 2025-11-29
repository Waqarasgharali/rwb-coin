// main.js

document.addEventListener("DOMContentLoaded", () => {
  let walletAddress = null;

  // ---------------- Connect Wallet ----------------
  async function connectWallet(btnEl) {
    try {
      const provider = window.solana && window.solana.isPhantom ? window.solana : null;
      if (!provider) {
        alert("Phantom Wallet not available! Install Phantom first.");
        window.open("https://phantom.app/", "_blank");
        return null;
      }
      const res = await provider.connect();
      walletAddress = res.publicKey.toString();
      btnEl.textContent = walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
      btnEl.classList.add("connected");
      return walletAddress;
    } catch (e) {
      console.error("Wallet connection failed:", e);
      return null;
    }
  }

  // Apply to all connect buttons on page
  const connectButtons = document.querySelectorAll(".connect-btn");
  connectButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      await connectWallet(btn);
    });
  });

  // ---------------- Swap Buttons ----------------
  const INPUT_MINT = 'So11111111111111111111111111111111111111112'; // Wrapped SOL
  const RWB_MINT = 'INSERT_RWB_TOKEN_MINT_HERE'; // <-- replace with your token's mint

  // Phantom Swap links
  const phantomLinks = document.querySelectorAll("#phantomLink");
  phantomLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!walletAddress) {
        await connectWallet(connectButtons[0]); // connect first button if not connected
        if (!walletAddress) return;
      }
      const url = `https://phantom.app/ul/exchange?inputMint=${INPUT_MINT}&outputMint=${RWB_MINT}&userAddress=${walletAddress}`;
      window.open(url, "_blank");
    });
  });

  // Jupiter Swap links
  const jupiterLinks = document.querySelectorAll("#jupiterLink");
  jupiterLinks.forEach(link => {
    link.href = `https://jup.ag/swap?inputMint=${INPUT_MINT}&outputMint=${RWB_MINT}`;
    link.addEventListener("click", (e) => {
      if (!walletAddress) {
        alert("Please connect your wallet first!");
        e.preventDefault();
      }
    });
  });
});
