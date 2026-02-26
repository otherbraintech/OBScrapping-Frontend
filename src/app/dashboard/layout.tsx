import { Sidebar } from "@/components/dashboard/sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Bell, 
  Menu,
  User as UserIcon,
  Search,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-full relative bg-zinc-950">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>
      <main className="md:pl-72 flex flex-col min-h-screen">
        <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between">
          <div className="flex items-center gap-x-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r-0 w-72">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              OBS
            </h1>
          </div>
          <div className="flex-1 px-4 hidden md:block">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                placeholder="Buscar scrapes..." 
                className="w-full bg-zinc-900/50 border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-zinc-800 p-0 overflow-hidden ring-offset-zinc-950 focus-visible:ring-indigo-500">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-xs uppercase">
                      {session.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                    <p className="text-xs leading-none text-zinc-500">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                  <UserIcon className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                  <Settings className="mr-2 h-4 w-4" /> Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex-1 p-6 text-zinc-300">
          {children}
        </div>
      </main>
    </div>
  );
}
