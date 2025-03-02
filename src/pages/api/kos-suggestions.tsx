import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;

    const { data, error } = await supabase
        .from("kos")
        .select("kos_id, kos_nama, kos_alamat")
        .ilike("kos_nama", `%${query}%`)
        .limit(5);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ kos: data });
}
