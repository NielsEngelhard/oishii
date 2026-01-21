import SearchBar from "@/components/ui/SearchBar";
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
        <div className="w-full flex flex-col space-y-3 md:space-y-6">
            <SearchBar placeholder="Search your friends..." />
            <UserList />
        </div>
    )
}