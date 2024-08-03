"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";

export function CardWithForm({ gameId }: { gameId: string }) {
  const router = useRouter();

  function joinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    router.push(`/game/${gameId}/?name=${name}`);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-96">
        <form onSubmit={joinGame}>
          <CardHeader>
            <CardTitle>Join Name</CardTitle>
            <CardDescription>
              Enter your nick name here and Enjoy!. This name will be visible to
              all members in the Lobby.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  Name
                </Label>
                <Input id="name" name="name" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Join</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
