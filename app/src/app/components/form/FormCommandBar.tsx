import * as React from 'react';
import { ArrowLeft24Regular, MoreHorizontal24Regular } from '@fluentui/react-icons';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { getEntityCommands, type EntityType } from './EntityConfig';
import { useLocale } from '../../contexts/LocaleContext';

interface FormCommandBarProps {
  onBack?: () => void;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
  entityType?: EntityType;
  entityId?: string;
  onCommand?: (intent: string, entityId?: string) => void;
  showSaveActions?: boolean;
  isDirty?: boolean;
  onSave?: () => void;
  onSaveAndClose?: () => void;
}

export function FormCommandBar({
  onBack,
  backLabel = 'Back',
  children,
  className,
  entityType,
  entityId,
  onCommand,
  showSaveActions = false,
  isDirty = false,
  onSave,
  onSaveAndClose,
}: FormCommandBarProps) {
  const { tr } = useLocale();
  const entityCommands = entityType ? getEntityCommands(entityType) : [];
  const primaryCommands = entityCommands.slice(0, 4);
  const overflowCommands = entityCommands.slice(4);

  const handleCommand = (intent: string) => {
    onCommand?.(intent, entityId);
  };

  return (
    <div className={cn('bg-white border-b border-gray-200 px-4 py-2.5', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {onBack ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft24Regular className="w-4 h-4 mr-2" />
                {tr(backLabel)}
              </Button>
              <div className="h-5 w-px bg-gray-200 mx-1" />
            </>
          ) : null}
          {children}
        </div>

        {entityType && entityCommands.length > 0 ? (
          <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
            {showSaveActions ? (
              <>
                <Button variant="default" size="sm" onClick={onSave} disabled={!isDirty}>
                  {tr('Save')}
                </Button>
                <Button variant="outline" size="sm" onClick={onSaveAndClose} disabled={!isDirty}>
                  {tr('Save & Close')}
                </Button>
              </>
            ) : null}
            {primaryCommands.map((command) => (
              <Button
                key={command.id}
                variant={command.variant ?? 'default'}
                size="sm"
                onClick={() => handleCommand(command.intent)}
              >
                <command.icon className="w-4 h-4 mr-2" />
                {tr(command.label)}
              </Button>
            ))}

            {overflowCommands.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal24Regular className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {overflowCommands.map((command) => (
                    <DropdownMenuItem
                      key={command.id}
                      onClick={() => handleCommand(command.intent)}
                    >
                      <command.icon className="w-4 h-4 mr-2" />
                      {tr(command.label)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
