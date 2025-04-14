// utils/slugify.ts

/**
 * Creates a URL-friendly slug from a name and ID
 * @param nama The name to slugify
 * @param id The ID to append to the slug
 * @returns A URL-friendly slug
 */
export function slugify(nama: string, id: string | undefined) {
    if (!id) {
        console.error("Invalid ID provided to slugify function");
        return "invalid-kos";
    }
    
    // Ensure nama is a string
    const namaSafe = String(nama || "kos");
    
    // Create slug from name
    const nameSlug = namaSafe
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-") // Replace multiple hyphens with one
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    
    return `${nameSlug || "kos"}-${id}`;
}

/**
 * Extracts the ID from a slug
 * @param slug The slug to extract the ID from
 * @returns The extracted ID or null if none found
 */
export function extractIdFromSlug(slug: string) {
    if (!slug) return null;
    
    // Try to match a UUID pattern at the end of the slug
    const match = slug.match(/[0-9a-fA-F-]{36}$/);
    
    // If we can't find a UUID, try to match any alphanumeric characters at the end
    // This serves as a fallback if the ID format is not a UUID
    if (!match) {
        const fallbackMatch = slug.match(/-([a-zA-Z0-9]+)$/);
        return fallbackMatch ? fallbackMatch[1] : null;
    }
    
    return match ? match[0] : null;
}