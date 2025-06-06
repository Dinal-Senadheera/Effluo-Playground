async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return { id: data.id, name: data.fullName, email: data.contact.email };
}
