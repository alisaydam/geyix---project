<script> 
  import CommentVoteBar from "./CommentVoteBar.svelte";
  import SubCommentCard from "./SubCommentCard.svelte";
  export let comment;
  export let user;
  export let subComments
  
  let startIndex = comment.subComments.subComments.length
  let endIndex = comment.subComments.subComments.length 
  $: shownArr = comment.subComments.subComments.slice(startIndex, endIndex)
  const showSubcomments = () => { 
      startIndex-=2
  };
  const submitSubComment = (e) => { 
    comment = e.detail
  };
  const submitSubReply = (e) => {
    comment = e.detail
  }

</script>

<div class="comment-wrapper">
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href = {"/user/"+comment.commentor.username}> <img src={comment.commentor.avatar} alt="" /></a>
  <div class="comment">
    <h5>{comment.commentor.username}</h5>
    <p>{comment.comment}</p>
    <CommentVoteBar
      {user}
      commentid={comment._id}
      {comment}
      on:submitSubComment={submitSubComment}
    />
    {#each comment.subComments.subComments.reverse() as subComment}
      <SubCommentCard {subComment} {comment} on:submitSubReply={submitSubReply} />
    {/each}
    <div id={comment._id + "before"} />
    {#if comment.subComments.subComments.length >0}
    <a href="" on:click={showSubcomments}>
      <svg width="9" viewBox="-2.5 -5 75 60" preserveAspectRatio="none">
        <path
          d="M0,0 l35,50 l35,-50"
          fill="currentColor"
          stroke="black"
          stroke-linecap="round"
          stroke-width="10"
        />
      </svg>
      {comment.subComments.subComments.length} Yorumları Görüntüle
    </a>
    {/if}
  </div>
</div>

<style>
  a {
    font-size: 12px;
  }
  a:hover {
    background-color: aliceblue;
  }
  .comment-wrapper {
    max-width: 650px;
    margin: auto;
    position: relative;
    padding: 8px 0;
  }
  .comment {
    margin-left: 50px;
    width: 90%;
    word-wrap: break-word;
  }
  h5 {
    font-size: 14px;
    line-height: 1;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    padding: 0;
    margin: 0;
  }
  img {
    width: 35px;
    border-radius: 25px;
    position: absolute;
    top: 8px;
    left: 5px;
  }
</style>
