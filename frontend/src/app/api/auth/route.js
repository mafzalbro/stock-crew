export async function POST(req) {
  const { username, password } = await req.json();
  if (username === "admin" && password === "password") {
    return Response.json({ success: true, token: "mock-token" });
  }
  return Response.json({ success: false, message: "Invalid credentials" });
}
