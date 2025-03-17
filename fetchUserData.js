async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
