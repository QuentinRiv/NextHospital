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


  document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("nameUp").value;
    const email = document.getElementById("emailUp").value;
    const password = document.getElementById("passwordUp").value;

    console.log("Name : ", name);
    console.log("Email : ", email);
    console.log("Password : ", password);
    var url = "";
    var data = {}

    const opt1 = document.getElementById("option-1").checked;
    if (!opt1) {
      url = "http://localhost:3000" + "/patient/new";

      data = {
        name,
        email,
        password,
        assignedDoctor: "662f63ee90f3614b3c0b6f74",
      }
    }
    else {
      url = "http://localhost:3000" + "/doctor/new";

      data = {
        doctorName: name,
        email,
        password,
        image: "doc_Ben.jpg"
      }
    }

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Échec de la connexion => " + response.message);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });

      
  });