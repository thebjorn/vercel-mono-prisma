import { sql } from "@vercel/postgres";

export async function load({ locals }) {
  return {
    cart: await sql`SELECT * from public.carts`,
    dummy: ['hello', 'dummy']
  }
}