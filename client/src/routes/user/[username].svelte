<script context="module">
  export async function load({ params }) {
    const getUser = await fetch(
      `http://localhost:5000/user/${params.username}`
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
  let page = 0;
  let data = [];
  let newBatch = [];
  let section = "posts";

  const fetchUserMemes = async () => {
    try {
      const getMemes = await fetch(
        `http://localhost:5000/meme/getUserMemes?username=${username}&section=${section}&page=${page}&limit=5`
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
<div class="sections">
  <button
    on:click={() => {
      newBatch = [];
      data = [];
      page = 0;
      section = "posts";
      fetchUserMemes();
    }}>Gönderiler</button
  >
  <button
    on:click={() => {
      newBatch = [];
      data = [];
      page = 0;
      section = "liked";
      fetchUserMemes();
    }}>Beğeniler</button
  >
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

<style>
  button {
    border: 1px solid inherit;
    border-radius: 5px;
    padding: 2px;
    width: 80px;
    cursor: pointer;
  }
  .user {
    display: flex;
    max-width: 650px;
    margin: auto;
    height: 100px;
  }
  .user-info {
    margin: auto 0;
  }
  .sections {
    max-width: 650px;
    margin: 10px auto;
  }
  ul {
    padding: 0;
    overflow-x: hidden;
    /* box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12); */
    max-height: 100vh;
    max-width: 600px;
    margin: auto;
  }
  ul::-webkit-scrollbar {
    display: none;
  }
</style>
