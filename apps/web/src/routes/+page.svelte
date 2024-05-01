<script>
    import { get_users } from '@repo/db'
    let { data } = $props()
</script>

<h1>hello users</h1>

{#await get_users()}
    <p>loading...</p>
{:then users}
    <ul>
        {#each users as user}
            <li>{user.name}</li>
        {/each}
    </ul>
{:catch error}
    <p>{error.message}</p>
{/await}



<div>
    {#each data.cart as { id, quantity } (id)}
      <div>{id} - {quantity}</div>
    {/each}
</div>