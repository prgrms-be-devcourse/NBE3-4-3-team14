import { Meta, StoryObj } from '@storybook/react';
import ExpandableDrawer from './ExpandableDrawer';

const meta: Meta<typeof ExpandableDrawer> = {
  title: 'Components/ExpandableDrawer',
  component: ExpandableDrawer,
  argTypes: {
    className: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof ExpandableDrawer>;

export const Default: Story = {
  args: {
    children: <div className="p-4">This is an expandable drawer content</div>,
  },
};

export const CustomClassName: Story = {
  args: {
    className: 'bg-blue-500',
    children: <div className="p-4">This is a custom styled drawer</div>,
  },
};
