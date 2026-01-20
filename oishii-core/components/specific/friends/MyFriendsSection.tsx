import UserList from "./UserList";

interface Props {

}

const mockedFriends = [
    {
        name: "Yuki Tanaka",
        aboutMe: "Japanese home cook passionate about traditional recipe...",
        totalRecipes: 24,
        imgUrl: "/placeholder/user-placeholder.png"
    }
]

export default function MyFriendsSection({  }: Props) {
    return (
        <div className="w-full">
            <UserList />
        </div>
    )
}