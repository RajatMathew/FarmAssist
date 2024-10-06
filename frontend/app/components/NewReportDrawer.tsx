import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";

interface NewReportDrawerProps {
  submitCount: number;
  setSubmitCount: (value: number) => void;
}

export default function NewReportDrawer({
  submitCount,
  setSubmitCount,
}: NewReportDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleClose = () => {
    setOpen(false);
    setSubmitCount(submitCount + 1);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>New Report</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New report</DialogTitle>
            <DialogDescription>
              You can reports like pest attacks, diseases, and more here.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onClose={handleClose} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>New Report</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>New report</DialogTitle>
          <DialogDescription>
            You can reports like pest attacks, diseases, and more here.
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm onClose={handleClose} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  onClose,
}: React.ComponentProps<"form"> & { onClose: () => void }) {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // Assuming you have an image field
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token"); // Assuming the JWT is stored in localStorage

    const data = {
      userId,
      title,
      description,
      image,
      area: "Kerala",
    };

    try {
      const response = await fetch(`${BACKEND_URL}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle success (e.g., show a success message, clear the form, etc.)
      console.log("Report submitted successfully");
      onClose(); // Close the modal/drawer
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <form className={`${className}`} onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2 mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          rows={10}
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2 mt-4">
        <Label className="hidden" htmlFor="image">
          Image
        </Label>
        <Input
          type="text"
          id="image"
          name="image"
          value={image}
          className="hidden"
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <Button className="w-full" type="submit">
        Submit
      </Button>
    </form>
  );
}
