import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  isInitialActive?: boolean;
  isLoggedIn: boolean;
  initialCount: number;
  onActivate: () => void; // 활성화 시 실행할 함수
  onDeactivate: () => void; // 비활성화 시 실행할 함수
}

export const LikeButton: React.FC<ButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  initialCount,
  onActivate,
  onDeactivate,
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);
  const [count, setCount] = useState(initialCount);
  const router = useRouter();

  useEffect(() => {
    setIsActive(isInitialActive);
    setCount(initialCount);
  }, [isInitialActive, initialCount]);

  const handleClick = async () => {
    if (!isLoggedIn) return;

    setIsActive((prev) => !prev);
    setCount((prev) => (isActive ? prev - 1 : prev + 1)); // UI 즉시 반영

    if (isActive) {
      await onDeactivate(); // 👍 취소
    } else {
      await onActivate(); // 👍 활성화
    }

    router.refresh(); // 서버 데이터 동기화
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        disabled={!isLoggedIn}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
          isActive
            ? 'bg-blue-500 text-white'
            : 'bg-white text-black border-gray-300'
        } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
      >
        👍
      </button>
      <span className="ml-2 text-lg">{count}</span> {/* 즉시 반영된 숫자 */}
    </div>
  );
};

export const DislikeButton: React.FC<ButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  initialCount,
  onActivate,
  onDeactivate,
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);
  const [count, setCount] = useState(initialCount);
  const router = useRouter();

  useEffect(() => {
    setIsActive(isInitialActive);
    setCount(initialCount);
  }, [isInitialActive, initialCount]);

  const handleClick = async () => {
    if (!isLoggedIn) return;

    setIsActive((prev) => !prev);
    setCount((prev) => (isActive ? prev - 1 : prev + 1)); // UI 즉시 반영

    if (isActive) {
      await onDeactivate(); // 👎 취소
    } else {
      await onActivate(); // 👎 활성화
    }

    router.refresh(); // 서버 데이터 동기화
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        disabled={!isLoggedIn}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
          isActive
            ? 'bg-red-500 text-white'
            : 'bg-white text-black border-gray-300'
        } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}`}
      >
        👎
      </button>
      <span className="ml-2 text-lg">{count}</span> {/* 즉시 반영된 숫자 */}
    </div>
  );
};

interface BaseButtonProps {
  isInitialActive?: boolean;
  isLoggedIn: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  icon: string;
  activeColor: string;
  inactiveColor: string;
}

const AgreeButtonBase: React.FC<BaseButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  onActivate,
  onDeactivate,
  icon,
  activeColor,
  inactiveColor,
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);
  const router = useRouter();

  const handleClick = async () => {
    if (!isLoggedIn) return;

    setIsActive((prev) => !prev);

    if (isActive) {
      await onDeactivate();
    } else {
      await onActivate();
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isLoggedIn}
      className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
        isActive ? activeColor : inactiveColor
      } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
};

export const AgreeButton: React.FC<
  Omit<BaseButtonProps, 'icon' | 'activeColor' | 'inactiveColor'>
> = (props) => (
  <AgreeButtonBase
    {...props}
    icon="👍"
    activeColor="bg-blue-500 text-white"
    inactiveColor="bg-white text-black border-gray-300"
  />
);

export const DisagreeButton: React.FC<
  Omit<BaseButtonProps, 'icon' | 'activeColor' | 'inactiveColor'>
> = (props) => (
  <AgreeButtonBase
    {...props}
    icon="👎"
    activeColor="bg-red-500 text-white"
    inactiveColor="bg-white text-black border-gray-300"
  />
);
