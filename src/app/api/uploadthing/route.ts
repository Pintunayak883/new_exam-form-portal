// app/api/uploadthing/core/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // 🔥 config hata de, nahi chahiye ab
});
