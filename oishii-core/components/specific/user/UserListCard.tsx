import { USER_PROFILE_ROUTE } from "@/app/routes";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Plus, UserMinus } from "lucide-react";
import Link from "next/link";

interface Props {

}

export default function UserListCard({  }: Props) {
    var mockedIsFriend = true;
    var mockedUserId = "22";

    return (
        <Link href={USER_PROFILE_ROUTE(mockedUserId)} target="_blank">
            <Card className="w-full flex flex-row justify-between">
                <div className="flex flex-row justify-center items-center gap-2">
                    {/* Avatar */}
                    <Avatar
                        size="lg"
                        src="/placeholder/user-placeholder.png"
                    />

                    {/* Name and metadata */}
                    <div className="flex flex-col">
                        <span className="font-semibold">Username</span>
                        <span className="text-muted">About me information blablabla</span>
                        <span className="text-muted text-xs">24 recipes</span>
                    </div>                
                </div>

                {/* Actions */}
                <div className="flex items-center">
                    {mockedIsFriend ? (
                        <Button
                            Icon={Plus}
                            text="Add friend"
                        />
                    ) : (
                        <Button
                            Icon={UserMinus}
                            text="Remove friend"
                            variant="skeleton"
                        />    
                    )}
                </div>
            </Card>
        </Link>
    )
}