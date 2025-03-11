import { NextResponse } from "next/server";
import User from "@/lib/modals/user";
import connect from "@/lib/db"
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async(request: Request) =>{
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId || Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message: "Invalid user id"}), {status: 400})
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse(JSON.stringify({message: "User not found"}), {status: 404})
        }

        const categories = await Category.find(
            {
                user: new Types.ObjectId(userId)
            }
        )
        return new NextResponse(JSON.stringify(categories), {status: 200})

    } catch (error: any) {
        return new NextResponse("Error fetching users" + error.message, { status: 500 });
    }
}