<script>
  import { user } from "../stores";
  import Modal from "./Modal.svelte";
  import { goto } from "$app/navigation";
  import LoginModal from "./LoginModal.svelte";
  import ThemeSwapper from "./ThemeSwapper.svelte";
  let modal;
</script>
<svelte:head>
  <script>
    if (document) {
      let mode = localStorage.theme || "light";
      if (
        mode === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
      }
    }
  </script>
</svelte:head>
<!-- svelte-ignore a11y-missing-attribute -->
<header>
  <div class="nav-wrap">
    <a class="logo" href="/">Geyix</a>
    <nav>
      <ul class="nav-menu">
        <li >
          <a on:click={() => goto("/uploadMeme/meme")}><img class="user-icon" src="/upload.png" alt="" srcset="" width="30"></a>
        </li>
        {#if $user}
          <li>
            <button> <img class="avatar" src={$user.avatar} alt="fesfes" width="30" /> </button>
            <ul class="dropdown">
              <li><a class="drop-list" >Profil</a></li>
              <li><a class="drop-list" >Sub-3</a></li>
              <li>
                  <a class="drop-list"  on:click={() => ($user = "")}>ÇIKIŞ</a>
              </li>
            </ul>
          </li>
        {:else}
          <li>
            <button on:click={() => modal.show()}
              ><img class="user-icon" src="/user.png" alt="enter" width="25" />
            </button>
          </li>
        {/if}
        <li><ThemeSwapper /></li>
      </ul>
      {#if !$user}
        <Modal bind:this={modal}>
          <LoginModal />
        </Modal>
      {/if}
    </nav>
  </div>
</header>

<style> 
  .avatar{
    margin-bottom: 7px;
    overflow: hidden;
    border-radius: 50%;
    padding: 0 10px 0 10px;
  }
  header {
    /* Sticky will still add item to stacking but will stick when scroll down. And this prevents giving margin-top to each element that comes after navbar. */
    position: sticky;
    z-index: 1;
    background-color: inherit;
    height: 50px;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 10px;
  }
  .user-icon {
    filter: invert(94%) sepia(0%) saturate(1574%) hue-rotate(185deg)
      brightness(114%) contrast(60%);
    margin: 0 10px 0 10px;
  }
  .nav-wrap {
    display: flex;
    width: 100%;
    max-width: 900px;
    margin: auto;
    justify-content: space-between;
  }
  .logo {
    font-size: 25px;
    font-weight: 700;
    color: inherit;

  } 
  .nav-menu {
    display: flex;  
    position: relative;
    min-width: 150px;
  }

  /* DropDown Menu    */
  li {
    transition: 0.5s; 
    display: flex;
    align-items: center;
  }
  li:hover{
    background-color: rgba(172, 168, 168, 0.5);
  }
  .drop-list{
    font-size: 20px;
    line-height: 2;
  }
  ul li ul {
    visibility: hidden;
    opacity: 0;
    display: none;
    position: absolute;
    width: 50%;
    right: 45px;
    transition: all 0.5s ease;
    margin-top: 1rem;
    top: 30px;
    background-color: hsla(348, 0%, 48%, 0.5);
  }
  ul li:hover > ul,
  ul li:focus-within > ul,
  ul li ul:hover {
    visibility: visible;
    opacity: 1;
    display: block;
  }
  ul li ul li {
    clear: both;
    width: 100%;
  }
  ul{
    padding: 0;
    text-align: center; 
  }
  button{
    background: none;
    cursor: pointer;
    border: none;
    color: inherit;
  }
</style>
