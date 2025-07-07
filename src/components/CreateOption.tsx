import type {  ComponentProps } from "react";
import type { IconType } from "react-icons";

interface CreateOptionProps extends ComponentProps<'div'> {
  titulo: string;
  description: string;
  icon: IconType;
}

export default function CreateOption({titulo, description, icon: Icon, ...props}: CreateOptionProps) {
    return (
        <div {...props} className="flex flex-row gap-2 items-center p-2 hover:bg-neutral-700 rounded-md hover:cursor-pointer">
            <div className="size-12 rounded-full bg-neutral-700 p-2 flex items-center justify-center">
                <Icon className="size-10" />
            </div>
            <div className="flex flex-col">
                <span className="text-md font-bold select-none">{titulo}</span>
                <span className="text-sm text-zinc-400 select-none">{description}</span>
            </div>
        </div>
    );
}