document.addEventListener("DOMContentLoaded", () => {

  // ✅ Admin guard
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  if (role !== "admin" || !user) {
    window.location.href = "index.html";
    return;
  }

  const adminUserEl = document.getElementById("adminUser");
  const adminPassEl = document.getElementById("adminPass");
  const msgEl = document.getElementById("msg");

  // ✅ Load admins from localStorage
  const admins = JSON.parse(localStorage.getItem("poj_admins") || "[]");
  const idx = admins.findIndex(a => (a.username || "") === user);

  if (idx === -1) {
    msgEl.textContent = "Admin not found. (Missing poj_admins)";
    msgEl.style.color = "#8b0000";
    return;
  }

  // Show info
  adminUserEl.textContent = admins[idx].username;
  adminPassEl.textContent = admins[idx].password;

  // Save password
  document.getElementById("saveBtn")?.addEventListener("click", () => {
    const newPass = document.getElementById("newPass")?.value.trim() || "";

    if (!newPass) {
      msgEl.textContent = "Please enter a new password.";
      msgEl.style.color = "#8b0000";
      return;
    }

    admins[idx].password = newPass;
    localStorage.setItem("poj_admins", JSON.stringify(admins));

    adminPassEl.textContent = newPass;
    document.getElementById("newPass").value = "";

    msgEl.textContent = "Password updated successfully ✅";
    msgEl.style.color = "rgba(122,17,67,0.80)";
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
});
