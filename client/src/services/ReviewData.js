const baseUrl = "http://localhost:5000";

export async function createReview(review) {
  try {
    const response = await fetch(`${baseUrl}/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error("Error creating review");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

export async function getReviews(id) {
  try {
    const response = await fetch(`${baseUrl}/review/find/${id}`);
    if (!response.ok) {
      throw new Error("Failed to get reviews.");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get reviews.");
  }
}

export async function getUserName(id) {
  try {
    const response = await fetch(`${baseUrl}/user/getUserName/${id}`);
    if (!response.ok) {
      throw new Error("Failed to get user name.");
    }
    const data = await response.json();
    return data.user.name;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user name.");
  }
}
