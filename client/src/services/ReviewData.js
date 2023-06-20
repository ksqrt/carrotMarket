const baseUrl = "http://localhost:5000";

export async function createReview(review2) {
  console.log(review2);
  
  return (
    await fetch(`${baseUrl}/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(review2),
    })
    ).json();
  }
