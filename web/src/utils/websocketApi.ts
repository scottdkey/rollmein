import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket"


export const useGroupWebsocket =(groupId: string) => {
  return useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}/wsGroup/${groupId}`)
}