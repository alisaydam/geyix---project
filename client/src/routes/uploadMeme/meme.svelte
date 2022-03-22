<script>
  import { initializeApp } from "firebase/app";
  import { compressAccurately } from "image-conversion";
  import { Circle3 } from "svelte-loading-spinners";

  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import { user } from "../../stores";
  const firebaseConfig = {
    apiKey: "AIzaSyBP8sZ78cKyQkMFYvxaSkP7jraJqw6S5Oo",
    authDomain: "geyix-4a345.firebaseapp.com",
    projectId: "geyix-4a345",
    storageBucket: "geyix-4a345.appspot.com",
    messagingSenderId: "864445954669",
    appId: "1:864445954669:web:a91f90589e005c7c035d64",
    measurementId: "G-FQ30MM7C9H",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  let avatar, fileinput, image, title;
  let spinner = false;
  const uploadToFireStorage = () => {
    const metadata = {
      contentType: "image/jpeg",
    };
    spinner = true;
    const storageRef = ref(storage, "images/" + image.name + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is" + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (dowloadURL) => {
          try {
            const submit = await fetch("http://localhost:5000/meme/newmeme", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                meme: dowloadURL,
                id: $user._id,
                title: title,
              }),
            });
            spinner = false;
            avatar = "";
            title = "";
            const data = await submit.json();
          } catch (error) {
            console.log(error);
          }
        });
      }
    );
  };

  const onFileSelected = async (e) => {
    image = e.target.files[0];
    const res = await compressAccurately(image, {
      size: 250,
      accuracy: 0.9,
      width: 600,
      orientation: 1,
    });
    image = new File([res], image.name, { lastModified: Date.now() });
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
    };
  };
</script>

<div id="app">
  <div class="preview">
    <h2>Meme Yükle</h2>
    <input class="title" type="text" bind:value={title} placeholder="Başlık" />
    {#if spinner}
      <div class="spinner">
        <Circle3 size="75" color="#FF3E00" unit="px" duration="1.5s" />
      </div>
    {/if}
    {#if avatar}
      <img class="avatar" src={avatar} alt="d" />
    {:else}
      <img class="avatar" src="/placeholder.png" alt="" />
    {/if}
  </div>
  <div class="upload-bar">
    <div class="item">
      <img
        class="upload"
        src="https://static.thenounproject.com/png/625182-200.png"
        alt=""
        on:click={() => {
          fileinput.click();
        }}
      />
      <div
        class="chan"
        on:click={() => {
          fileinput.click();
        }}
      >
        Dosya Seç
      </div>
      <input
        style="display:none"
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        on:change={(e) => onFileSelected(e)}
        bind:this={fileinput}
      />
    </div>

    <div class="item">
      {#if avatar && title}
        <a href="" on:click={uploadToFireStorage}>
          <img
            class="upload"
            src="https://static.thenounproject.com/png/625182-200.png"
            alt=""
          />
          <div />
          Yükle
        </a>
      {/if}
    </div>
  </div>
</div>

<style>
  input{
    color: inherit;
  }
   h2{
   font-size: x-large;
   font-weight: 500;
   line-height: 1.5;
 }
  .spinner {
    position: absolute;
    left: 140px;
    top: 130px;
  }
  .preview {
    display: flex;
    position: relative;
    flex-direction: column;
  }
  .upload-bar {
    display: flex;
    justify-content: center;
  }
  .item {
    text-align: center;
    margin: 10px;
  }
  .title {
    font-size: 15px;
    font-weight: 600;
  }
  #app {
    padding-top: 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .upload {
    width: 50px;
    cursor: pointer;
  }
  .chan {
    cursor: pointer;
  }
  .avatar {
    width: 350px;
  }
</style>
