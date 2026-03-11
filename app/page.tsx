import { headers } from "next/headers";
import Game from "@/components/game";
import NameForm from "@/components/name-form";

const MOBILE_UA = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile/i;

export default async function Home() {
  const h = await headers();
  const userId = h.get("x-user-id");

  const ua = h.get("user-agent") ?? "";
  const isMobile = MOBILE_UA.test(ua);

  return (<>
    {userId ? <Game userId={userId} isMobile={isMobile} /> : <NameForm />}
  </>);
}
