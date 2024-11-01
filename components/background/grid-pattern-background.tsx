'use client';

import { cn } from '@/lib/utils';
import GridPattern from '@/components/ui/grid-pattern';

export function GridPatternBackGround() {
  return (
    // <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
    //   <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
    //     Grid Pattern
    //   </p>
    // className={cn(
    //     '[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] '
    //   )}
    <GridPattern width={35} height={35} x={-1} y={-1} strokeDasharray={'4 2'} />
    // </div>
  );
}
