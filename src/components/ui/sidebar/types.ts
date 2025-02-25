
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarMenuButtonVariants = VariantProps<typeof buttonVariants>
