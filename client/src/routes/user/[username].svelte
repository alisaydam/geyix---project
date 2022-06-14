<script context="module">
  export async function load({ params }) {
    // console.log(params.username);
    const getUser = await fetch(
      `https://geyix.herokuapp.com/user/getOne/${params.username}`
    );
    const user = await getUser.json();
    return {
      props: {
        user: user,
        username: params.username,
      },
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import InfiniteScroll from "$lib/InfiniteScroll.svelte";
  import MemeCard from "$lib/MemeCard.svelte";
  export let username;
  export let user;
  let current = "active";

  let page = 0;
  let data = [];
  let newBatch = [];
  let section = "posts";

  const fetchUserMemes = async () => {
    try {
      const getMemes = await fetch(
        `https://geyix.herokuapp.com/meme/getUserMemes?username=${username}&section=${section}&page=${page}&limit=5`
      );
      newBatch = await getMemes.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  onMount(() => {
    fetchUserMemes();
  });

  $: data = [...data, ...newBatch];
</script>

<div class="user">
  <img src={user.avatar} alt="user-avatar" />
  <div class="user-info">
    <h1>{user.name}</h1>
    <h5>@{user.username}</h5>
  </div>
</div>
<div class="tab-bar">
  <ul class="menu">
    <!-- svelte-ignore a11y-missing-attribute -->
    <li><a class:active={current === "postlar"} on:click={() => {
      current="postlar"
      newBatch = [];
      data = [];
      page = 0;
      section = "posts";
      fetchUserMemes();
    }}>Postlar</a></li>
    <!-- svelte-ignore a11y-missing-attribute -->
    <li><a class:active={current==="yorum"} on:click={()=> {
      current = "yorum"
    }} >Yorum</a></li>
    <!-- svelte-ignore a11y-missing-attribute -->
    <li><a class:active={current==="begen"} on:click={() => {
      current = "begen"
      newBatch = [];
      data = [];
      page = 0;
      section = "liked";
      fetchUserMemes();
    }}>Beğeniler</a></li>
    <!-- svelte-ignore a11y-missing-attribute -->
    <li><a class:active={current === "kaydet"} on:click={()=> {
      current = "kaydet"
    }}>Kaydedilenler</a></li>
  </ul>
</div> 

<ul>
  {#each data as meme}
    <MemeCard {meme} route={"/user/"} />
  {/each}
  <InfiniteScroll
    hasMore={newBatch.length}
    threshold={100}
    on:loadMore={() => {
      page++;
      fetchUserMemes(section);
    }}
  />
</ul>

{#if newBatch.length === 0}
 <p>
   Burada görecek bir şey yok.
 </p>
{/if}
<style>
 p{
    text-align: center;
  }
  .user {
    display: flex;
    margin: auto;
    height: 100px;
  }
  .user-info {
    margin: auto 0;
  }
  .tab-bar {
    box-shadow: inset 0 -1px 0 rgba(1, 1, 1, 0.2);
    margin-top: 12px;
  }
  .menu {
    display: flex;
  }
  a {
    font-weight: 700;
    display: block;
    box-sizing: border-box;
    line-height: 20px;
    height: 40px;
    padding: 10px 16px;
  }
  a:hover {
    background-color: rgba(172, 168, 168, 0.5);
  }
  .active {  
    border-bottom: 2px solid;
  }
  ul {
    padding: 0;
    overflow-x: hidden;
    /* box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12); */
    max-width: 600px;
    max-height: 100vh; 
  }

  ul::-webkit-scrollbar {
    display: none;
  }
</style>
