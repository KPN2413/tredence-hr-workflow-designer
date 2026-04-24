import { NextResponse } from "next/server";
import { automationActions } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({ data: automationActions });
}
