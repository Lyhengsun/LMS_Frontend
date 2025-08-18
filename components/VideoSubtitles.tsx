
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Captions } from 'lucide-react';

interface VideoSubtitlesProps {
  onSubtitleChange: (language: string | null) => void;
  currentSubtitle: string | null;
}

const subtitleOptions = [
  { label: 'Off', value: null },
  { label: 'English', value: 'en' },
  { label: 'Khmer (ខ្មែរ)', value: 'km' },
];

export const VideoSubtitles = ({ onSubtitleChange, currentSubtitle }: VideoSubtitlesProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 transition-all duration-200"
        >
          <Captions className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border-white/20">
        {subtitleOptions.map((option) => (
          <DropdownMenuItem
            key={option.value || 'off'}
            onClick={() => onSubtitleChange(option.value)}
            className={`text-white hover:bg-white/20 cursor-pointer ${
              currentSubtitle === option.value ? 'bg-white/20' : ''
            }`}
          >
            {option.label}
            {currentSubtitle === option.value && (
              <span className="ml-2">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
