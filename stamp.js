document.addEventListener("DOMContentLoaded", () => {

  function loadCustomers(){
    const raw = localStorage.getItem("poj_customers");
    return raw ? JSON.parse(raw) : [];
  }

  function saveCustomers(customers){
    localStorage.setItem("poj_customers", JSON.stringify(customers));
  }

  // Admin guard (stamping is admin-only)
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

  function setMsg(t, isError=false){
    if(!msg) return;
    msg.textContent = t;
    msg.style.color = isError ? "#8b0000" : "rgba(122,17,67,0.80)";
  }

  function findCustomer(){
    const customers = loadCustomers();
    const idx = customers.findIndex(
      c => (c.username || "").toLowerCase() === username.toLowerCase()
    );
    return { customers, idx };
  }

  function render(){
    if(!username){
      whoText.textContent = "Missing customer username.";
      grid.innerHTML = "";
      setMsg("Go back and pick a customer.", true);
      return;
    }

    const { customers, idx } = findCustomer();
    if(idx === -1){
      whoText.textContent = "Customer not found.";
      grid.innerHTML = "";
      setMsg("This account may have been deleted.", true);
      return;
    }

    const c = customers[idx];
    const stamps = Math.max(0, Math.min(10, Number(c.stamps || 0)));

    whoText.textContent = `Customer: ${c.name} (@${c.username}) • Stamps: ${stamps}/10`;

    // 10 circles
    const circles = [];
    for(let i = 1; i <= 10; i++){
      circles.push(`<div class="circle ${i <= stamps ? "filled" : ""}"></div>`);
    }
    grid.innerHTML = circles.join("");

    // Reward cards
    reward5?.classList.toggle("active", stamps >= 5);
    reward10?.classList.toggle("active", stamps >= 10);

    // Card classes for color change
    cardEl?.classList.toggle("reward-5", stamps >= 5);
    cardEl?.classList.toggle("reward-10", stamps >= 10);
  }

  // ✅ Add stamp
  document.getElementById("addStampBtn")?.addEventListener("click", () => {
    const { customers, idx } = findCustomer();
    if(idx === -1) return;

    const current = Number(customers[idx].stamps || 0);
    customers[idx].stamps = Math.min(10, current + 1);

    saveCustomers(customers);
    setMsg("Stamp added 🌸");
    render();
  });

  // ✅ Reset stamps
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    const { customers, idx } = findCustomer();
    if(idx === -1) return;

    customers[idx].stamps = 0;
    saveCustomers(customers);
    setMsg("Card reset ✅");
    render();
  });

  // ✅ Save customer password
  document.getElementById("saveCustomerPassBtn")?.addEventListener("click", () => {
    const newPass = document.getElementById("newCustomerPass")?.value?.trim() || "";
    if(!newPass){
      setMsg("Enter a new password first.", true);
      return;
    }

    const { customers, idx } = findCustomer();
    if(idx === -1) return;

    customers[idx].password = newPass;
    saveCustomers(customers);

    document.getElementById("newCustomerPass").value = "";
    setMsg("Customer password updated ✅");
  });

  // ✅ Delete customer
  document.getElementById("deleteCustomerBtn")?.addEventListener("click", () => {
    const { customers, idx } = findCustomer();
    if(idx === -1) return;

    const c = customers[idx];
    const ok = confirm(`Delete customer "${c.name}" (@${c.username})?\nThis cannot be undone.`);
    if(!ok) return;

    customers.splice(idx, 1);
    saveCustomers(customers);

    setMsg("Customer deleted ✅");
    window.location.href = "admin.html";
  });

  // Back
  document.getElementById("backBtn")?.addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  render();
});
