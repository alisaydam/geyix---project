<script> 
import {shown} from "../stores"
  export let meme;
  export let user;
  const likeMeme = async () => {
    if(!$shown){
      return $shown = true
    }
    const submit = await fetch(
      `https://geyix.herokuapp.com/like/likeMeme/${user.username}/${meme._id}`,
      {
        headers: {
          "authorization": "Bearer dwaofjwaojfowa",
        },
      }
    );
    const data = await submit.json();
    meme = data;
  };
  const dislikeMeme = async () => {
    if(!$shown){
      return $shown = true
    }
    const submit = await fetch(
      `https://geyix.herokuapp.com/like/dislikeMeme/${user.username}/${meme._id}`,
    );
    const data = await submit.json();
    meme = data;
  };
</script>

<div class="vote-wrapper">
  <button
    class="vote-button-up {meme.likes.includes(user.username) ? 'voted' : ''}"
    on:click={likeMeme}
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
      role="presentation"
      data-v-33327dc2=""
      ><g fill="currentColor"
        ><path
          d="M7.19312 0L0.193115 7H5.19312V12H9.19312V7H14.1931L7.19312 0Z"
          data-v-1424a0e1=""
        /></g
      ></svg
    ><span>{meme.likes.length}</span></button
  >
  <button
    class="vote-button {meme.dislikes.includes(user.username) ? 'voted' : ''}"
    on:click={dislikeMeme}
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
      role="presentation"
      data-v-33327dc2=""
      ><g fill="currentColor"
        ><path
          d="M7.38635 12L0.386353 5H5.38635V0H9.38635V5H14.3864L7.38635 12Z"
          data-v-1424a0e1=""
        /></g
      ></svg
    ><span>{meme.dislikes.length}</span></button
  >
  <a sveltekit:prefetch sveltekit:noscroll href={"/meme/" + meme._id}  rel="external">
    <button class="vote-button">
      <img src="/ftcomment.svg" alt="s" srcset="" />
      <span
        >{meme.comments.length}</span
      ></button
    >
  </a>
</div>

<style>
  button {
    cursor: pointer;
    margin-right: 4px;
    display: flex;
    align-items: center;
    color: inherit;
    padding: 0.1% 1.5% 0.1% 1.5%;
    background-color: inherit;
    border: 1px solid gray;
    border-radius: 4px;
  }
  button:hover {
    background-color: rgba(0, 119, 255, 0.06);
  }
  .voted {
    background-color: rgb(185, 204, 231);
    color: rgb(94, 108, 228);
  }
  .vote-wrapper {
    display: flex;
    max-width: 650px;
    margin: auto;
    padding-bottom: 20px;
    border-bottom: 1px solid;
  }
  span {
    margin-left: 4px;
    color: inherit;
  }
 
  img {
    margin: 2px;
    width: 20px;
  }

  @media (max-width: 450px) {
  }
</style>
