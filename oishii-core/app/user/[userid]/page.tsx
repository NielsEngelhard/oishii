import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import NarrowPageWrapper from "@/components/ui/layout/NarrowPageWrapper";
import Statistic from "@/components/ui/Statistic";
import { Calendar, ChefHat, Heart, User, Users } from "lucide-react";

export default function UserProfilePage() {
    return (
        <NarrowPageWrapper>
            <Card className="space-y-6">
                <div className="flex gap-4 items-center">
                    <Avatar
                        size="xl"
                        src="/placeholder/user-placeholder.png"
                    />

                    <div className="flex flex-col">
                        <h1>Username</h1>
                        <p>About me bla bla bla bla bla bla bla bla bla bla bla</p>
                        <div>
                            <Button
                                Icon={User}
                                text="Add Friend"
                                size="sm"
                            />                            
                        </div>
                    </div>
                </div>

                <Divider />

                {/* // TODO currently this align badly and does not look pretty. Make this more pretty to look at, but subtle! */}
                <div className="grid grid-cols-4">
                        <Statistic
                            Icon={ChefHat}
                            label="Recipes created"
                            value={`10`}
                            variant="primary"
                        />

                        <Statistic
                            Icon={Heart}
                            label="Recipes liked"
                            value={"20"}
                            variant="secondary"
                        />

                        <Statistic
                            Icon={Users}
                            label="Friends"
                            value="20"
                            variant="default"
                        />

                        <Statistic
                            Icon={Calendar}
                            label="Joined"
                            value={"12 jan 2000"}
                            variant="accent"
                        />
                </div>
            </Card>
        </NarrowPageWrapper>
    )
}