<script>
  import {shown} from "../stores"

  $shown = false;

   
  export const show = () => {
    $shown = true;
  };
  export const hide = () => {
    $shown = false;
  };
</script>

<svelte:window 
on:keydown={e => {
    if(e.keyCode == 27){
        hide()
    }
}}
/>
{#if $shown}
  <div class="modal-wrapper">
      <div class="modal" on:click|stopPropagation>
          <button class="close-modal" on:click={()=>hide()}>X</button>
          <slot />
      </div>
  </div>
{/if}

<style>
   .close-modal{
    z-index: 1;
      position: absolute;
      right: 2px;
      top: 2px;
      width: 25px;
      height: 25px;
      border-radius: 20px;
      cursor: pointer;
  }
  .modal-wrapper {
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .modal{
      position: relative; 
  }

</style>
