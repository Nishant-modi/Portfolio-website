import dynamic from "next/dynamic";
//import Starter from "worlds/Starter";

const Starter = dynamic(import("worlds/Starter"), { ssr: false });

export default function StarterPage() {
  return <Starter />;
};