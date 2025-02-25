
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

export const SIDEBAR_COOKIE_NAME = "sidebar:state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export type SidebarMenuButtonVariants = VariantProps<typeof buttonVariants>
