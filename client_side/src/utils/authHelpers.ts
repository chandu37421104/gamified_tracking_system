import { jwtDecode } from 'jwt-decode'; // Use named import

/**
 * Decode the JWT token to extract the user ID.
 * @returns {string|null} userId if token is valid; otherwise, null.
 */
export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('token'); // Replace with your token storage mechanism
    if (!token) return null;

    try {
        const decoded: { id: string } = jwtDecode<{ id: string }>(token);
        return decoded.id; // Ensure `id` is part of the token payload
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

