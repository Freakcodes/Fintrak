

import { Button } from "@/components/ui/button";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/account-card";
const DashboardPage = async() => {
  const accounts=await getUserAccounts();
  // console.log(accounts);
  return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

   <CreateAccountDrawer>
    <Card>
      <CardContent className="flex flex-col cursor-pointer text-muted-foreground justify-center items-center">
          <Plus className="h-10 w-10 mb-2"/>
          <p className="text-sm font-medium">Add new account</p>
      </CardContent>
    </Card>
  </CreateAccountDrawer>
  {
    accounts.length>0 &&
    accounts?.map((account)=>(
      <AccountCard key={account.id} account={account}/>
    ))
  }
  </div>
  );
};

export default DashboardPage;
