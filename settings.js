document.addEventListener("DOMContentLoaded", () => {

  // guard
  (function guard(){
    const role = localStorage.getItem("role");
    if(role !== "admin") window.location.href = "index.html";
  })();

  // admins
  function initAdmins(){
    if (localStorage.getItem("poj_admins")) return;
    const admins = [
      { username: "admin", password: "admin123" },
      { username: "petalsofjoy", password: "joy2026" },
    ];
    localStorage.setItem("poj_admins", JSON.stringify(admins));
  }
  function loadAdmins(){
    return JSON.parse(localStorage.getItem("poj_admins") || "[]");
  }
  function saveAdmins(admins){
    localStorage.setItem("poj_admins", JSON.stringify(admins));
  }

  // customers
  function loadCustomers(){
    return JSON.parse(localStorage.getItem("poj_customers") || "[]");
  }
  function saveCustomers(customers){
    localStorage.setItem("poj_customers", JSON.stringify(customers));
  }

  initAdmins();

  // buttons
  document.getElementById("backBtn")?.addEventListener("click", () => {
    window.location.href = "admin.html";
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  function setNote(id, text, isError=false){
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = text;
    el.style.color = isError ? "#8b0000" : "rgba(122,17,67,0.80)";
  }

  // save admin pass
  document.getElementById("saveAdminPassBtn")?.addEventListener("click", () => {
    const u = document.getElementById("adminUser")?.value.trim();
    const p = document.getElementById("adminPass")?.value.trim();

    if(!u || !p){
      setNote("adminMsg", "Enter admin username + new password.", true);
      return;
    }

    const admins = loadAdmins();
    const idx = admins.findIndex(a => a.username.toLowerCase() === u.toLowerCase());
    if(idx === -1){
      setNote("adminMsg", "Admin username not found.", true);
      return;
    }

    admins[idx].password = p;
    saveAdmins(admins);

    document.getElementById("adminPass").value = "";
    setNote("adminMsg", "Admin password updated ✅");
  });

  // save customer pass
  document.getElementById("saveCustPassBtn")?.addEventListener("click", () => {
    const u = document.getElementById("custUser")?.value.trim();
    const p = document.getElementById("custPass")?.value.trim();

    if(!u || !p){
      setNote("custMsg", "Enter customer username + new password.", true);
      return;
    }

    const customers = loadCustomers();
    const idx = customers.findIndex(c => c.username.toLowerCase() === u.toLowerCase());
    if(idx === -1){
      setNote("custMsg", "Customer username not found.", true);
      return;
    }

    customers[idx].password = p;
    saveCustomers(customers);

    document.getElementById("custPass").value = "";
    setNote("custMsg", "Customer password updated ✅");
  });

});
