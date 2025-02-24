import React from "react";

export type ClickEventHandler<T = HTMLButtonElement> = React.MouseEventHandler<T> 
export type ChangeEventHandler<T = HTMLInputElement> = React.ChangeEventHandler<T> 

export type ClickEvent<T = HTMLInputElement> = React.MouseEvent<T> 
export type ChangeEvent<T = HTMLInputElement> = React.ChangeEvent<T> 