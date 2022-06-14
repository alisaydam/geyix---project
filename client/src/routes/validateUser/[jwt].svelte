<script context="module">
  export async function load({ params }) {
    console.log(params.jwt);
    const validateUser = await  fetch(`https://geyix.herokuapp.com/user/createUser/${params.jwt}`)
    const user = await validateUser.json()
    return {
      props: {
        user: user
      },
    };
  }
</script>

<script>
    export let user
  console.log(user);
</script>
