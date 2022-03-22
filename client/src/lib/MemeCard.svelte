<script>
  import MemeVoteBar from "./MemeVoteBar.svelte";
  import { user } from "../stores";
  export let meme;
  export let route;
</script>

<article class="meme">
  <header>
    <div class="post-section">
      <a href="/" class="icon">
        <picture data-v-3031e2bc=""
          ><source
            srcset="https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557376304.186_U5U7u5_100x100wp.webp"
            type="image/webp"
            data-v-3031e2bc=""
          /><img
            src="https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1557376304.186_U5U7u5_100x100.jpg"
            loading="lazy"
            data-v-3031e2bc=""
            alt="ss"
          /></picture
        >
      </a>
      <p>
        <a href="/">Funny</a> . 14h
      </p>
    </div>
    <a href={meme.title}>
      <h1>
        <a href={route + meme._id} sveltekit:prefetch sveltekit:noscroll
          >{meme.title}</a
        >
      </h1>
    </a>
  </header>
  <div class="post-container">
    <a href={route + meme._id} sveltekit:prefetch sveltekit:noscroll>
      <!-- Add this to a tag to opne it in a new tab target="_blank"   -->
      <img src={meme.meme} alt="" srcset="" />
    </a>
  </div>
</article>
<MemeVoteBar {meme} user={$user} />

<style>
  h1 {
    font-size: x-large;
    font-weight: 500;
    line-height: 1.5;
    display: inline-block;
  }
  article {
    margin-bottom: 24px;
    padding: 20px 0 0;
    max-width: 650px;
    margin: 10px auto;
  }
  header {
    display: block;
  }
  .post-section {
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }
  .icon {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    min-width: 20px;
    height: 20px;
    border-radius: 2px;
    background-color: #f4f4f4;
    margin-right: 8px;
    overflow: hidden;
  }
  a {
    text-decoration: none;
    cursor: pointer;
    color: inherit;
  }
  img {
    object-fit: cover;
    width: 100%;
  }
</style>
