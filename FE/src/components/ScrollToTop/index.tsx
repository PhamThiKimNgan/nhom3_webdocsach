import React,{ useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(props:any) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if(!pathname.includes('/user/'))
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Optional if you want to skip the scrolling animation
    });
  }, [pathname]);

  return props.children;
}