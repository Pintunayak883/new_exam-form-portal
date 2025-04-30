import { createUploadthing, type FileRouter } from "uploadthing/server";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      try {
        const cookieHeader = req.headers.get("cookie") || "";
        const cookies = parse(cookieHeader);
        const token = cookies.token;

        if (!token) {
          console.error("Token missing in cookies");
          throw new Error("Unauthorized");
        }

        console.log("token mil gaya:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return { userId: (decoded as any).id };
      } catch (err) {
        console.error("Middleware error:", err);
        throw err;
      }
    })

    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded by:", metadata.userId);
      console.log("URL is:", file.url);

      // Yahan tu apne DB mein file.url save kar sakta hai
    }),
} satisfies FileRouter;
