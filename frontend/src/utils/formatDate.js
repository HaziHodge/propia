import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'd \'de\' MMMM \'de\' yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatStr, { locale: es });
};
