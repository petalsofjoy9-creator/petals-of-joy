document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // ✅ Create default admins once
  if (!localStorage.getItem("poj_admins")) {
    const defaultAdmins = [
      { username: "admin", password: "admin123" },
      { username: "petalsofjoy", password: "joy2026" },
    ];
    localStorage.setItem("poj_admins", JSON.stringify(defaultAdmins));
  }

  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  const msg = document.getElementById("message");
  const forgot = document.getElementById("forgotPass");

  // hide forgot text every attempt
  if (forgot) forgot.style.display = "none";
  msg.textContent = "";

  // ✅ ADMIN LOGIN (from localStorage)
  const admins = JSON.parse(localStorage.getItem("poj_admins") || "[]");
  const admin = admins.find(a => a.username === u && a.password === p);
  if (admin) {
    localStorage.setItem("role", "admin");
    localStorage.setItem("user", u);
    window.location.href = "admin.html";
    return;
  }

  // ✅ CUSTOMER LOGIN (from localStorage)
  const customers = JSON.parse(localStorage.getItem("poj_customers") || "[]");
  const customer = customers.find(c => c.username === u && c.password === p);
  if (customer) {
    localStorage.setItem("role", "customer");
    localStorage.setItem("user", u);
    window.location.href = `customer.html?user=${encodeURIComponent(u)}`;
    return;
  }

  // ❌ LOGIN FAILED
  msg.textContent = "Invalid username or password.";
  msg.style.color = "#8b0000";
  if (forgot) forgot.style.display = "block";
});
