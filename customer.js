document.addEventListener("DOMContentLoaded", () => {

  function loadCustomers(){
    const raw = localStorage.getItem("poj_customers");
    return raw ? JSON.parse(raw) : [];
  }

  // Customer guard
  (function guard(){
    const role = localStorage.getItem("role");
    if(role !== "customer") window.location.href = "index.html";
  })();

  const params = new URLSearchParams(window.location.search);
  const username = (params.get("user") || "").trim();

  const whoText = document.getElementById("whoText");
  const grid = document.getElementById("stampGrid");
  const msg = document.getElementById("msg");
  const reward5 = document.getElementById("reward5");
  const reward10 = document.getElementById("reward10");
  const cardEl = document.querySelector(".card");
  const userCodeEl = document.getElementById("userCode"); // ✅ new

  function setMsg(t){ msg.textContent = t; }

  function render(){
    if(!username){
      whoText.textContent = "Missing customer username.";
      setMsg("Please log in again.");
      return;
    }

    const customers = loadCustomers();
    const c = customers.find(x => x.username.toLowerCase() === username.toLowerCase());

    if(!c){
      whoText.textContent = "Customer not found.";
      setMsg("Please ask admin to register your account.");
      return;
    }

    const stamps = Math.max(0, Math.min(10, Number(c.stamps || 0)));
    whoText.textContent = `Hi, ${c.name} (@${c.username}) • Stamps: ${stamps}/10`;

    // ✅ show username on the card
    if (userCodeEl) userCodeEl.textContent = c.username;

    const circles = [];
    for(let i = 1; i <= 10; i++){
      circles.push(`<div class="circle ${i <= stamps ? "filled" : ""}"></div>`);
    }
    grid.innerHTML = circles.join("");

    reward5.classList.toggle("active", stamps >= 5);
    reward10.classList.toggle("active", stamps >= 10);

    cardEl.classList.toggle("reward-5", stamps >= 5);
    cardEl.classList.toggle("reward-10", stamps >= 10);

    setMsg("");
  }

  document.getElementById("printBtn")?.addEventListener("click", () => window.print());

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  render();
  setInterval(render, 2000);
});
