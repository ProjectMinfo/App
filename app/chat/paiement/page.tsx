import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

export default function Paiement() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={subtitle({ class: "mt-4" })}>
          Tu as plusieurs moyens de paiement à ta disposition
        </h1>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
        >
          Compte MI
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
        >
          Liquide
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
        >
          Sum'Up
        </Link>
      </div>

      {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}
    </section>
  );
}
