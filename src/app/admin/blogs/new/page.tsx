import type{Metadata}from"next";import AdminBlogsShell from"../AdminBlogsShell";
export const metadata:Metadata={title:"Article Editor | Admin",robots:{index:false,follow:false}};
export default function Page(){return <AdminBlogsShell view="editor"/>}
