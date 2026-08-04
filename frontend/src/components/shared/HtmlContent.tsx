"use client";

import DOMPurify from "isomorphic-dompurify";

interface Props {
  content: string;
  className?: string;
}

export default function HtmlContent({ content, className = "" }: Props) {
  // 1. Sanitasi HTML (Mencegah XSS)
  // Ini menghapus tag <script> atau event handler berbahaya (onclick, onmouseover)
  const cleanContent = DOMPurify.sanitize(content);

   return (
     <div
       className={`
         prose               
         prose-slate        
         max-w-none         
         prose-headings:font-bold 
         prose-h1:text-2xl 
         prose-a:text-primary 
         prose-img:rounded-lg 
         prose-img:shadow-md
         prose-code:text-destructive
         prose-pre:bg-secondary 
         prose-pre:text-foreground
         ${className}
       `}
       dangerouslySetInnerHTML={{ __html: cleanContent }}
     />
   );
}
