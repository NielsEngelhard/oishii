import UserListCard from "../user/UserListCard"

interface Props {

}

const mockedUsers = [
    {
        id: 1,
        name: "Yuki Fotomoto",
        aboutMe: "Japaneasdasdasdecipe...",
        totalRecipes: 24,
        imgUrl: "/placeholder/user-placeholder.png"
    },    
    {
        id: 2,
        name: "Yuki Tanaka",
        aboutMe: "Japanese home cook passionate about traditional recipe...",
        totalRecipes: 22,
        imgUrl: "/placeholder/user-placeholder.png"
    }
]

export default function UserList({  }: Props) {
    return (
        <div className="flex flex-col gap-2 md:gap-4 w-full">
            {mockedUsers.map(user => (
                <UserListCard />
            ))}
        </div>
    )
}