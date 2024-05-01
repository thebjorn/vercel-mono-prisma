import { sql } from "@vercel/postgres";

export async function load({ locals }) {
  return {
    cart: await sql`SELECT * from carts where user_id=1`
  }
}