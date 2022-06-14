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
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  let avatar,
    image,
    title = "";
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
          console.log(dowloadURL);
          try {
            const submit = await fetch(
              "https://geyix.herokuapp.com/meme/newmeme",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  meme: dowloadURL,
                  id: $user._id,
                  title: title,
                }),
              }
            );
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

<div class="container">
  <h2 class="page-title">Post yükle</h2>
  <div class="section-con">
    <img class="search-icon" src="/search.svg" alt="" />
    <!-- <a href="">
      <img class="arrow-icon" src="/arrow.svg" alt="" />
    </a> -->
    <input
      list="countrydata1"
      class="section-input"
      id="country1"
      name="country1"
      size="50"
      autocomplete="off"
    />
    <datalist id="countrydata1">
      <option>Funny</option>
      <option>Section 2</option>
      <option>Section 3</option>
      <option>Section 4</option>
      <option>Section 5</option>
      <option>Section 6</option>
      <option>Section 7</option>
    </datalist>
  </div>
  <div class="upload-con">
    <div class="title-con">
      <textarea
        class="title"
        maxlength="150"
        name=""
        id=""
        cols="30"
        bind:value={title}
        rows="3"
        placeholder="Başlk"
        contenteditable="true"
      />
      <span class="counter">
        {!title.length === 0 ? "s" : 150 - title.length}</span
      >
    </div>

    <div class="upload-card">
      {#if avatar}
        <img src={avatar} alt="" class="preview" />
      {:else}
        <img class="placeholder" src="/placeholder.png" alt="" />
      {/if}
      <span class="card-text">Dosya seç ve yükle</span>
      {#if avatar && title}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="file-input" on:click={uploadToFireStorage}>
          <div />
          Yükle
        </a>
      {:else}
        <input
          class="file-input"
          type="file"
          directory="false"
          accept=".jpg, .jpeg, .png, .gif"
          on:change={(e) => onFileSelected(e)}
        />
      {/if} 
    </div>
    <div class="tags-con">
      <input
        class="tags-input"
        type="text"
        placeholder="+ Tag eklemek ister misin? Her tagdan sonra virgül bırak"
      />
    </div>
  </div>
</div>
{#if spinner}
  <div class="spinner">
    <Circle3 size="75" color="#FF3E00" unit="px" duration="1.5s" />
  </div>
{/if}

<style>
  .container {
    padding: 32px;
  }
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .section-con {
    padding: 12px;
    border: 1px solid;
    width: 50%;
    border-radius: 10px;
    position: relative;
    margin: 16px 0;
  }
  .search-icon {
    position: absolute;
    width: 20px;
  }
  .arrow-icon {
    position: absolute;
    right: 10px;
    top: 20px;
    width: 15px;
  }
  .section-input {
    background: none;
    color: inherit;
    border: none;
    outline: none;
    width: 100%;
    font-size: 12px; 
    padding-left: 25px;
  }
  input::-webkit-calendar-picker-indicator {
    opacity: 100;
    cursor: pointer;
  }
  .title-con {
    width: 100%;
    padding: 8px 30px 0px 8px;
    border: 1px solid;
    border-radius: 10px;
    position: relative;
  }
  .title {
    background: none;
    width: 100%;
    border: none;
    resize: none;
    overflow: hidden;
    outline: none;
    color: inherit;
    font-size: 12px;
  }
  .counter {
    position: absolute;
    color: rgba(172, 168, 168, 0.5);
    top: 50%;
    transform: translateY(-50%);
    right: 2px;
  }
  .upload-con {
    border: 1px solid;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
  }
  .upload-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 16px;
    padding: 32px;
    width: 100%;
    border: 1px solid;
    border-radius: 10px;
  }
  .preview {
    width: 100%;
  }
  @media (max-width: 500px) {
    .preview {
      width: 120%;
    }
  }
  .placeholder {
    width: 70px;
  }
  .card-text {
    margin: 16px 0 16px;
  }
  .file-input::-webkit-file-upload-button {
    visibility: hidden;
  }
  .file-input {
    content: "Select some files";
    width: 225px;
    background: #0077ff;
    color: white;
    padding: 8px 25px;
    font-size: 12px;
    border-radius: 20px;
    letter-spacing: 1px;
    cursor: pointer;
    font-weight: bold;
    text-align: center;
    border: 1px solid transparent;
    text-indent: -50px;
  }
  .tags-con {
    padding: 12px;
    border: 1px solid;
    border-radius: 10px;
    position: relative;
    margin: 16px 0;
    width: 100%;
  }
  .tags-input {
    background: none;
    color: inherit;
    border: none;
    outline: none;
    width: 100%;
    font-size: 12px;
  }
</style>
