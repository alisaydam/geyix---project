<script>
  import { createEventDispatcher } from "svelte";
  import { user, shown } from "../stores";
  export let comment;
  export let subComment;

  const dispatch = createEventDispatcher();
  const likeSubComment = async () => {
    if (!$shown) {
      return ($shown = true);
    }
    const submit = await fetch(
      `http://localhost:5000/like/likeSubComment/${$user.username}/${comment._id}/${subComment._id}`
    );
    const data = await submit.json();
    subComment.dislikes = data.dislikes;
    subComment.likes = data.likes;
  };
  const dislikeSubComment = async () => {
    if (!$shown) {
      return ($shown = true);
    }
    const submit = await fetch(
      `http://localhost:5000/like/dislikeSubComment/${$user.username}/${comment._id}/${subComment._id}`
    );
    const data = await submit.json();
    subComment.dislikes = data.dislikes;
    subComment.likes = data.likes;
  };

  const openSubCommentReply = (e) => {
    if (!$shown) {
      return ($shown = true);
    }
    const item = document.getElementById(e.currentTarget.name);
    const subDivSel = document.getElementById("comment-div");
    if (document.body.contains(subDivSel)) {
      subDivSel.remove();
    }
    const subDiv = document.createElement("div");
    subDiv.id = "comment-div";
    subDiv.style.cssText = "display: flex; position: relative;";
    const submitArea = document.createElement("textarea");
    submitArea.id = "textArea";
    const submitButton = document.createElement("button");
    const replyToShow = document.createElement("p");
    replyToShow.innerText = "@" + subComment.commentor;
    replyToShow.style.cssText = "position: absolute; top: -23px; left: -30px";

    subDiv.appendChild(replyToShow);
    subDiv.appendChild(submitArea);
    subDiv.appendChild(submitButton);

    submitButton.style.backgroundColor = "red";
    submitButton.innerText = "Gönder";
    submitArea.style.cssText = ` 
    border-radius: 5px;
    resize: none;
    width: 90%;
    color: inherit;
    background-color: inherit;
    height: 50px;
    border: 1px solid;`;

    item.appendChild(subDiv);
    submitButton.onclick = submitReply;
  };

  const submitReply = async () => {
    const subReply = document.getElementById("textArea").value;

    const submit = await fetch("http://localhost:5000/comment/newSubReply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        commentor: $user.username,
        avatar: $user.avatar,
        subComment: subReply,
        commentId: comment._id,
        subReplytId: subComment._id,
        replyTo: subComment.commentor,
      }),
    });
    const data = await submit.json();
    dispatch("submitSubReply", data);
    const subDivSel = document.getElementById("comment-div");
    subDivSel.remove();
  };
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<div class="sub-vote-wrapper"> 
  <button class="vote-button-up" on:click={likeSubComment}
    ><svg
    class={subComment.likes.includes($user.username)? "voted": ""}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="10"
      viewBox="0 0 14 12"
      role="presentation"
      data-v-33327dc2=""
      ><g fill="currentColor"
        ><path
          d="M7.19312 0L0.193115 7H5.19312V12H9.19312V7H14.1931L7.19312 0Z"
          data-v-1424a0e1=""
        /></g
      ></svg
    ><span>{subComment.likes.length}</span></button
  >
  <button class="vote-button dislike" on:click={dislikeSubComment}
    ><svg
    class={subComment.dislikes.includes($user.username)? "voted": ""}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="10"
      viewBox="0 0 14 12"
      role="presentation"
      data-v-33327dc2=""
      ><g fill="currentColor"
        ><path
          d="M7.38635 12L0.386353 5H5.38635V0H9.38635V5H14.3864L7.38635 12Z"
          data-v-1424a0e1=""
        /></g
      ></svg
    ><span>{subComment.dislikes.length}</span></button
  >
  <button
    on:click={openSubCommentReply}
    id={subComment.commentor}
    value={comment._id}
    name={subComment._id}
    class="vote-button"
  >
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="12"
  height="12"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="feather feather-message-square"
  ><path
    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  /></svg
>
    <span class="vote-button">Cevapla</span><button />
  </button>
</div>

<style>
   .voted{ 
    color: rgb(94, 108, 228);
  }
  button {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px 1.5% 2px 1.5%;
    border-radius: 2px;
    color: inherit;
    background-color: inherit;
    border: none;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }
  .sub-vote-wrapper {
    display: flex;
    max-width: 650px;
    margin: auto;
  }
  span {
    margin-left: 4px;
    font-size: 12px;
    margin-bottom: 3px;
  }

  img {
    margin: 2px;
    width: 10px;
    filter: invert(94%) sepia(0%) saturate(1574%) hue-rotate(185deg)
      brightness(114%) contrast(60%);;
  }

  @media (max-width: 450px) {
  }
</style>
