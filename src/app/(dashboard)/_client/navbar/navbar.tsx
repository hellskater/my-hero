import { SheetMenu } from './sheet-menu';
import { ModeToggle } from './theme-toggle';
import { UserNav } from './user-nav';

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-[#f8f8df] dark:bg-stone-900">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
