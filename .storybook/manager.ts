import { addons } from 'storybook/manager-api';
import { matsciStorybookTheme } from './matsciStorybookTheme';

addons.setConfig({
  theme: matsciStorybookTheme,
});
