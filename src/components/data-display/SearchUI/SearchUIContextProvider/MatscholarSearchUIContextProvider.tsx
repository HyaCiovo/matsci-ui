import type { SearchUIContainerProps } from '../types';
import { SearchUIContextProvider } from './SearchUIContextProvider';

export const MatscholarSearchUIContextProvider = (props: SearchUIContainerProps) => {
  return <SearchUIContextProvider {...props} />;
};
