<script>
    import { get_users } from '@repo/db'
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
