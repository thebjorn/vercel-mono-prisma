<script>
    // import { get_users } from '@repo/db'
    let { data } = $props()
</script>

<h1>hello users</h1>

<ul>
    {#each data.users as user}
        <li>{user.name}</li>
    {/each}
</ul>

<!-- {#await get_users()}
    <p>loading...</p>
{:then users}
    <ul>
        {#each users as user}
            <li>{user.name}</li>
        {/each}
    </ul>
{:catch error}
    <p>{error.message}</p>
{/await} -->

<!-- <div>
    {#each data.cart.rows as {name, user_id} (name) }
        <div>{user_id} - {name}</div>
    {/each}
</div> -->