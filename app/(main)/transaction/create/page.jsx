import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/lib/data/categories';
import React from 'react'
import AddTransactionForm from '../_components/add-transaction-form';
import { get } from 'react-hook-form';
import { getTransaction } from '@/actions/transaction';

const AddTransactionPage = async({searchParams}) => {
    const editId=searchParams?.edit;
    
    let initialData=null;

    if(editId){
      const transaction=await getTransaction(editId);
      initialData=transaction;
    }
    const accounts=await getUserAccounts();

  return (
    <div className='max-w-3xl mx-auto px-5'>
        <h1 className='text-5xl gradient-title mb-8 '>
            Add Transactions
        </h1>

        <AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={!!editId} initialData={initialData} />
    </div>

  )
}

export default AddTransactionPage