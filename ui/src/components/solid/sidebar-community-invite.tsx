import { createSignal, createUniqueId, For, onSettled, Show } from "solid-js";
import { inferControlUiPublicAssetPath } from "../../app/public-assets.ts";
import { buildExternalLinkRel, EXTERNAL_LINK_TARGET } from "../../lib/external-link.ts";
import {
  SHARDSCLAW_DOCUMENTATION_URL,
  SHARDSCLAW_ISSUES_URL,
  SHARDSCLAW_REPOSITORY_URL,
} from "../../lib/product-links.ts";
import { t } from "../../lib/reactive/i18n.ts";
import { listen } from "../../lib/reactive/listener.ts";
import { showToast } from "../../lib/toast.ts";
import {
  COMMUNITY_INVITE_KEY,
  dismissCommunityInvite,
  isCommunityInviteEligible,
} from "../community-invite-state.ts";
import { Icon } from "./icon.tsx";
import "../../styles/community-invite-card.css";

declare module "@solidjs/web" {
  namespace JSX {
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
      // Pinterest documents this nonstandard per-image saving opt-out.
      nopin?: "nopin";
    }
  }
}

const communityLinks = [
  {
    label: "repository",
    ariaLabel: "repositoryLabel",
    href: SHARDSCLAW_REPOSITORY_URL,
    icon: "github",
  },
  {
    label: "docs",
    ariaLabel: "docsLabel",
    href: SHARDSCLAW_DOCUMENTATION_URL,
    icon: "bookOpenText",
  },
  {
    label: "issues",
    ariaLabel: "issuesLabel",
    href: SHARDSCLAW_ISSUES_URL,
    icon: "circleQuestionMark",
  },
] as const;

export function SidebarCommunityInvite(props: { onDismiss: () => void; mode: "light" | "dark" }) {
  const [eligible, setEligible] = createSignal(isCommunityInviteEligible());
  const titleId = createUniqueId();
  onSettled(() =>
    listen(window, "storage", (event) => {
      if (event.key === COMMUNITY_INVITE_KEY || event.key === null) {
        setEligible(isCommunityInviteEligible());
      }
    }),
  );
  const dismiss = () => {
    const result = dismissCommunityInvite();
    setEligible(false);
    props.onDismiss();
    if (!result.ok) {
      showToast({ message: t("communityInvite.dismissFailed") });
    }
  };
  return (
    <Show when={eligible()}>
      <div class="community-invite-card">
        <aside class="invite" role="complementary" aria-labelledby={titleId}>
          <div class="invite__header">
            <img
              class="invite__art"
              src={inferControlUiPublicAssetPath(
                `community-art/community-invite-${props.mode}.webp`,
              )}
              alt=""
              nopin="nopin"
              data-pin-nopin="true"
              width="1024"
              height="439"
              loading="lazy"
              decoding="async"
            />
            <div class="invite__marks" aria-hidden="true">
              <img
                src={inferControlUiPublicAssetPath("favicon.svg")}
                alt=""
                width="20"
                height="20"
              />
            </div>
            <button
              class="invite__close"
              type="button"
              aria-label={t("communityInvite.dismissForever")}
              onClick={dismiss}
            >
              <Icon name="x" />
            </button>
          </div>
          <div class="invite__body">
            <h2 class="invite__title" id={titleId}>
              {t("communityInvite.title")}
            </h2>
            <p class="invite__text">{t("communityInvite.body")}</p>
            <div class="invite__links" dir="ltr">
              <For each={communityLinks}>
                {(link) => (
                  <a
                    class="invite__cta"
                    href={link.href}
                    aria-label={t(`communityInvite.${link.ariaLabel}`)}
                    title={t(`communityInvite.${link.ariaLabel}`)}
                    target={EXTERNAL_LINK_TARGET}
                    rel={buildExternalLinkRel()}
                  >
                    <Icon name={link.icon} />
                    <span>{t(`communityInvite.${link.label}`)}</span>
                  </a>
                )}
              </For>
            </div>
          </div>
        </aside>
      </div>
    </Show>
  );
}
