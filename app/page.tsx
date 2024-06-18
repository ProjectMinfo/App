'use client';
// import { Link } from "@nextui-org/link";
// import { Snippet } from "@nextui-org/snippet";
// import { Code } from "@nextui-org/code";
// import { button as buttonStyles } from "@nextui-org/theme";

// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";
import { postLogin } from "@/config/api";

import { permanentRedirect } from 'next/navigation'

export default function Home() {

  if (typeof window !== 'undefined') {
    postLogin({ email: window.localStorage.getItem('email'), mdp: window.localStorage.getItem('mdp') });
  }

  return(
    <h1>NEXT EVENT</h1>
  );

}

  // if (typeof window !== 'undefined') {
  //   // if (window.localStorage.getItem('email') && window.localStorage.getItem('mdp')) {
  //     window.location.href = "/commande";
  //   // }
  //   // else {
  //   //   window.location.href = "/connexion";
  //   // }
  // }

  //permanentRedirect("/commande")
  

  // return (
  //   <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
  //     <div className="inline-block max-w-lg text-center justify-center">
  //       <h1 className={title()}>Make&nbsp;</h1>
  //       <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
  //       <br />
  //       <h1 className={title()}>
  //         websites regardless of your design experience.
  //       </h1>
  //       <h2 className={subtitle({ class: "mt-4" })}>
  //         Beautiful, fast and modern React UI library.
  //       </h2>
  //     </div>

  //     <div className="flex gap-3">
  //       <Link
  //         isExternal
  //         className={buttonStyles({
  //           color: "primary",
  //           radius: "full",
  //           variant: "shadow",
  //         })}
  //         href={siteConfig.links.docs}
  //       >
  //         Documentation
  //       </Link>
  //       <Link
  //         isExternal
  //         className={buttonStyles({ variant: "bordered", radius: "full" })}
  //         href={siteConfig.links.github}
  //       >
  //         <GithubIcon size={20} />
  //         GitHub
  //       </Link>
  //     </div>

  //     <div className="mt-8">
  //       <Snippet hideCopyButton hideSymbol variant="flat">
  //         <span>
  //           Get started by editing <Code color="primary">app/page.tsx</Code>
  //         </span>
  //       </Snippet>
  //     </div>
  //   </section>
  // );

