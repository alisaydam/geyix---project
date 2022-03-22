<script>
  import { createEventDispatcher } from "svelte";
  import { shown } from "../stores";
  export let user;
  export let url;
  export let meme;
  let comment;

  let dispatch = createEventDispatcher();

  const handleSubmit = async (e) => {
    if (!$shown) {
      return ($shown = true);
    }
    const submit = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        comment,
        userid: user._id,
        memeid: meme._id,
      }),
    });
    const data = await submit.json();
    dispatch("submitComment", data);
    document.querySelector("textarea").value = "";
  };
</script>

<div class="submit-wrapper">
  <div class="upper-con">
    <!-- svelte-ignore a11y-invalid-attribute -->
   {#if user}
   <a href="">
    <img src={user.avatar} alt="sssssssss" />
  </a> 
   {/if}
    <textarea
      maxlength="500"
      minlength="1"
      bind:value={comment}
      cols="30"
      rows="10"
    />
  </div>
  <div class="after-bar">
    <button on:click={handleSubmit}>Gönder</button>
  </div>
</div>

<style>
  .submit-wrapper {
    max-width: 650px;
    margin: auto;
    padding: 10px;
  }
  .upper-con {
    display: flex;
  }
  textarea {
    border-radius: 5px;
    resize: none;
    width: 100%;
    max-height: 60px;
    color: inherit;
    background-color: inherit;
    border: 1px solid;
  }
  .after-bar {
    display: flex;
    justify-content: end;
  }
  img {
    width: 30px;
  }
</style>
