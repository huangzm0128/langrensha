import { Middleware } from "koa";

import {
    InitRoomRequest, InitRoomResponse
} from "../../../../werewolf-frontend/shared/httpMsg/InitRoomMsg";
import { Room } from "../../models/RoomModel";

const roomInit: Middleware = async (ctx) => {
  const roomNumber = ctx.get("RoomNumber");

  const room = Room.getRoom(roomNumber);

  const ret: InitRoomResponse = {
    status: 200,
    msg: "ok",
    data: {
      players: room.choosePublicInfo(),
      needingCharacters: room.needingCharacters,
    },
  };

  ctx.body = ret;
};

export default roomInit;
