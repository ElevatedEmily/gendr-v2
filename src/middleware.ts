export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/api/profile", "/profile"], // Protect these routes
};
