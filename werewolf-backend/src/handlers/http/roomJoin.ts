import { Middleware } from "koa";

import {
    JoinRoomRequest, JoinRoomResponse
} from "../../../../werewolf-frontend/shared/httpMsg/JoinRoomMsg";
import { Events } from "../../../../werewolf-frontend/shared/WSEvents";
import { RoomJoinMsg } from "../../../../werewolf-frontend/shared/WSMsg/RoomJoin";
import io from "../../index";
import { Player } from "../../models/PlayerModel";
import { Room } from "../../models/RoomModel";

const roomJoin: Middleware = async (ctx) => {
  const req = ctx.request.body as JoinRoomRequest;
  const { name, password, roomNumber } = req;

  const room = Room.getRoom(roomNumber);

  const player = room.playerJoin(name, password);

  const ret: JoinRoomResponse = {
    status: 200,
    msg: "ok",
    data: {
      ID: player._id,
      index: player.index,
      needingCharacters: room.needingCharacters,
    },
  };

  const roomJoinMsg: RoomJoinMsg = room.choosePublicInfo();

  io.to(roomNumber).emit(Events.ROOM_JOIN, roomJoinMsg);

  if (roomJoinMsg.length === room.needingCharacters.length) {
    console.log("#game being");

    ret.data.open = true;
    // assign characters
    const needingCharacters = [...room.needingCharacters];
    const promises = [];
    for (let p of room.players) {
      const index = Math.floor(
        Math.random() * needingCharacters.length
      );
      const character = room.needingCharacters.splice(index, 1)[0];

      p.character = character;
      switch (character) {
        case "GUARD":
          p.characterStatus = {
            protects: [],
          };
          break;
        case "HUNTER":
          p.characterStatus = {
            canShoot: false,
            shootAt: {
              day: -1,
              player: -1,
            },
          };
          break;
        case "SEER":
          p.characterStatus = {
            checks: [],
          };
          break;
        case "WEREWOLF":
          p.characterStatus = {
            wantToKills: [],
          };
          break;
        case "WITCH":
          p.characterStatus = {
            POISON: { usedDay: -1, usedAt: -1 },
            MEDICINE: { usedDay: -1, usedAt: -1 },
          };
          break;
        case "VILLAGER":
          p.characterStatus = {};
        default:
          break;
      }
    }
    io.to(roomNumber).emit(Events.GAME_BEGIN);
  }

  ctx.body = ret;
};

export default roomJoin;
