import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/button';
import { Card, CardContent, CardFooter, CardHeader } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <CardContent>Basic card content</CardContent>,
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <CardHeader>Card Header</CardHeader>
        <CardContent>Card content with header</CardContent>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    children: (
      <>
        <CardContent>Card content with footer</CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const CompleteCard: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Task Title</h3>
          <p className="text-sm text-muted-foreground">Created: 2024-02-20</p>
        </CardHeader>
        <CardContent>
          <p>This is a complete card example with header, content, and footer.</p>
          <p className="mt-2">It demonstrates a typical task card layout.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Complete</Button>
        </CardFooter>
      </>
    ),
  },
};
