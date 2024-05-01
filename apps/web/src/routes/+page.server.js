import { sql } from "@vercel/postgres";

export async function load({ locals }) {
  return {
    cart: await sql`SELECT * from CARTS where user_id='${locals.user}'`
  }
}