import UserList from "./UserList";

interface Props {

}

export default function SearchFriendsSection({  }: Props) {
    return (
        <div className="w-full">
            <UserList />
        </div>
    )
}