import { IUserTeaser } from "@/models/user-models"
import UserListCard from "../user/UserListCard"

interface UserWithFriendStatus extends IUserTeaser {
    isFriend: boolean;
}

interface Props {
    users: UserWithFriendStatus[];
    onFriendStatusChange?: () => void;
}

export default function UserList({ users, onFriendStatusChange }: Props) {
    if (users.length === 0) {
        return (
            <div className="text-center text-muted py-8">
                No users found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 md:gap-4 w-full">
            {users.map(user => (
                <UserListCard
                    key={user.id}
                    user={user}
                    isFriend={user.isFriend}
                    onFriendStatusChange={onFriendStatusChange}
                />
            ))}
        </div>
    )
}