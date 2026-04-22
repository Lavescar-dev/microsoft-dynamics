import * as FluentIcons from '@fluentui/react-icons';

export type EntityType =
  | 'lead'
  | 'opportunity'
  | 'case'
  | 'account'
  | 'contact'
  | 'quote'
  | 'order'
  | 'invoice'
  | 'queue'
  | 'activity'
  | 'product'
  | 'competitor'
  | 'knowledge'
  | 'campaign'
  | 'segment'
  | 'journey'
  | 'workorder';

export interface CommandDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline';
  intent: string;
}

export const getEntityCommands = (entityType: EntityType): CommandDefinition[] => {
  const common: CommandDefinition[] = [
    { id: 'assign', label: 'Assign', icon: FluentIcons.People24Regular, intent: 'assign' },
    { id: 'share', label: 'Share', icon: FluentIcons.Share24Regular, intent: 'share' },
    { id: 'delete', label: 'Delete', icon: FluentIcons.Delete24Regular, variant: 'destructive', intent: 'delete' },
  ];

  switch (entityType) {
    case 'lead':
      return [
        { id: 'qualify', label: 'Qualify', icon: FluentIcons.PersonAvailable24Regular, intent: 'qualify' },
        { id: 'disqualify', label: 'Disqualify', icon: FluentIcons.PersonProhibited24Regular, variant: 'destructive', intent: 'disqualify' },
        ...common,
      ];

    case 'opportunity':
      return [
        { id: 'closewon', label: 'Close as Won', icon: FluentIcons.CheckmarkCircle24Regular, intent: 'closewon' },
        { id: 'closelost', label: 'Close as Lost', icon: FluentIcons.DismissCircle24Regular, variant: 'destructive', intent: 'closelost' },
        { id: 'createquote', label: 'Create Quote', icon: FluentIcons.DocumentBulletList24Regular, intent: 'createquote' },
        ...common,
      ];

    case 'case':
      return [
        { id: 'resolve', label: 'Resolve', icon: FluentIcons.CheckmarkCircle24Regular, intent: 'resolve' },
        { id: 'route', label: 'Route', icon: FluentIcons.ArrowRouting24Regular, intent: 'route' },
        ...common,
      ];

    default:
      return common;
  }
};
