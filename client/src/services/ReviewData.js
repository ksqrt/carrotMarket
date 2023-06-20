const baseUrl = "http://localhost:5000";


export async function createReview(review) {

    console.log('여기오냐'+review);
    return (
      await fetch(`${baseUrl}/review/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(review),
      })
      ).json();
}
    