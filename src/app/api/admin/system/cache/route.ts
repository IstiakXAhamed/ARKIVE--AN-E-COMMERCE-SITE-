import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    // Strict Superadmin check for system operations
    if (session?.user?.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Superadmin access required" }, { status: 403 });
    }

    // Revalidate all paths
    revalidatePath("/", "layout");
    revalidatePath("/(shop)", "layout");
    revalidatePath("/admin", "layout");
    
    // If using tags
    // revalidateTag('products');
    
    console.log("System cache cleared by:", session.user.email);

    return NextResponse.json({ 
      success: true, 
      message: "System cache cleared and paths revalidated." 
    });
  } catch (error) {
    console.error("Cache clear error:", error);
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
