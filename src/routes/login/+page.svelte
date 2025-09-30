<script lang="ts">
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

<label for="username">Username: </label><br/>
<input name="username" bind:this={usernameInput} /><br/>
<label for="password">Password: </label><br/>
<input name="password" type="password" bind:this={passwordInput} /><br/>
<button onclick={login}>Log in</button>
