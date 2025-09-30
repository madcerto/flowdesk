<script lang="ts">
import "$lib/styles/app.css";

let usernameInput: HTMLInputElement, passwordInput: HTMLInputElement;

async function login() {
    let auth_data = await fetch(`${import.meta.env.VITE_SD_API_URL}/auth_db`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: `{ "username": "${usernameInput.value}", "password": "${passwordInput.value}" }`
    })
    .then((res) => res.json());

    let user_res = await fetch(`${import.meta.env.VITE_SD_API_URL}/${auth_data._links.related.user.href}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8", "Authorization": `Bearer ${auth_data.token}` },
    })
    .then((res) => res.json());

    localStorage.setItem("sess:href",  auth_data._links.self.href);
    localStorage.setItem("sess:id",  auth_data._id);
    localStorage.setItem("sess:token",  `Basic ${btoa(auth_data.token + ':')}`);
    localStorage.setItem("sess:user",  JSON.stringify(user_res));
}
</script>
<style>
:global(body) {
  font-family: system-ui, sans-serif !important;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#form {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid var(--neutral-primary-3);
  width: 100%;
  max-width: 320px;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #666666;
}

input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--neutral-primary-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 1rem;
  transition: border-color 0.2s, background 0.2s;
}
input:focus {
  border-color: var(--primary-800);
  background: var(--primary-200);
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-800);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: var(--primary-600);
}
button:active {
  transform: scale(0.98);
}
</style>

<div id="form">
<h1>LOGO</h1>
<label for="username">Username: </label><br/>
<input name="username" bind:this={usernameInput} /><br/>
<label for="password">Password: </label><br/>
<input name="password" type="password" bind:this={passwordInput} /><br/>
<button onclick={login}>Log in</button>
</div>
