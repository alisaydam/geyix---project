<script>
  import { createEventDispatcher } from "svelte";
  import { shown } from "../stores";
  export let user;
  export let commentid;
  export let comment;

  const dispatch = createEventDispatcher();

  const likeComment = async () => {
    if (!$shown) {
      return ($shown = true);
    }
    const submit = await fetch(
      `http://localhost:5000/like/likeComment/${user.username}/${commentid}`
    );
    const data = await submit.json();
    comment = data;
  };
  const dislikeComment = async () => {
    if (!$shown) {
      return ($shown = true);
    }
    const submit = await fetch(
      `http://localhost:5000/like/dislikeComment/${user.username}/${commentid}`
    );
    const data = await submit.json();
    comment = data;
  };

  const submitSubComment = async () => {
    const subComment = document.getElementById("textArea").value;
    const submit = await fetch("http://localhost:5000/comment/newSubComment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        avatar: user.avatar,
        subComment: subComment,
        commentId: comment._id,
      }),
    });
    const data = await submit.json();
    dispatch("submitSubComment", data);
    const subDivSel = document.getElementById("comment-div");
    subDivSel.remove();
  };

  const openSubmit = (e) => {
    if (!$shown) {
      return ($shown = true);
    }
    const subDivSel = document.getElementById("comment-div");
    if (document.body.contains(subDivSel)) {
      subDivSel.remove();
    }
    const subDiv = document.createElement("div");
    subDiv.id = "comment-div";
    subDiv.style.cssText = "display: flex;";
    const submitArea = document.createElement("textarea");
    submitArea.id = "textArea";
    const submitButton = document.createElement("button");

    subDiv.appendChild(submitArea);
    subDiv.appendChild(submitButton);

    const item = document.getElementById(e.currentTarget.id + "bar");

    submitButton.style.backgroundColor = "red";
    submitButton.innerHTML = "Gönder";
    submitArea.style.cssText = ` 
    resize: none;
    width: 90%;
    border-radius: 5px;
    height: 50px;
    background-color: inherit;
    max-height: 60px;
    color: inherit;
    border: 1px solid;`;

    item.after(subDiv);
    submitButton.onclick = submitSubComment;
    submitArea.focus();
  };
</script>

<div class="vote-wrapper" id={comment._id + "bar"}>
  <button on:click={likeComment} class="vote-button-up"
    ><svg 
    class= {comment.likes.includes(user.username) ? 'voted': ''}
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
    ><span>{comment.likes.length}</span></button
  >
  <button class="vote-button" on:click|preventDefault={dislikeComment}
    ><svg
    class={comment.dislikes.includes(user.username)? "voted": ""}
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
    ><span>{comment.dislikes.length}</span></button
  >
  <button
    class="vote-button"
    on:click|preventDefault={openSubmit}
    id={comment._id}
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
    <span class="vote-button">{comment.subComments.subComments.length}</span
    ><button />
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
  .vote-wrapper {
    display: flex;
    max-width: 650px;
    margin: auto;
  }
  span {
    margin-left: 4px;
    font-size: 12px;
  }

  img {
    margin: 2px;
    width: 14px;
    filter: invert(94%) sepia(0%) saturate(1574%) hue-rotate(185deg)
      brightness(114%) contrast(60%);
  }

  @media (max-width: 450px) {
  }
</style>
