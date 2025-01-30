import type { Todo, TodoStatus } from '@cursor-rules-todoapp/common';
import { Button, Card, CardContent, CardFooter, CardHeader } from '@cursor-rules-todoapp/ui';
import { cn } from '@cursor-rules-todoapp/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

const MotionButton = motion(Button);

interface TodoCardProps {
  todo: Todo;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: TodoStatus) => void;
  'data-testid'?: string;
}

export const TodoCard = ({
  todo,
  onUpdateTitle,
  onUpdateStatus,
  'data-testid': testId,
}: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTitle(todo.id, title);
    setIsEditing(false);
  };

  const isCompleted = todo.status === 'completed';

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <motion.div
      data-testid={testId}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isCompleted ? [1, 1.02, 1] : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        scale: {
          times: [0, 0.2, 1],
          ease: 'easeOut',
        },
      }}
    >
      <Card
        className={cn(
          'rounded-lg transition-colors duration-200',
          isCompleted && 'bg-gray-50 dark:bg-gray-800/50'
        )}
      >
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
                  onFocus={(e) => e.target.select()}
                  aria-label="タスクのタイトルを編集"
                />
              </form>
            ) : (
              <motion.button
                type="button"
                onClick={() => setIsEditing(true)}
                onKeyDown={(e) => handleKeyDown(e, () => setIsEditing(true))}
                className={cn(
                  'w-full text-left hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm p-1',
                  isCompleted && 'line-through text-gray-500 dark:text-gray-400'
                )}
                aria-label={`タスク「${todo.title}」を編集`}
                whileTap={{ scale: 0.95 }}
              >
                {todo.title}
              </motion.button>
            )}
          </h3>
        </CardHeader>

        {todo.description && (
          <CardContent>
            <p className={cn('text-gray-600 dark:text-gray-400', isCompleted && 'line-through')}>
              {todo.description}
            </p>
          </CardContent>
        )}

        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <div>
              <MotionButton
                variant={isCompleted ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onUpdateStatus(todo.id, 'completed')}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) =>
                  handleKeyDown(e, () => onUpdateStatus(todo.id, 'completed'))
                }
                disabled={isCompleted}
                className={cn(
                  'rounded-lg transition-colors duration-200',
                  isCompleted &&
                    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                )}
                aria-label={isCompleted ? 'タスク完了済み' : 'タスクを完了にする'}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                        scale: { duration: 0.2 },
                        rotate: { duration: 0.3 },
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </MotionButton>
            </div>
            <div>
              <MotionButton
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(todo.id, 'in-progress')}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) =>
                  handleKeyDown(e, () => onUpdateStatus(todo.id, 'in-progress'))
                }
                disabled={todo.status === 'in-progress'}
                className="rounded-lg"
                aria-label={
                  todo.status === 'in-progress' ? '進行中のタスク' : 'タスクを進行中にする'
                }
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <X className="h-4 w-4" />
              </MotionButton>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(todo.createdAt).toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
