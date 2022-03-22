<script>
  import { onMount } from "svelte";
  import InfiniteScroll from "$lib/InfiniteScroll.svelte";
  import MemeCard from "$lib/MemeCard.svelte";

  let page = 0;
  let data = [];
  let newBatch = [];

  async function fetchData() {
    const response = await fetch(
      `http://localhost:5000/meme/getMemes?page=${page}&limit=5`
    );
    newBatch = await response.json();
  }

  onMount(() => {
    // load first batch onMount
    fetchData();
  });

  $: data = [...data, ...newBatch];
</script>
<ul>
  {#each data as meme}
    <MemeCard {meme} route="/meme/" />
  {/each}
  <InfiniteScroll
    hasMore={newBatch.length}
    threshold={100}
    on:loadMore={() => {
      page++;
      fetchData();
    }}
  />
</ul>

<style>
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
