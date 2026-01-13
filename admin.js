document.addEventListener("DOMContentLoaded", () => {

  function loadCustomers(){
    const raw = localStorage.getItem("poj_customers");
    return raw ? JSON.parse(raw) : [];
  }

  function saveCustomers(customers){
    localStorage.setItem("poj_customers", JSON.stringify(customers));
  }

  function setMsg(text, isError = false){
    const el = document.getElementById("adminMsg");
    if(!el) return;
    el.textContent = text;
    el.style.color = isError ? "#8b0000" : "rgba(122,17,67,0.80)";
  }

  function escapeHtml(str){
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ✅ Admin guard
  (function guard(){
    const role = localStorage.getItem("role");
    if(role !== "admin") window.location.href = "index.html";
  })();

  // ✅ Account page button
  document.getElementById("accountBtn")?.addEventListener("click", () => {
    window.location.href = "account.html";
  });

  // ✅ Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  // ✅ Search UI
  const searchInput = document.getElementById("searchInput");
  document.getElementById("clearSearchBtn")?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    render();
  });
  searchInput?.addEventListener("input", render);

  function render(){
    const tbody = document.getElementById("customersTable");
    if(!tbody) return;

    const q = (searchInput?.value || "").trim().toLowerCase();
    const customers = loadCustomers();

    const filtered = !q
      ? customers
      : customers.filter(c =>
          String(c.name||"").toLowerCase().includes(q) ||
          String(c.username||"").toLowerCase().includes(q)
        );

    tbody.innerHTML = filtered.map(c => `
      <tr class="clickRow" data-open="${escapeHtml(c.username)}">
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.username)}</td>
        <td>${Number(c.stamps || 0)} / 10</td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-open]").forEach(row => {
      row.addEventListener("click", () => {
        const u = row.getAttribute("data-open");
        window.location.href = `stamp.html?user=${encodeURIComponent(u)}`;
      });
    });
  }

  // ✅ Register customer (auto password)
  document.getElementById("addCustomerBtn")?.addEventListener("click", () => {
    const name = document.getElementById("newName")?.value.trim();
    const username = document.getElementById("newUser")?.value.trim();

    if(!name || !username){
      setMsg("Please enter both name and username.", true);
      return;
    }

    const customers = loadCustomers();
    const exists = customers.some(c => c.username.toLowerCase() === username.toLowerCase());
    if(exists){
      setMsg("That username already exists.", true);
      return;
    }

    const autoPass = (username + "123").slice(0, 16);
    customers.push({ name, username, stamps: 0, password: autoPass });
    saveCustomers(customers);

    document.getElementById("newName").value = "";
    document.getElementById("newUser").value = "";

    setMsg(`Customer added ✅ Username: ${username} • Password: ${autoPass}`);
    render();
  });

  render();
});
