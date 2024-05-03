const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Formulaire de connexion
// prettier-ignore
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("emailIn").value;
    const password = document.getElementById("passwordIn").value;

    // API pour checker le user
    fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Réponse réseau non OK');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          if (data.profileType === "Patient") {
            location.replace("/patient/main");
          } else if (data.profileType === "Doctor") {
            location.replace("/doctor/main");
          } else {
            console.error("Not Patient, Not Doctor ???");
          }
        } else {
          console.error("Token non reçu", data.error);
        }
      })
      .catch(error => {
        console.error("Échec de la connexion :", error.message);
      });
      
  });

document
  .getElementById("forgotPw")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const email = "sol.eli@email.com";
    const password = "1234";

    // API pour checker le user
    fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Réponse réseau non OK");
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          if (data.profileType === "Patient") {
            location.replace("/patient/main");
          } else if (data.profileType === "Doctor") {
            location.replace("/doctor/main");
          } else {
            console.error("Not Patient, Not Doctor ???");
          }
        } else {
          console.error("Token non reçu", data.error);
        }
      })
      .catch((error) => {
        console.error("Échec de la connexion :", error.message);
      });
  });
