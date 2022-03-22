<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { shown } from "../../stores";

  const jwt = $page.params.jwt;

  let message = "Lütfen bekleyiniz. İşleminiz gerçekleştiriliyor...";
  onMount(async () => {
    const res = await fetch(`http://localhost:5000/user/createUser/${jwt}`);
    const data = await res.json();
    if (data.success) {
      message = data.message;
      setTimeout(() => {
        $shown = true;
        goto("/");
      }, 1000);
    } else {
      message = data.error;
    }
  });
</script>

<div>
  <p>{message}</p>
</div>

<style>
  div {
    display: flex;
    height: 80vh;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  p {
    background-color: rgba(192, 179, 163, 0.2);
    padding: 50px;
    border-radius: 15px;
  }
</style>
