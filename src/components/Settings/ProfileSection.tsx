
interface HeaderProps {
    userName: string;
    memberSince: string;  
    user_avatar: string | null;
}

export default function ProfileSection_Settings({ userName, memberSince, user_avatar }: HeaderProps) 
{
    const userInitial = userName.charAt(0).toUpperCase();

     //Formated Date (default 2025-10-20T15:58:44.557821+00:00)
    const formattedMemberSince = memberSince
        ? new Date(memberSince).toLocaleString("default", 
        {
            month: "long",
            year: "numeric",
        })
    : "—";

    return (
        <div>
            <div className="px-5 py-2 pb-4">
                <div className="flex items-center gap-4">
                    
                    {/* Avatar using first initial or PFP from google oauth*/}
                    {user_avatar ? (
                        <img
                        src={user_avatar}
                        alt="User Avatar"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-[1px] border-black"
                        />
                    ) : (
                        <div className="flex-shrink-0 aspect-square font-bebas w-14 h-14 bg-black rounded-full flex items-center justify-center text-4xl font-semibold text-white">
                        <span className="translate-y-[2px]">
                            {userInitial}
                        </span>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <h2 className="pl-0.5 text-sm font-semibold text-black">{userName}</h2>
                        <p className="text-xs font-normal text-black">Member since {formattedMemberSince}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}