import { Middleware } from "koa";
import { createError } from "src/middleware/handleError";

import CharacterAct from "../../../../werewolf-frontend/shared/httpMsg/CharacterAct";
import { Player } from "../../models/PlayerModel";
import { Room } from "../../models/RoomModel";
import { status2Handler } from "./gameActHandlers";

const gameAct: Middleware = async (ctx) => {
  const req = ctx.request.body as CharacterAct;

  const roomNumber = ctx.get("RoomNumber");
  const token = ctx.get("Token");
  const room = Room.getRoom(roomNumber);

  const player = room.getPlayerById(token);

  const gameStatus = room.gameStatus?.[room.gameStatus.length - 1];
  // TODO check character

  ctx.body = await status2Handler[gameStatus]?.(
    room,
    player,
    req.target,
    ctx
  );
};

export default gameAct;
