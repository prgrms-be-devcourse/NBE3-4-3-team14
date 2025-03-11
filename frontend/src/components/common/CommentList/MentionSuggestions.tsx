import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { Button } from '@/components/ui/button';

interface MentionSuggestionsProps {
  users: UserDataResponseDto[];
  onSelect: (user: UserDataResponseDto) => void;
}

export default function MentionSuggestions({
  users,
  onSelect,
}: MentionSuggestionsProps) {
  if (users.length === 0) return null;

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto w-full mt-1"
      style={{
        top: '100%',
        left: 0,
      }}
    >
      <div className="p-2 space-y-1">
        {users.map((user, index) => (
          <Button
            key={`mention-${user.userid}-${user.nickname}-${index}`}
            variant="ghost"
            className="w-full justify-start text-sm hover:bg-gray-100"
            onClick={() => onSelect(user)}
          >
            <div className="flex items-center gap-2">
              {user.profileImage && (
                <img
                  src={user.profileImage}
                  alt={user.nickname}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>{user.nickname}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
