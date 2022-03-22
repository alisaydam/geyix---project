<script>
  import SubCommentVoteBar from "./SubCommentVoteBar.svelte";
  export let subComment;
  export let comment;

  
</script>
<!-- svelte-ignore a11y-missing-attribute -->
<div class="sub-comment-wrapper" id={subComment._id}>
  <a href = {"/user/"+subComment.commentor}><img src={subComment.avatar} alt="" /></a>
  <div>
    <div class="comment">
      <h5>{subComment.commentor}</h5>
      <p>
        <a href = {"/user/"+subComment.replyTo}>
          {subComment.replyTo ? "@" + subComment.replyTo+" " : ""}</a
        >{subComment.subComment}
      </p>
      <SubCommentVoteBar {subComment} {comment} on:submitSubReply />
    </div>
  </div>
</div>

<style>
  a{
    color: rgb(166, 166, 233);
  }
  .sub-comment-wrapper {
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
