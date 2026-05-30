import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { SideDrawerProps, SideDrawerSize } from '@/interfaces/ui.interfaces';

const sizeClassName: Record<SideDrawerSize, string> = {
  sm: 'sm:max-w-[min(480px,95vw)]',
  md: 'sm:max-w-[min(640px,95vw)]',
  lg: 'sm:max-w-[min(920px,95vw)]',
};

export function SideDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'lg',
  className,
  bodyClassName,
}: SideDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className={cn('flex h-full flex-col', sizeClassName[size], className)}>
        <DrawerHeader className="flex flex-row items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <DrawerTitle>{title}</DrawerTitle>
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </div>
          <DrawerClose
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </DrawerClose>
        </DrawerHeader>

        <div className={cn('flex-1 overflow-y-auto px-6 pb-6', bodyClassName)}>{children}</div>

        {footer ? <DrawerFooter className="flex-row justify-end gap-3">{footer}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  );
}
