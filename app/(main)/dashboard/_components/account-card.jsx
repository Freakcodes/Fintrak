import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
const AccountCard = ({account}) => {
    const {name,type,balance,id,isDefault}=account;

  return (
    <Link href={'/account/id'} >
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
          {/* <CardAction>Card Action</CardAction> */}
          <Switch/>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0)+type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className=''>
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Income
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default AccountCard;
