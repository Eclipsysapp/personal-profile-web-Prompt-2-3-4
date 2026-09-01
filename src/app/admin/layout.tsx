import type{Metadata}from"next";import{AdminAuthProvider}from"./_components/AdminAuthProvider";
export const metadata:Metadata={robots:{index:false,follow:false,nocache:true}};
export default function Layout({children}:{children:React.ReactNode}){return <AdminAuthProvider>{children}</AdminAuthProvider>}
