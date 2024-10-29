import { NextResponse } from "next/server";
import Client, { AddFaceEntityRequest } from "@alicloud/facebody20191230";
import * as Util from "@alicloud/tea-util";

export async function GET(req: Request) {
  // init client
  const client = new Client({
    endpoint: process.env.OSS_ENDPOINT!,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
    type: "access_key",
    regionId: "cn-hangzhou",
    toMap: () => new Util.RuntimeOptions({}),
  });
  // init runtimeObject
  //   const runtimeObject = new Util.RuntimeOptions({});
  // init request
  const addFaceEntityRequest = new AddFaceEntityRequest({
    dbName: "dbName",
    entityId: "entityId",
    labels: "labels",
  });
  // call api
  const res = await client.addFaceEntity(addFaceEntityRequest);
  return NextResponse.json("Internal server error", { status: 500 });
}
