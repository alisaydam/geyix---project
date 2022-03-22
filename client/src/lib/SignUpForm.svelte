<script>
  import { aoviSvelte } from "aovi-svelte";
  import { mode, user } from "../stores";
  import { goto } from "$app/navigation";

  let errors = [];
  let message = "";
  const form = aoviSvelte({
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
      .check("username")
      .required("Kullanıcı adı giriniz")
      .match(
        /^[A-Za-z0-9_-]*$/,
        "Kullanıcı adı harf, rakam ve '_,-' karakterleri içerebilir"
      )
      .minLength(3, "Kullanıcı adı en az 3 karakter uzunluğunda olmalı")
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
      const { username, email, password } = $form;
      try {
        const submit = await fetch("http://localhost:5000/user/newuser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
        goto("/");
      } else {
        errors.includes(data.error) ? null : (errors = [...errors, data.error]);
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<div class="big-wrapper">
  <div id="animatedBackground">
    <div id="login-box">
      <div class="left">
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
          {#if $mode === "signin"}
            Kayıt Ol
          {:else}
            Giriş
          {/if}
        </div>
        {#if $mode === "signup"}
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
          <p class="succes-p">{message}</p>
        {/if}
        <p>
          {#if $mode === "signup"}
            <button on:click|preventDefault={doSignup}>Kayıt Ol</button>
          {:else}
            <button on:click|preventDefault={doLogin}>Giriş Yap</button>
          {/if}
        </p>
      </div>
      <div class="right" id="right">
        <!-- <a class="have-acc" href="/auth/signup"
          ><p>Don't have an account? Sign up!</p></a
        >
        <a class="have-acc" href="/"><p>Or continue without login!</p></a> -->
      </div>
      <div class="or" id="or">OR</div>
    </div>
  </div>
</div>

<style>
  .big-wrapper {
    height: 100vh;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  .error {
    color: red;
  }

  .SwitchContainer {
    position: absolute;
    display: flex;
    top: 30px;
    right: 25px;
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
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
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
    transform: translateX(26px);
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

  .error {
    background-color: #ffc6c6 !important;
  }
  .have-acc {
    text-decoration: none;
    color: white;
    font-size: 13px;
    margin: 8px;
  } 
  #animatedBackground {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;  
    background: url("/bg.png");
    background-repeat: repeat;
    background-position: 0 0;
    background-size: auto 100%;
    /*adjust s value for speed*/
    animation: animatedBackground 500s linear infinite;
  }

  @keyframes animatedBackground {
    from {
      background-position: 0 0;
    }
    /*use negative width if you want it to flow right to left else and positive for left to right*/
    to {
      background-position: -10000px 0;
    }
  }
  @media (max-width: 600px) {
    #or {
      position: absolute;
      top: 405px;
      left: 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      line-height: 40px;
      text-align: center;
    }
    #login-box {
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      position: relative;
      margin: 5% auto;
      min-width: 250px;
      max-width: 600px;
      background: #fff;
      border-radius: 2px;
    }

    #right {
      box-sizing: border-box;
      padding: 40px;
      width: 300px;
      background: url("https://goo.gl/lPCXrQ");
      background-size: cover;
      background-position: center;
      border-radius: 0 2px 2px 0;
    }
  }

  #login-box {
    display: flex;
    position: relative;
    margin: 5% auto;
    min-width: 250px;
    padding-bottom: 15px;
    max-width: 600px;
    background: #fff;
    border-radius: 15px;
    background: rgba(27, 29, 27, 0.8); /* Green background with 30% opacity */
  }

  .left {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-items: center;
    color: white;
    box-sizing: border-box;
    padding: 40px;
    width: 300px;
    height: 400px;
  }

  h1 {
    margin: 0 0 20px 0;
    font-weight: 300;
    font-size: 28px;
  }
  input {
    border-radius: 5px;
    padding: 10px;
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
    transition: 0.2s ease;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-bottom: 2px solid #16a085;
    color: #16a085;
    transition: 0.2s ease;
  }
  .or {
    position: absolute;
    top: 190px;
    left: 275px;
    width: 40px;
    height: 40px;
    background: rgba(27, 29, 27, 0.8);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    line-height: 40px;
    text-align: center;
    color: white;
  }

  .right {
    box-sizing: border-box;
    padding-left: 25px;
    padding-top: 140px;
    padding-right: 15px;
    width: 300px;
    background: url("https://goo.gl/lPCXrQ");
    background-size: cover;
    background-position: center;
    border-radius: 0 2px 2px 0;
  }

  button.social-signin {
    margin-bottom: 20px;
    width: 220px;
    height: 36px;
    border: none;
    border-radius: 2px;
    color: #fff;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    transition: 0.2s ease;
    cursor: pointer;
  }

  button.social-signin:hover,
  button.social-signin:focus {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    transition: 0.2s ease;
  }

  button.social-signin:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    transition: 0.2s ease;
  }

  button.social-signin.facebook {
    background: #32508e;
  }

  button.social-signin.twitter {
    background: #55acee;
  }

  button.social-signin.google {
    background: #dd4b39;
  }
</style>
