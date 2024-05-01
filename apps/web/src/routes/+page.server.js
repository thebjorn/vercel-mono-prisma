// import { sql } from "@vercel/postgres";

// export async function load({ locals }) {
//   return {
//     cart: await sql`SELECT * from carts`,
//   }
// }

import { get_users } from '@repo/db';


export async function load({ locals }) {
  return {
    users: await get_users(),
  }
}