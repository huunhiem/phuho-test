import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { GoogleDriveService } from '../../services/googleDriveService';
import { ShieldCheck, GraduationCap, School, BookOpen } from 'lucide-react';

export interface UserAvatarProps {
  user?: Partial<User> | null;
  avatarUrl?: string;
  name?: string;
  role?: UserRole | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  bordered?: boolean;
  alt?: string;
}

const SIZE_CONFIGS = {
  xs: {
    container: 'w-6 h-6 text-[10px]',
    icon: 'w-2.5 h-2.5',
    badge: 'w-2 h-2 -bottom-0.5 -right-0.5'
  },
  sm: {
    container: 'w-8 h-8 text-xs',
    icon: 'w-3 h-3',
    badge: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5'
  },
  md: {
    container: 'w-10 h-10 text-sm font-semibold',
    icon: 'w-4 h-4',
    badge: 'w-3 h-3 -bottom-0.5 -right-0.5'
  },
  lg: {
    container: 'w-14 h-14 text-lg font-bold',
    icon: 'w-5 h-5',
    badge: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5'
  },
  xl: {
    container: 'w-16 h-16 text-xl font-bold',
    icon: 'w-6 h-6',
    badge: 'w-4 h-4 bottom-0 right-0'
  },
  '2xl': {
    container: 'w-20 h-20 text-2xl font-bold',
    icon: 'w-7 h-7',
    badge: 'w-5 h-5 bottom-0 right-0'
  }
};

const ROLE_GRADIENTS: Record<string, { bg: string; text: string; ring: string; badgeIcon: any }> = {
  ADMIN: {
    bg: 'from-rose-600 to-red-700',
    text: 'text-white',
    ring: 'ring-rose-200',
    badgeIcon: ShieldCheck
  },
  PRINCIPAL: {
    bg: 'from-purple-600 to-indigo-700',
    text: 'text-white',
    ring: 'ring-purple-200',
    badgeIcon: School
  },
  DEPARTMENT_HEAD: {
    bg: 'from-indigo-600 to-blue-700',
    text: 'text-white',
    ring: 'ring-indigo-200',
    badgeIcon: BookOpen
  },
  TEACHER: {
    bg: 'from-emerald-600 to-teal-700',
    text: 'text-white',
    ring: 'ring-emerald-200',
    badgeIcon: GraduationCap
  },
  STUDENT: {
    bg: 'from-sky-500 to-indigo-600',
    text: 'text-white',
    ring: 'ring-sky-200',
    badgeIcon: GraduationCap
  }
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  avatarUrl: directUrl,
  name: directName,
  role: directRole,
  size = 'md',
  className = '',
  showBadge = false,
  bordered = true,
  alt
}) => {
  const rawUrl = directUrl || user?.avatarUrl || '';
  const fullName = directName || user?.fullName || 'Người dùng';
  const role = directRole || user?.role || 'STUDENT';
  const initial = (fullName.trim().charAt(0) || 'U').toUpperCase();

  const primaryDirectUrl = GoogleDriveService.getDriveDirectImageUrl(rawUrl);
  const fallbackThumbUrl = GoogleDriveService.getDriveThumbnailUrl(rawUrl, 300);
  const isDataUrl = rawUrl.startsWith('data:image/');

  const [currentSrc, setCurrentSrc] = useState<string>(primaryDirectUrl);
  const [attemptLevel, setAttemptLevel] = useState<number>(0); // 0 = primary, 1 = fallback thumb, 2 = failed
  const [isLoaded, setIsLoaded] = useState<boolean>(() => isDataUrl);

  useEffect(() => {
    const newDirect = GoogleDriveService.getDriveDirectImageUrl(rawUrl);
    setCurrentSrc(newDirect);
    setAttemptLevel(0);
    setIsLoaded(rawUrl.startsWith('data:image/'));
  }, [rawUrl]);

  const handleImageError = () => {
    if (attemptLevel === 0 && fallbackThumbUrl && fallbackThumbUrl !== currentSrc) {
      // Thử endpoint thumbnail Google Drive
      setAttemptLevel(1);
      setCurrentSrc(fallbackThumbUrl);
    } else {
      // Cả 2 đều lỗi -> chuyển sang hiện chữ cái đại diện
      setAttemptLevel(2);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const sizeCfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const roleCfg = ROLE_GRADIENTS[role] || ROLE_GRADIENTS.STUDENT;
  const isImageValid = Boolean(rawUrl && attemptLevel < 2);

  return (
    <div
      className={`relative inline-flex shrink-0 select-none items-center justify-center rounded-full overflow-visible ${className}`}
      title={`${fullName} (${role})`}
    >
      <div
        className={`relative ${sizeCfg.container} rounded-full overflow-hidden flex items-center justify-center transition-all ${
          bordered ? `ring-2 ${roleCfg.ring} shadow-2xs` : ''
        }`}
      >
        {isImageValid ? (
          <>
            <img
              src={currentSrc}
              alt={alt || fullName}
              onError={handleImageError}
              onLoad={handleImageLoad}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover rounded-full transition-opacity duration-200 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!isLoaded && (
              <div
                className={`absolute inset-0 bg-linear-to-br ${roleCfg.bg} ${roleCfg.text} flex items-center justify-center font-bold`}
              >
                {initial}
              </div>
            )}
          </>
        ) : (
          <div
            className={`w-full h-full bg-linear-to-br ${roleCfg.bg} ${roleCfg.text} flex items-center justify-center font-bold shadow-inner`}
          >
            {initial}
          </div>
        )}
      </div>

      {showBadge && (
        <span
          className={`absolute ${sizeCfg.badge} rounded-full ring-2 ring-white bg-emerald-500 shadow-xs`}
          title="Tài khoản hoạt động"
        />
      )}
    </div>
  );
};
