import { Skeleton } from "../ui/skeleton";

export default function ProfileContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="h-[220px] rounded-xl" />
      <Skeleton className="h-[160px] rounded-xl" />
      <Skeleton className="h-[200px] rounded-xl" />
    </div>
  );
}
