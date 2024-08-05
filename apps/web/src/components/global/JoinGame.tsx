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
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function JoinGame() {
  const router = useRouter();

  function joinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const inviteCode = formData.get("inviteCode") as string;

    router.push(`/game/${inviteCode}/?name=${name}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer">
          <h2 className="mb-3 text-2xl font-semibold">
            Join Game{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Enter the invite code to join a game. Let the best one to win the
            typing race!
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={joinGame}>
          <DialogHeader>
            <DialogTitle>Join Game</DialogTitle>
            <DialogDescription>
              Enter your nick name and a valid Invite Code here and Enjoy!. This
              name will be visible to all members in the Lobby.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inviteCode" className="text-right">
                Invite Code
              </Label>
              <Input
                id="inviteCode"
                name="inviteCode"
                placeholder="invite code here.."
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Join</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
