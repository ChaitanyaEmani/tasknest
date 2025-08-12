
import { NextResponse } from "next/server";
import { ConnectDB } from "../lib/config/db";
import TodoModel from "../lib/models/TodoModel";

const LoadDB = async ()=>{
    await ConnectDB();
}

LoadDB();

export async function GET(request) {
    const todos = await TodoModel.find();
    return NextResponse.json({todos: todos});
}

export async function POST(request) {
    const {title,description} = await request.json();

    await TodoModel.create({
        title,
        description
    })
  return NextResponse.json({ message: "Todo Created"});
}

export async function DELETE(request) {
    const mongoId = await request.nextUrl.searchParams.get("mongoId");
    await TodoModel.findByIdAndDelete({ _id: mongoId });
    return NextResponse.json({ message: "Todo Deleted" });
}

export async function PUT(request) {
    const mongoId = await request.nextUrl.searchParams.get("mongoId");

    await TodoModel.findByIdAndUpdate(
        { _id: mongoId },
        { isCompleted: true }
    );
    return NextResponse.json({ message: "Todo Completed" });
}
    