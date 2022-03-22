<script>
  import { aoviSvelte } from "aovi-svelte";
  import { mode, user } from "../stores";

  let errors = [];
  export let message = "";
  const form = aoviSvelte({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const confirmMatch = form.checker("confirm", (aovi) =>
    aovi.is($form.password === $form.confirm)
  );
  const doSignup = async () => {
    message = "";
    errors = [];
    form.aovi
      .check("name")
      .required("Lütfen isim giriniz")
      .minLength(2, "İsim en az 2 karakter olmalı")
      .maxLength(20, "İsim 20 karakterden fazla olamaz")
      .check("username")
      .required("Kullanıcı adı giriniz")
      .match(
        /^[A-Za-z0-9_-]*$/,
        "Kullanıcı adı harf, rakam ve '_,-' karakterleri içerebilir"
      )
      .minLength(2, "Kullanıcı adı en az 2 karakter uzunluğunda olmalı")
      .check("email")
      .required("Email gereklidir")
      .match(/[^@]+@[^\.]+\..+/, "Yanlış email formatı")
      .minLength(6)
      .check("password")
      .required("Şifre gereklidir")
      .minLength(8, "Şifre en az 8 karakter uzunluğunda olmalı")
      .check("confirm")
      .required("Şifre tekrarı gereklidir")
      .is($confirmMatch, "Şifre tekrarı uyuşmuyor.").end;
    if ($form.valid) {
      const { username, email, password, name } = $form;
      try {
        const submit = await fetch("http://localhost:5000/user/newuser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            username,
            email,
            password,
          }),
        });
        const data = await submit.json();
        if (data.success) {
          message = data.message;
          $mode = "signin";
        } else {
          errors = data.errors;
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  function toggleMode() {
    errors = [];
    if ($mode === "signup") {
      $mode = "signin";
    } else {
      $mode = "signup";
    }
  }
  const doLogin = async () => {
    const { email, password } = $form;
    try {
      const submit = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await submit.json();
      if (data.success) {
        message = data.message;
        $user = data.user;
      } else {
        errors.includes(data.error) ? null : (errors = [...errors, data.error]);
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="modal-wrapper">
  <div id="login-box">
    {#if $mode === "signin"}<h1>Giriş</h1>{:else}<h1>Kayıt Ol</h1>{/if}
    <div class="SwitchContainer">
      <label class="switch">
        <input
          type="checkbox"
          on:click={toggleMode}
          value={$mode === "signin" ? "signup" : "signin"}
        />
        <span class="slider round" />
      </label>
      <span>
        {#if $mode === "signin"}
          Kayıt Ol
        {:else}
          Giriş
        {/if}</span
      >
    </div>
    {#if $mode === "signup"}
      <input
        type="text"
        placeholder="İsim"
        bind:value={$form.name}
        class:error={$form.err.name}
        on:focus={form.clear}
      />
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        bind:value={$form.username}
        class:error={$form.err.username}
        on:focus={form.clear}
      />
    {/if}
    <input
      type="email"
      placeholder="E-mail"
      bind:value={$form.email}
      class:error={$form.err.email}
      on:focus={form.clear}
    />
    <input
      type="password"
      placeholder="Şifre"
      bind:value={$form.password}
      class:error={$form.err.password}
      class:success={$confirmMatch}
      onfocus={form.clear}
    />
    {#if $mode === "signup"}
      <input
        type="password"
        placeholder="Şifre Tekrarı"
        bind:value={$form.confirm}
        class:success={$confirmMatch}
        on:focus={form.clear}
      />
    {/if}
    {#if $mode === "signup"}
      {#each $form.err.toArray() as error}
        <p class="message">- {error}</p>
      {/each}
    {/if}
    {#each errors as error}
      <p class="message">- {error}</p>
    {/each}
    {#if message}
      <p class="success-p">{message}</p>
    {/if}
    {#if $mode === "signup"}
      <button outlined on:click={doSignup}> Kayıt ol </button>
    {:else}
      <button outlined on:click={doLogin}> Giriş Yap </button>
    {/if}
    <a href="">Şifremi unutum :(</a>
  </div>
</div>

<style>
  button {
    padding: 3px 10px;
    margin-bottom: 20px;
  }
  a {
    font-size: 12px;
  }
  span {
    color: white;
  }
  #login-box {
    background: rgba(27, 29, 27, 0.8); /* Green background with 30% opacity */
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    padding: 40px 50px 0;
    border-radius: 20px;
  }
  h1 {
    margin-bottom: 30px;
    color: white;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 30px;
  }
  .error {
    color: red;
  }

  .SwitchContainer {
    position: absolute;
    display: flex;
    top: 35px;
    right: 50px;
    flex-direction: column;
    align-items: center;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.1s;
    transition: 0.1s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 23px;
    width: 23px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.1s;
    transition: 0.1s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(22px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
  .message {
    font-size: 12px;
    margin: 0;
    color: red;
  }

  .success {
    background-color: #adffaa;
  }
  .success-p {
    width: 200px;
    font-size: 12px;
  }

  .error {
    background-color: #ffc6c6 !important;
  }
  input {
    border-radius: 5px;
    padding: 10px;
    background-color: white;
    margin-bottom: 25px;
  }

  /* input[type="text"],
    input[type="password"] { */
  input {
    display: block;
    box-sizing: border-box;
    margin-bottom: 20px;
    width: 220px;
    height: 32px;
    border: none;
    border-bottom: 1px solid #aaa;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 15px;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-bottom: 2px solid #16a085;
    color: #16a085;
    transition: 0.2s ease;
  }
</style>
