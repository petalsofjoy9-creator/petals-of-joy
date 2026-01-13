document.addEventListener("DOMContentLoaded", () => {

  function loadCustomers(){
    const raw = localStorage.getItem("poj_customers");
    return raw ? JSON.parse(raw) : [];
  }

  function saveCustomers(customers){
    localStorage.setItem("poj_customers", JSON.stringify(customers));
  }

  // Admin guard
  (function guard(){
    const role = localStorage.getItem("role");
    if(role !== "admin") window.location.href = "index.html";
  })();

  const params = new URLSearchParams(window.location.search);
  const username = (params.get("user") || "").trim();

  const whoText = document.getElementById("whoText");
  const grid = document.getElementById("stampGrid");
  const msg = document.getElementById("msg");
  const reward5 = document.getElementById("reward5");
  const reward10 = document.getElementById("reward10");
  const cardEl = document.querySelector(".card");

  function setMsg(t){ msg.textContent = t; }

  function findCustomer(){
    const customers = loadCustomers();
    const idx = customers.findIndex(c => c.username.toLowerCase() === username.toLowerCase());
    return { customers, idx };
  }

  function render(){
    const { customers, idx } = findCustomer();
    if(idx === -1){
      whoText.textContent = "Customer not found.";
      grid.innerHTML = "";
      return;
    }

    const c = customers[idx];
    const stamps = Math.max(0, Math.min(10, Number(c.stamps || 0)));

    whoText.textContent = `Customer: ${c.name} (@${c.username}) • Stamps: ${stamps}/10`;

    // 10 circles
    const circles = [];
    for(let i=1;i<=10;i++){
      circles.push(`<div class="circle ${i<=stamps ? "filled" : ""}"></div>`);
    }
    grid.innerHTML = circles.join("");

    reward5.classList.toggle("active", stamps >= 5);
    reward10.classList.toggle("active", stamps >= 10);

    // stamp color classes (if you added the CSS)
    cardEl.classList.toggle("reward-5", stamps >= 5);
    cardEl.classList.toggle("reward-10", stamps >= 10);
  }

  document.getElementById("addStampBtn").addEventListener("click", () => {
    const { customers, idx } = findCustomer();
    if(idx === -1) return;

    const current = Number(customers[idx].stamps || 0);
    customers[idx].stamps = Math.min(10, current + 1);

    saveCustomers(customers);
    setMsg("Stamp added 🌸");
    render();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    const { customers, idx } = findCustomer();
    if(idx === -1) return;

    customers[idx].stamps = 0;
    saveCustomers(customers);
    setMsg("Card reset ✅");
    render();
  });

  document.getElementById("deleteBtn").addEventListener("click", () => {
    const ok = confirm(`Delete "${username}"? This cannot be undone.`);
    if(!ok) return;

    const customers = loadCustomers();
    const next = customers.filter(c => c.username.toLowerCase() !== username.toLowerCase());
    saveCustomers(next);

    alert("Customer deleted ✅");
    window.location.href = "admin.html";
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  render();
});
