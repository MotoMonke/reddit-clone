import UserPage from "@/app/ui/components/user/userPage";
export default async function Page({ params }: { params: Promise<{ id: number }> }){
    const userId = (await params).id;
    return(
        <UserPage userId={userId}/>
    )
}