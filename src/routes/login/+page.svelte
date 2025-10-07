<script lang="ts">
import "$lib/styles/app.css";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import LoadingIcon from "$lib/images/loader-2-line.svelte";

let usernameInput: HTMLInputElement, passwordInput: HTMLInputElement;
let loggingIn = $state(false);
let loginError: string | null = $state(null);

async function login() {
    loggingIn = true;
    let auth_data = await fetch(`${import.meta.env.VITE_SD_API_URL}/auth_db`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: `{ "username": "${usernameInput.value}", "password": "${passwordInput.value}" }`
    })
    .then((res) => res.json());
    console.log(auth_data);
    // Handle if error and set logging_in to false
    if (auth_data._status == "ERR") {
        loggingIn = false;
        if (auth_data._issues?.credentials) loginError = "invalid credentials.";
        else loginError = auth_data._message;
        return;
    }

    let user_res = await fetch(`${import.meta.env.VITE_SD_API_URL}/${auth_data._links.related.user.href}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8", "Authorization": `Bearer ${auth_data.token}` },
    })
    .then((res) => res.json());
    // Handle if error and set logging_in to false
    if (user_res._status == "ERR") {
        loggingIn = false;
        loginError = user_res._message;
        return;
    }

    // Set local storage with login data
    localStorage.setItem("sess:href",  auth_data._links.self.href);
    localStorage.setItem("sess:id",  auth_data._id);
    localStorage.setItem("sess:token",  `Basic ${btoa(auth_data.token + ':')}`);
    localStorage.setItem("sess:user",  JSON.stringify(user_res));

    goto(page.url.searchParams.get("redirect") || "/playground/edit"); //TODO: redirect to workflow page when there is one
}
</script>
<style>
main {
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
  border-color: var(--neutral-secondary-2);
  background: var(--neutral-secondary-1);
  outline: none;
}

#login-button {
    position: relative;
    display: block;
    background: var(--primary-800);
    border-radius: 0.5rem;
    overflow: clip;
    transition: background 0.2s;
    cursor: pointer;
    button {
        width: 100%;
        padding: 0.75rem;
        background: inherit;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }
    button.logging-in {
        color: transparent;
    }
    :global(svg) {
        position: absolute;
        left: 0;
        right: 0;
        margin-inline: auto;
        fill: white;
        height: 100%;
        animation: spin 2000ms infinite linear;
        padding: 0.25rem 0;
    }
}
#login-button:hover {
    background: var(--accent-blue);
}
#login-button:active {
  transform: scale(0.98);
}

@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}
</style>

<main>
    <div id="form">
        <h1>LOGO</h1>
        {#if loginError != null}<p style:color="red">Error: {loginError}</p>{/if}
        <label for="username">Username: </label><br/>
        <input name="username" bind:this={usernameInput} /><br/>
        <label for="password">Password: </label><br/>
        <input name="password" type="password" bind:this={passwordInput} /><br/>
        <span id="login-button">
            <button onclick={login} class:logging-in={loggingIn} disabled={loggingIn}>Log in</button>
            {#if loggingIn}<LoadingIcon />{/if}
        </span>
    </div>
</main>
