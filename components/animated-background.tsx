export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute left-[-12rem] top-[-8rem] h-[26rem] w-[26rem] rounded-full bg-black/[0.08] blur-3xl orb orb-slow dark:bg-white/[0.06]" />
      <div className="absolute right-[-10rem] top-[18%] h-[22rem] w-[22rem] rounded-full bg-black/[0.07] blur-3xl orb orb-fast dark:bg-white/[0.05]" />
      <div className="absolute bottom-[-10rem] left-[20%] h-[20rem] w-[20rem] rounded-full bg-black/[0.06] blur-3xl orb orb-pulse dark:bg-white/[0.05]" />
      <div className="absolute inset-x-0 top-[14%] h-px bg-gradient-to-r from-transparent via-black/15 to-transparent dark:via-white/15" />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-noise" />
    </div>
  );
}
