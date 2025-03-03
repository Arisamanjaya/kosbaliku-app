// utils/slugify.ts
export function slugify(nama: string, id: string) {
    return `${nama.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${id}`;
}

export function extractIdFromSlug(slug: string) {
    const match = slug.match(/[0-9a-fA-F-]{36}$/); // match UUID di akhir slug
    return match ? match[0] : null;
}