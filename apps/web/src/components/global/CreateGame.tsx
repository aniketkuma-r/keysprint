"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function CreateGame() {
  const router = useRouter();

  function createGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const inviteCode = uuidv4();
    router.push(`/game/${inviteCode}/?name=${name}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer">
          <h2 className="mb-3 text-2xl font-semibold">
            Create Game{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0  text-sm opacity-50">
            {`Create a game and invite your friends to join to you and race you to a typing sprint! you'll recieve a invite code once you create a game. You will be Host of the game and will be able to start the game.`}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={createGame}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Enter your nick name here. This name will be visible to all
              members in the Lobby.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                placeholder="nick name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Game</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
