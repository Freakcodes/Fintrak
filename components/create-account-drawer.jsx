"use client";

import React, { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });
  const {data:newAccount,error,fn:createAccountFn,loading:createAccountLoading}=useFetch(createAccount);

  useEffect(()=>{
   if(newAccount && !createAccountLoading ){
    toast.success("Account Created Successfully")
    reset();
    setOpen(false);
   } 
  },[newAccount,createAccountLoading])

  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])
  const onSubmitHandler = async (data) => {
    await createAccountFn(data);
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g, Main Account"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger className="w-[180px]" id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input
                id="initialBalance"
                placeholder="0.0"
                type="number"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>
            <div className="space-y-2 flex justify-between items-center rounded-lg">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium cursor-pointer"
                >
                  Account Type
                </label>
                <p className="text-muted-foreground text-sm ">
                  This account will be set as default{" "}
                </p>
              </div>

              <Switch
                id="isDefault"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}
              />
            </div>
            <div className="flex  gap-4 w-[50%]">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1 cursor-pointer">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1 cursor-pointer" disabled={createAccountLoading}>
                {
                createAccountLoading?<Loader2 className="mr-2 h-4 w-4 animate-spin">Creating...</Loader2>:"Create Account"
                }
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
