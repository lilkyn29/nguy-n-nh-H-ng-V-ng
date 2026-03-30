import { CalendarEvent } from './types';

export const internationalHolidays: Omit<CalendarEvent, 'id'>[] = [
  { title: "Tết Dương lịch", date: '2026-01-01', startTime: '00:00', endTime: '23:59', description: 'International holiday', isAnnual: true },
  { title: "Ngày lễ Tình nhân", date: '2026-02-14', startTime: '00:00', endTime: '23:59', description: 'International holiday', isAnnual: true },
  { title: "Ngày Quốc tế Phụ nữ", date: '2026-03-08', startTime: '00:00', endTime: '23:59', description: 'International holiday', isAnnual: true },
  { title: "Ngày Quốc tế Lao động", date: '2026-05-01', startTime: '00:00', endTime: '23:59', description: 'International holiday', isAnnual: true },
  { title: "Lễ hội Halloween", date: '2026-10-31', startTime: '00:00', endTime: '23:59', description: 'International holiday', isAnnual: true },
  { title: "Lễ Giáng sinh", date: '2026-12-25', startTime: '00:00', endTime: '23:59', description: 'International holiday', isAnnual: true },
];

export const vietnameseHolidays: Omit<CalendarEvent, 'id'>[] = [
  { title: "Ngày Giải phóng miền Nam", date: '2026-04-30', startTime: '00:00', endTime: '23:59', description: 'Vietnamese holiday', isAnnual: true },
  { title: "Ngày Quốc khánh", date: '2026-09-02', startTime: '00:00', endTime: '23:59', description: 'Vietnamese holiday', isAnnual: true },
];

export const lunarHolidays = [
  { title: "Tết Nguyên Đán", lunarDay: 1, lunarMonth: 1 },
  { title: "Tết Nguyên Tiêu", lunarDay: 15, lunarMonth: 1 },
  { title: "Giỗ Tổ Hùng Vương", lunarDay: 10, lunarMonth: 3 },
  { title: "Tết Thanh Minh", lunarDay: 3, lunarMonth: 3 },
  { title: "Tết Đoan Ngọ", lunarDay: 5, lunarMonth: 5 },
  { title: "Tết Trung Thu", lunarDay: 15, lunarMonth: 8 },
  { title: "Tết Táo Quân", lunarDay: 23, lunarMonth: 12 },
];
