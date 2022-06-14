<script context="module">
  export async function load({ params }) {
    const res = await fetch(`https://geyix.herokuapp.com/meme/getOneById/${params.memeId}`);
    const data = await res.json();
    return {
      props: {
        meme: data.meme,
        comments: data.comments,
      },
    };
  }
</script>

<script>
  import MemeCard from "$lib/MemeCard.svelte";
  import CommentCard from "$lib/CommentCard.svelte";
  export let meme;
  export let comments;
  import SubmitComment from "$lib/SubmitComment.svelte";
  import { user } from "../../stores";
  let url = "https://geyix.herokuapp.com/comment/newcomment";
  const submitComment = (e) => {
    comments = e.detail;
  };
</script>

<MemeCard {meme} route={"/meme/"} />
<SubmitComment on:submitComment={submitComment} user={$user} {url} {meme} />
{#each comments as comment}
  <CommentCard
    {comment}
    user={$user}
    subComments={comment.subComments.subComments}
  />
{/each}
