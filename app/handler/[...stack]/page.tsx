
import { stackServerApp } from "@/stack";
import { StackHandler } from "@stackframe/stack";

export const dynamic = 'force-dynamic';

export default function Handler({ params }: { params: { stack: string[] } }) {
  return <StackHandler fullPage app={stackServerApp} routeProps={params} />;
}
