import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CardSettingsSectionProps {
  orientation: 'portrait' | 'landscape';
  onChange: (value: 'portrait' | 'landscape') => void;
  cardNameMode: 'default' | 'none';
  onCardNameModeChange: (mode: 'default' | 'none') => void;
  spacingMode: 'default' | 'compact';
  onSpacingModeChange: (mode: 'default' | 'compact') => void;
  cardSizeMode: 'default' | 'small';
  onCardSizeModeChange: (mode: 'default' | 'small') => void;
}

export default function CardSettingsSection({ orientation, onChange, cardNameMode, onCardNameModeChange, spacingMode, onSpacingModeChange, cardSizeMode, onCardSizeModeChange }: CardSettingsSectionProps) {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  return (
    <Box sx={{ my: 2, p: 2, bgcolor: 'rgba(227,240,255,0.24)', borderRadius: 4, border: '1.5px solid #e3f0ff' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1976d2', mb: 1, fontFamily: 'Heebo, Varela Round, Arial, sans-serif', fontSize: 18 }}>
        הגדרות קלפים
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexDirection: 'row' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Heebo, Varela Round, Arial, sans-serif' }}>צורת קלף:</Typography>
        <ToggleButtonGroup
          value={orientation}
          exclusive
          onChange={(_, value) => value && onChange(value)}
          color="primary"
          sx={{ gap: 1, bgcolor: 'transparent', borderRadius: 99, boxShadow: '0 2px 12px #1976d244', overflow: 'hidden' }}
        >
          {[{ value: 'portrait', label: 'אורך' }, { value: 'landscape', label: 'רוחב' }].map((item, idx, arr) => (
            <ToggleButton
              key={item.value}
              value={item.value}
              sx={{
                fontWeight: 700,
                fontFamily: 'Heebo, Varela Round, Arial, sans-serif',
                px: 4,
                py: 1.2,
                borderRadius:
                  idx === 0
                    ? '0 99px 99px 0'
                    : idx === arr.length - 1
                    ? '99px 0 0 99px'
                    : '0',
                fontSize: 16,
                border: 'none', // מסיר מסגרת כחולה
                bgcolor: orientation === item.value ? '#e3f0ff' : '#fff',
                color: orientation === item.value ? '#1976d2' : '#1976d2',
                boxShadow: orientation === item.value ? '0 2px 8px #1976d244' : 'none',
                mx: 0.5,
                transition: 'all 0.18s',
                '&:hover': { bgcolor: '#e3f0ff', borderColor: '#1976d2' },
              }}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexDirection: 'row' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Heebo, Varela Round, Arial, sans-serif' }}>שם מתחת לאימוג'י:</Typography>
        <ToggleButtonGroup
          value={cardNameMode}
          exclusive
          onChange={(_, value) => value && onCardNameModeChange(value)}
          color="primary"
          sx={{ direction: 'rtl', gap: 1, bgcolor: 'transparent', borderRadius: 99, boxShadow: '0 2px 12px #1976d244', overflow: 'hidden' }}
        >
          {[{ value: 'default', label: 'ברירת מחדל' }, { value: 'none', label: 'בלי שם' }].map((item, idx, arr) => (
            <ToggleButton
              key={item.value}
              value={item.value}
              sx={{
                fontWeight: 700,
                fontFamily: 'Heebo, Varela Round, Arial, sans-serif',
                px: 4,
                py: 1.2,
                borderRadius:
                  idx === 0
                    ? '0 99px 99px 0'
                    : idx === arr.length - 1
                    ? '99px 0 0 99px'
                    : '0',
                fontSize: 16,
                border: 'none', // מסיר מסגרת כחולה
                bgcolor: cardNameMode === item.value ? '#e3f0ff' : '#fff',
                color: cardNameMode === item.value ? '#1976d2' : '#1976d2',
                boxShadow: cardNameMode === item.value ? '0 2px 8px #1976d244' : 'none',
                mx: 0.5,
                transition: 'all 0.18s',
                '&:hover': { bgcolor: '#e3f0ff', borderColor: '#1976d2' },
              }}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexDirection: 'row' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Heebo, Varela Round, Arial, sans-serif' }}>מרווח קלפים</Typography>
        <ToggleButtonGroup
          value={spacingMode}
          exclusive
          onChange={(_, v) => v && onSpacingModeChange?.(v)}
          color="primary"
          sx={{ direction: 'rtl', gap: 1, bgcolor: 'transparent', borderRadius: 99, boxShadow: '0 2px 12px #1976d244', overflow: 'hidden' }}
        >
          {[{ value: 'default', label: 'ברירת מחדל' }, { value: 'compact', label: 'צפופה' }].map((item, idx, arr) => (
            <ToggleButton
              key={item.value}
              value={item.value}
              sx={{
                fontWeight: 700,
                fontFamily: 'Heebo, Varela Round, Arial, sans-serif',
                px: 4,
                py: 1.2,
                borderRadius:
                  idx === 0
                    ? '0 99px 99px 0'
                    : idx === arr.length - 1
                    ? '99px 0 0 99px'
                    : '0',
                fontSize: 16,
                border: 'none', // מסיר מסגרת כחולה
                bgcolor: spacingMode === item.value ? '#e3f0ff' : '#fff',
                color: spacingMode === item.value ? '#1976d2' : '#1976d2',
                boxShadow: spacingMode === item.value ? '0 2px 8px #1976d244' : 'none',
                mx: 0.5,
                transition: 'all 0.18s',
                '&:hover': { bgcolor: '#e3f0ff', borderColor: '#1976d2' },
              }}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexDirection: 'row' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, fontFamily: 'Heebo, Varela Round, Arial, sans-serif' }}>גודל קלף</Typography>
        <ToggleButtonGroup
          value={cardSizeMode}
          exclusive
          onChange={(_, v) => v && onCardSizeModeChange?.(v)}
          color="primary"
          sx={{ direction: 'rtl', gap: 1, bgcolor: 'transparent', borderRadius: 99, boxShadow: '0 2px 12px #1976d244', overflow: 'hidden' }}
        >
          {[{ value: 'default', label: 'רגיל' }, { value: 'small', label: 'קטנה' }].map((item, idx, arr) => (
            <ToggleButton
              key={item.value}
              value={item.value}
              sx={{
                fontWeight: 700,
                fontFamily: 'Heebo, Varela Round, Arial, sans-serif',
                px: 4,
                py: 1.2,
                borderRadius:
                  idx === 0
                    ? '0 99px 99px 0'
                    : idx === arr.length - 1
                    ? '99px 0 0 99px'
                    : '0',
                fontSize: 16,
                border: 'none', // מסיר מסגרת כחולה
                bgcolor: cardSizeMode === item.value ? '#e3f0ff' : '#fff',
                color: cardSizeMode === item.value ? '#1976d2' : '#1976d2',
                boxShadow: cardSizeMode === item.value ? '0 2px 8px #1976d244' : 'none',
                mx: 0.5,
                transition: 'all 0.18s',
                '&:hover': { bgcolor: '#e3f0ff', borderColor: '#1976d2' },
              }}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
