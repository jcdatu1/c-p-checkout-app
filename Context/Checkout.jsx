import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useSettings } from "@shopify/ui-extensions/checkout/preact";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const settings = useSettings() || {};
  const messageTemplate =
    settings.message_template ||
    "By placing your order, you agree to our {Terms} and {Privacy}.";
  const linkColorConfig = normalizeLinkColor(settings.link_color);
  const messageAlignment = normalizeAlignment(settings.message_alignment);
  const messageSize = normalizeFontSize(settings.message_size);

  const alignItems = alignmentToStackAlign(messageAlignment);

  return (
    <s-stack gap="base" alignItems={alignItems}>
      {renderMessage(messageTemplate, linkColorConfig, messageSize)}

      <s-modal id="terms-modal" heading="Terms">
        <TermsModalContent />
        <s-button
          slot="primary-action"
          command="--hide"
          commandFor="terms-modal"
        >
          Close
        </s-button>
      </s-modal>

      <s-modal id="privacy-modal" heading="Privacy">
        <PrivacyModalContent />
        <s-button
          slot="primary-action"
          command="--hide"
          commandFor="privacy-modal"
        >
          Close
        </s-button>
      </s-modal>
    </s-stack>
  );
}

function renderMessageTemplate(template, linkColorConfig) {
  const parts = [];
  const tokenRegex = /\{([a-zA-Z0-9_-]+)\}/g;
  let cursor = 0;
  let match;

  while ((match = tokenRegex.exec(template)) !== null) {
    const [fullToken, tokenName] = match;
    const normalizedToken = tokenName.toLowerCase();

    if (match.index > cursor) {
      parts.push(template.slice(cursor, match.index));
    }

    if (normalizedToken === "terms") {
      parts.push(
        <s-link
          command="--show"
          commandFor="terms-modal"
          tone={linkColorConfig.linkTone}
        >
          <s-text tone={linkColorConfig.textTone}>Terms</s-text>
        </s-link>,
      );
    } else if (normalizedToken === "privacy") {
      parts.push(
        <s-link
          command="--show"
          commandFor="privacy-modal"
          tone={linkColorConfig.linkTone}
        >
          <s-text tone={linkColorConfig.textTone}>Privacy</s-text>
        </s-link>,
      );
    } else {
      parts.push(fullToken);
    }

    cursor = tokenRegex.lastIndex;
  }

  if (cursor < template.length) {
    parts.push(template.slice(cursor));
  }

  return parts;
}

function normalizeAlignment(value) {
  const normalized = String(value || "left")
    .trim()
    .toLowerCase();
  return ["left", "center", "right"].includes(normalized) ? normalized : "left";
}

function normalizeFontSize(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (normalized === "small") return "small";
  if (normalized === "large") return "large";
  if (normalized === "medium" || normalized === "base" || !normalized) {
    return "base";
  }

  return "base";
}

function normalizeLinkColor(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  // Link component supports only auto|neutral for tone.
  const linkTone = normalized === "neutral" ? "neutral" : "auto";

  // Use text tone inside the link for visible color choices.
  const allowedTextTones = [
    "auto",
    "neutral",
    "info",
    "success",
    "warning",
    "critical",
  ];
  const textTone = allowedTextTones.includes(normalized) ? normalized : "auto";

  return { linkTone, textTone };
}

function alignmentToStackAlign(alignment) {
  if (alignment === "center") return "center";
  if (alignment === "right") return "end";
  return "start";
}

function renderMessage(template, linkColorConfig, sizeValue) {
  const content = renderMessageTemplate(template, linkColorConfig);

  if (sizeValue === "small") {
    return <s-text type="small">{content}</s-text>;
  }

  // Checkout text components don't expose a larger non-heading size.
  // Keep "large" aligned to base to avoid changing font weight unexpectedly.
  return <s-text>{content}</s-text>;
}

function TermsModalContent() {
  return (
    <s-stack gap="base">
      <s-paragraph>
        <s-text type="strong">
          YOUR USE OF THIS WEBSITE IS GOVERNED BY THESE TERMS AND CONDITIONS
        </s-text>
      </s-paragraph>

      <s-paragraph>
        <s-text type="small" tone="neutral">
          LAST UPDATED: 10/19/2023
        </s-text>
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 1. INTRODUCTION</s-text>
      </s-paragraph>
      <s-paragraph>
        These Terms and Conditions ("Terms") describe your rights and
        responsibilities when using PopOnSmiles, LLC or Pop On Veneers and all
        of its subsidiaries, successors in interest, and assigns (collectively,
        "Pop On Veneers"), and{" "}
        <s-text type="strong">www.poponveneers.com</s-text>, all related
        websites, products, services, and related mobile applications (the
        "Services"). For the purposes of the Terms, references to "PopOnSmiles",
        "the Site", "We", and "Us" include our respective subsidiaries,
        affiliates, agents, employees, predecessors in interest, successors, and
        assigns, as well as all authorized or unauthorized users or
        beneficiaries of services or products under these Terms or any prior
        agreements between us.
      </s-paragraph>

      <s-paragraph>
        These Terms constitute a legal agreement between the Site's customers
        ("You") and the Site. By accessing or using the Site, you agree to be
        bound by the terms and conditions contained in these Terms and all other
        operating rules, policies and procedures that we may publish from time
        to time on the Site, including our{" "}
        <s-text type="strong">Privacy Policy</s-text>, each of which is
        incorporated by reference and each of which may be updated from time to
        time without notice to you. Your acceptance of the Terms and Conditions
        is indicated by Your continued use of the Site. Please read everything
        here carefully, and be sure to contact us if You have any questions.
      </s-paragraph>

      <s-stack
        gap="base"
        padding="base"
        background="subdued"
        borderRadius="base"
      >
        <s-paragraph>
          <s-text tone="critical" type="strong">
            THIS AGREEMENT INCLUDES A MANDATORY ARBITRATION AGREEMENT (Section
            22) WHICH MEANS THAT YOU AGREE TO SUBMIT ANY CLAIM (AS DEFINED
            BELOW) TO BINDING INDIVIDUAL ARBITRATION RATHER THAN PROCEEDING IN A
            COURT. THE ARBITRATION AGREEMENT ALSO INCLUDES A CLASS ACTION
            WAIVER, WHICH MEANS THAT YOU AGREE TO PROCEED WITH ANY CLAIM
            INDIVIDUALLY AND NOT AS A PART OF A CLASS ACTION.
          </s-text>
        </s-paragraph>
        <s-paragraph>
          <s-text tone="critical" type="strong">
            BY USING THIS SITE, YOU WILL BE BOUND TO ARBITRATE ANY DISPUTES ON
            AN INDIVIDUAL BASIS THROUGH FINAL AND BINDING ARBITRATION, UNLESS
            YOU OPT OUT OF THE ARBITRATION AGREEMENT BY FOLLOWING THE OPT-OUT
            PROCEDURES DESCRIBED BELOW (Section 22.7). BY ENTERING THIS
            AGREEMENT, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ AND
            UNDERSTAND ALL OF THE TERMS OF THE ARBITRATION AGREEMENT AND HAVE
            TAKEN TIME TO CONSIDER THE CONSEQUENCES OF THIS IMPORTANT DECISION.
          </s-text>
        </s-paragraph>
      </s-stack>

      <s-paragraph>
        <s-text type="strong">SECTION 2. ELIGIBILITY</s-text>
      </s-paragraph>
      <s-paragraph>
        You must be at least 18 years old to Use the Site. If you are under the
        age of majority in your state of residence (a minor), your parent or
        legal guardian must agree to these Terms on your behalf, and you may
        only access and Use the Site with permission from your parent or legal
        guardian. By using the Site, you represent and warrant that: (a) all
        information you submit during Account registration is truthful and
        accurate; (b) you will maintain the accuracy of such information; and
        (c) your Use of the Site does not violate any applicable law or
        regulation. Your profile and Account may be terminated and deleted
        without warning if we believe that you are under 18 years of age, if we
        believe that you are under 18 years of age and you represent yourself as
        18 or older, or if we believe you are over 18 and represent yourself as
        under 18.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 3. ACCOUNTS &amp; REGISTRATION</s-text>
      </s-paragraph>
      <s-paragraph>
        You must set up a user account to use certain features of the Site
        ("Account"), such as when you register for an account or purchase
        products from our site. You will need to provide a password, username,
        and other information such as your name and email address. You are
        solely responsible for keeping your Account information confidential.
        You may not transfer, sell, assign, or sublicense your Account to any
        third party without our prior written approval. You are solely
        responsible for all usage or activity on the Site that occurs under your
        Account, including, but not limited to, Use of the Site by any person
        who uses your Account, with or without authorization. You agree to
        notify Pop On Veneers customer service immediately of any unauthorized
        use or any other breach of security on your Account. Pop On Veneers will
        not be liable for losses incurred as a result of an unauthorized use of
        a password or account. Personal information submitted through the Site
        is governed according to our{" "}
        <s-text type="strong">Privacy Policy</s-text>.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 4. MODIFICATION AND TERMINATION</s-text>
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers may at any time: (i) modify or discontinue any part of
        the Site; or (ii) offer opportunities to some or all Site users. Pop On
        Veneers reserves the right to make changes to these Terms at any time,
        and such changes will be effective immediately upon being posted on the
        Site. Each time you use the Site, you should review the current Terms.
        You can determine when these Terms were last revised by referring to the
        "LAST UPDATED" legend at the top of these Terms. Your continued use of
        the Site will indicate your acceptance of the current Terms; however,
        any change to these Terms after your last usage of the Site will not be
        applied retroactively. Pop On Veneers reserves the right, without notice
        and at its sole discretion, to terminate your account or your use of the
        Site and to block or prevent future access to and use of the Site (i) if
        you violate any of these Terms, (ii) for any other reason or (iii) for
        no reason. Upon any such termination, your right to use the Site will
        immediately cease.
      </s-paragraph>
      <s-paragraph>
        You agree that we shall not be liable to you or any third party for any
        termination of your access to the Site. Upon termination, all provisions
        of these Terms which are by their nature intended to survive
        termination, all representations and warranties, all limitations of
        liability and all indemnities shall survive such termination.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 5. SHIPPING &amp; PROCESSING</s-text>
      </s-paragraph>
      <s-paragraph>
        When you order your Pop On Veneers, you will receive an at home
        impression kit, included with your purchase. We request that you send
        your impressions back to Us within 45 days. You may also choose to have
        your impression made with a digital scanner at Our New York City office
        for no additional fee. You should wait at least seven days after your
        last dental visit before making your impressions.
      </s-paragraph>
      <s-paragraph>
        When we receive your impressions, Our designers will evaluate them to
        ensure the impressions are sufficient to create well-fitting veneers. If
        the impressions do not pass, we will send out another impression kit
        with additional guidance.
      </s-paragraph>
      <s-paragraph>
        Orders typically ship two weeks after we receive your impressions. For
        additional information regarding our warranty and cancellation policy
        and for information regarding Gift Cards, please review our Pop On
        Promise available by visiting www.PopOnPromise.com or clicking this link{" "}
        to our website.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 6. PRODUCT INFORMATION</s-text>
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers distributes products which are solely intended as
        cosmetic in nature.
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers does not carry out the practices of dentistry in any
        manner. We do not engage in diagnosis and we do not distribute any
        product which has a therapeutic benefit or effect. Pop On Veneers does
        not offer professional advice nor do we provide treatment for dental
        disorders.
      </s-paragraph>
      <s-paragraph>
        If you have questions or concerns regarding the suitability of any of
        our products, or you experience adverse symptoms, it is your
        responsibility to see a dentist or a licensed medical professional.
      </s-paragraph>
      <s-paragraph>
        The prices displayed on our Site may differ from prices that are
        available in stores. Products displayed on the Site may be available in
        selected Pop On Veneers stores in the United States. The prices
        displayed on the Site are quoted in U.S. dollars, unless otherwise
        indicated.
      </s-paragraph>
      <s-paragraph>
        Please note that while we have tried to accurately display the colors of
        products, the actual colors you see will depend on your monitor or
        mobile device and may not be accurate. Additionally, from time to time
        there may be information on our Site that contains typographical errors,
        inaccuracies, or omissions that may relate to product descriptions,
        pricing, and/or availability. As a result, we do not guarantee the
        accuracy or completeness of any information on the Site, including
        prices, product images, specifications, and/or availability. Pop On
        Veneers reserves the right to correct any errors, inaccuracies, or
        omissions and to change or update information at any time without prior
        notice (including after you have submitted your order). If you do not
        wish to continue your purchase after pricing or other information has
        been corrected, please contact us right away.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 7. TRANSACTIONS</s-text>
      </s-paragraph>
      <s-paragraph>
        We reserve the right to refuse or cancel any order you place on the
        Site. We reserve the right to limit quantities on orders placed by the
        same Account, on orders placed by the same method of payment, and on
        orders that use the same billing or shipping address. We reserve the
        right to, in our sole discretion, prohibit purchases of any products to
        resellers, dealers, and distributors.
      </s-paragraph>
      <s-paragraph>
        If you wish to purchase any product or service made available through
        the Site, you may be asked to supply certain information relevant to
        your transaction including, without limitation, information about your
        method of payment (such as your payment card number and expiration
        date), your billing address, and your shipping information. YOU
        REPRESENT AND WARRANT THAT YOU HAVE THE LEGAL RIGHT TO USE ANY PAYMENT
        CARDS OR OTHER PAYMENT METHODS UTILIZED IN CONNECTION WITH ANY
        TRANSACTION. By submitting such information, you grant to us the right
        to provide such information to third parties for purposes of
        facilitating the transactions initiated by you or on your behalf.
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers cancellation and refund policy, our Pop On Promise, is
        available by visiting www.PopOnPromise.com or clicking this link to our
        website.
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers encourages its customers to use their refund process if
        there are any issues with their purchase. Therefore, if there is no
        lawful reason for the chargeback (e.g. no legal right to a refund),
        customers who file chargebacks will not be eligible to make any other
        purchases from Pop On Veneers, and your account will remain suspended.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 8. SITE CONTENTS</s-text>
      </s-paragraph>
      <s-paragraph>
        All content included on the Site such as text, graphics, logos, images,
        audio clips, video, data, music, software, application updates, and
        other material (collectively "Content") is owned or licensed property of
        Pop On Veneers or its suppliers or licensors, and is protected by
        copyright, trademark, patent or other proprietary rights. The
        collection, arrangement and assembly of all Content on the Site is the
        exclusive property of Pop On Veneers and protected by U.S. and
        international copyright laws. Pop On Veneers expressly reserves all
        intellectual property rights in all Content.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 9. LICENSE AND ACCESS</s-text>
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers grants you a limited license to access and make personal
        use of the Site and the Content for NONCOMMERCIAL PURPOSES ONLY and only
        to the extent such use does not violate these Terms including, without
        limitation, the prohibitions listed in the "UNLAWFUL OR PROHIBITED USES"
        section of these Terms. You may download, print and copy Content for
        personal, noncommercial purposes only, provided you do not modify or
        alter the Content in any way, delete or change any copyright or
        trademark notice, or violate these Terms in any way. Accessing,
        downloading, printing, posting, storing or otherwise using the Site or
        any of the Content for any commercial purpose, whether on behalf of
        yourself or on behalf of any third party, constitutes a material breach
        of these Terms.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 10. UNLAWFUL OR PROHIBITED USES</s-text>
      </s-paragraph>
      <s-paragraph>
        The Site may only be used for lawful purposes in accordance with the
        terms of the license granted in these Terms. As a condition of your use
        of this Site, you warrant to Pop On Veneers that you will not use the
        Site for any purpose that is unlawful or prohibited by these Terms.
        Whether on behalf of yourself or on behalf of any third party, YOU MAY
        NOT:
      </s-paragraph>

      <s-stack gap="base">
        <s-paragraph>
          - Make any commercial use of the Site or its Content, including making
          any collection or use of any product listings, descriptions, prices or
          images;
        </s-paragraph>
        <s-paragraph>
          - Download, copy or transmit any Content for the benefit of any other
          merchant;
        </s-paragraph>
        <s-paragraph>
          - Use or attempt to use any engine, software, tool, agent, data or
          other device or mechanism (including browsers, spiders, robots,
          avatars or intelligent agents) to navigate or search the Site other
          than the search engine and search agents provided by Pop On Veneers or
          generally publicly available browsers;
        </s-paragraph>
        <s-paragraph>
          - Frame, mirror or use framing techniques on any part of the Site
          without Pop On Veneers express prior written consent;
        </s-paragraph>
        <s-paragraph>
          - Make any use of data extraction, scraping, mining or other data
          gathering tools, or create a database by systematically downloading or
          storing Site content, or otherwise scrape, collect, store or use any
          Content, account information, product listings, descriptions, prices
          or images, except pursuant to the limited license granted by these
          Terms;
        </s-paragraph>
        <s-paragraph>
          - Use any meta tags or any other hidden text utilizing Pop On Veneers
          name or marks;
        </s-paragraph>
        <s-paragraph>
          - Misrepresent the identity of a user, impersonate any person or
          entity, falsely state or otherwise misrepresent your affiliation with
          any person or entity in connection with the Site, or express or imply
          that we endorse any statement you make;
        </s-paragraph>
        <s-paragraph>
          - Use a buying agent to conduct transactions on the Site;
        </s-paragraph>
        <s-paragraph>- Conduct fraudulent activities on the Site;</s-paragraph>
        <s-paragraph>
          - Violate or attempt to violate the security of the Site, whether in
          an automated fashion or otherwise, including, without limitation: (i)
          accessing data not intended for you or logging onto a server or an
          account that you are (a) not authorized to access or, (b) in the case
          of a user account, not the registered user of such account; (ii)
          trying to change the behavior of the Site; (iii) attempting to probe,
          scan or test the vulnerability of a system or network, or to breach
          security or authentication measures; (iv) attempting to interfere with
          service to any user, host or network, including, without limitation,
          via means of submitting malware to the Site, overloading, "flooding,"
          "spamming," "mailbombing" or "crashing"; (v) forging any header or any
          part of the header information in any email or posting; or (vi)
          forging communications on behalf of the Site (impersonating the Pop On
          Veneers Site) or to the Site (impersonating another user whether such
          user provided their approval for such action(s) or not);
        </s-paragraph>
        <s-paragraph>
          - Send unsolicited or unauthorized email on behalf of Pop On Veneers
          or any Pop On Veneers Plus Partner, including promotions and/or
          advertising of products or services;
        </s-paragraph>
        <s-paragraph>
          - Tamper with the Site or use or attempt to use any device, software,
          routine or data that interferes or attempts to interfere with the
          working or functionality of the Site or any activity being conducted
          on the Site;
        </s-paragraph>
        <s-paragraph>
          - Use the Site to defame, abuse, harass, stalk, threaten or otherwise
          violate the legal rights of others, including others privacy rights or
          rights of publicity;
        </s-paragraph>
        <s-paragraph>
          - Harvest or collect personally identifiable information about other
          users of the Site;
        </s-paragraph>
        <s-paragraph>
          - Restrict or inhibit any other person from using the Site (including,
          without limitation, by hacking or defacing any portion of the Site);
        </s-paragraph>
        <s-paragraph>
          - Use the Site to advertise or offer to sell or buy any goods or
          services without Pop On Veneers express prior written consent;
        </s-paragraph>
        <s-paragraph>
          - Reproduce, duplicate, copy, sell, resell or otherwise exploit for
          any commercial purposes any portion of, use of, or access to the Site;
        </s-paragraph>
        <s-paragraph>
          - Modify, adapt, translate, reverse engineer, decompile or disassemble
          any portion of the Site; or
        </s-paragraph>
        <s-paragraph>
          - Remove any copyright, trademark or other proprietary rights notice
          from the Site or materials originating from the Site.
        </s-paragraph>
      </s-stack>

      <s-paragraph>
        <s-text type="strong">
          SECTION 11. USER REVIEWS, COMMENTS &amp; SUBMISSIONS
        </s-text>
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers welcomes your reviews, comments, and other
        communications, photos, videos, or any other content that you submit
        through or to the Site via our website or through a third party
        application such as Google, Yelp, Loox or other "Third Party
        Applications", or any content or information you publish through any
        social media and allow Pop On Veneers to feature, such as your name,
        social media handle, accompanying text, and any images, videos, or audio
        from your social media accounts (e.g. Twitter, Instagram, Pinterest)
        (collectively, "User Content") as long as the User Content submitted by
        you complies with these Terms. Pop On Veneers may choose to reward user
        content at its discretion with store credits, gift cards or other
        methods. User Content will not include any photographs or images you
        submit as part of a Transaction (as defined below). You agree that any
        User Content: will be accurate; will not violate or facilitate the
        violation of any law or regulation; will not violate any right of a
        third party, including copyright, trademark, privacy or publicity
        rights; will not cause injury to any person or entity; and will not
        contain, or provide links to, obscene, profane, or threatening language,
        malware, political campaigning, commercial solicitation, chain letters,
        mass mailings, any form of "spam", or any material that could be
        considered harmful, sexually explicit, indecent, lewd, violent, abusive,
        or degrading. You are solely responsible for the User Content you
        submit, and Pop On Veneers assumes no liability for any User Content
        submitted by you. You acknowledge and agree that we reserve the right
        (but have no obligation) to do any or all of the following, in our sole
        discretion: (i) monitor User Content; (ii) alter, remove, or refuse to
        post or allow to be posted any User Content; and/or (iii) disclose any
        User Content, and the circumstances surrounding its transmission, to any
        third party.
      </s-paragraph>
      <s-paragraph>
        For any User Content you submit, you grant to Pop On Veneers a
        non-exclusive, sub-licensable, fully paid-up, perpetual, irrevocable,
        royalty-free, transferable right and license to use, display, perform,
        transmit, copy, modify, delete, adapt, publish, translate, create
        derivative works from, sell and distribute such User Content and to
        incorporate the User Content into any form, medium, or technology, now
        known or hereafter developed, throughout the world. You grant the right
        to Pop On Veneers the right to monetize the User Content (and such
        monetization may include displaying ads on or within User Content or
        charging users a fee for access). These Terms do not entitle you to any
        payments.
      </s-paragraph>
      <s-paragraph>
        For this reason, do not send us any User Content that you do not wish to
        license to us, including any confidential information or any original
        creative materials such as stories, product ideas, computer code or
        original artwork. In addition, you grant to Pop On Veneers the right to
        include the name provided along with the User Content submitted by you;
        provided, however, Pop On Veneers shall have no obligation to include
        such name with such User Content. We are not responsible for the use or
        disclosure of any personal information that you voluntarily disclose in
        connection with any User Content you submit. You represent and warrant
        that you have all rights necessary for you to grant the licenses granted
        in this section, including but not limited to permission from or on
        behalf of any individuals that appear in the User Content to use, and
        grant to third parties such as Pop On Veneers the right to use, their
        name, image, voice and/or likeness without compensation to you or any
        other person or entity. You further irrevocably waive any "moral rights"
        or other rights with respect to attribution of authorship or integrity
        of materials regarding User Content that you may have under any
        applicable law under any legal theory.
      </s-paragraph>
      <s-paragraph>
        Content is also provided by third party visitors to the Site. Please
        note that Site visitors may post content that is inaccurate, misleading,
        or deceptive. Pop On Veneers neither endorses nor is responsible for any
        opinion, advice, information, or statements made by third parties. The
        opinions expressed by third parties reflect solely the opinions of the
        individuals who submitted such opinions and may not reflect the opinions
        of Pop On Veneers.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 12. PROMOTIONS AND SPECIAL OFFERS</s-text>
      </s-paragraph>
      <s-paragraph>
        Occasionally we will offer special promotions to our customers. This can
        include a gift with purchase, free shipping, manufacturer offers, or
        other promotional activity associated with a product purchase. These
        offers may be for a limited time only. Any sweepstakes, contests,
        raffles, or other promotions (collectively, "Promotions") made available
        through the Site may be governed by rules that are separate from these
        Terms. If you participate in any Promotions, please review the
        applicable rules as well as our Privacy Policy . If the rules for a
        Promotion conflict with these Terms, the Promotion rules will apply.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 13. TEXT MESSAGING ("SMS") TERMS OF USE
        </s-text>
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers offers its customers mobile alerts about order and
        shipping updates and other marketing messages about events, new
        products, and other offers by SMS message (the "Service"). By
        participating in the Service, you are agreeing to these Terms of Use and
        to the Privacy Policy. When you opt into our SMS program, you understand
        and agree that the Website Terms are incorporated into, and become part
        of, the SMS Terms of Use (and both documents are together, the "Terms").
        THE TERMS CONTAIN AN ARBITRATION AGREEMENT, JURY AND CLASS ACTION
        WAIVERS, LIMITATIONS ON OUR LIABILITY, AND OTHER PROVISIONS THAT AFFECT
        YOUR LEGAL RIGHTS REGARDING THE SMS PROGRAM. PLEASE CAREFULLY READ AND
        UNDERSTAND THESE TERMS.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 13.1 SIGNING UP AND OPTING-IN TO THE SERVICE
        </s-text>
      </s-paragraph>
      <s-paragraph>
        Enrollment in the Service requires you to provide your mobile phone
        number and electronic signature to agree to these Terms. Before the
        Service will start, you will need to submit your phone number to our
        form on our website, and agree to these Terms. You may not enroll if you
        are under 18 years old (except in Alabama and Nebraska, 19 years old).
        Pop On Veneers reserves the right to stop offering the Service at any
        time with or without notice.
      </s-paragraph>
      <s-paragraph>By opting into the Service, you:</s-paragraph>
      <s-stack gap="base">
        <s-paragraph>
          - Authorize Pop On Veneers to use autodialer or non-autodialer
          technology to send text messages to the mobile phone number associated
          with your opt-in.
        </s-paragraph>
        <s-paragraph>
          - Acknowledge that you do not have to agree to receive messages as a
          condition of purchase.
        </s-paragraph>
        <s-paragraph>
          - Confirm that you are the subscriber to the relevant phone number or
          that you are the customary user of that number on a family or business
          plan and that you are authorized to opt in.
        </s-paragraph>
        <s-paragraph>
          - Consent to the use of an electronic record to document your opt-in.
          To request a free paper or email copy of the opt-in or to update our
          records with your contact information, please click here .
        </s-paragraph>
      </s-stack>

      <s-paragraph>
        <s-text type="strong">SECTION 13.2 MESSAGES YOU MAY RECEIVE</s-text>
      </s-paragraph>
      <s-paragraph>
        Once you affirm your choice to opt in to the Service, your message
        frequency may vary. You may receive an alert when:
      </s-paragraph>
      <s-stack gap="base">
        <s-paragraph>- you are welcomed into the Service</s-paragraph>
        <s-paragraph>- an order has been placed</s-paragraph>
        <s-paragraph>- an order has been delivered</s-paragraph>
        <s-paragraph>
          - an item or items has shipped; an item or items are ready for an
          in-store pick up
        </s-paragraph>
        <s-paragraph>- there are general marketing or promotions</s-paragraph>
      </s-stack>

      <s-paragraph>
        <s-text type="strong">SECTION 13.3 CHARGES AND CARRIERS</s-text>
      </s-paragraph>
      <s-paragraph>
        Message and data rates may apply. Please consult your service agreement
        with your wireless carrier or contact your wireless carrier to determine
        your phone's pricing plan and the charges for sending and receiving text
        messages. You acknowledge that you are responsible for any message, data
        or other charges incurred (usage, subscription, etc.) as a result of
        using the Service.
      </s-paragraph>
      <s-paragraph>
        Supported carriers are AT&amp;T, Verizon Wireless, Sprint, and T-Mobile
        USA, and other smaller regional carriers. The Service may not be
        available on all wireless carriers. Pop On Veneers may add or remove any
        wireless carrier from the Service at any time without notice. Pop On
        Veneers and mobile carriers are not responsible for any undue delays,
        failure of delivery, or errors in messages.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 13.4 TO STOP THE SERVICE</s-text>
      </s-paragraph>
      <s-paragraph>
        To stop receiving text messages from Pop On Veneers, reply STOP to any
        of the text messages you have received from Pop On Veneers. Your opt-out
        request may generate either a confirmation text or a texted request to
        clarify the text message program to which it applies.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 13.5 HELP AND QUESTIONS</s-text>
      </s-paragraph>
      <s-paragraph>
        You can text HELP for help at any time. This will provide you a link to
        the Terms and Conditions along with an email to ask for assistance. You
        can also contact us by using this form here .
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 13.6 MOBILE PHONE NUMBER CHANGE</s-text>
      </s-paragraph>
      <s-paragraph>
        In the event that you change or deactivate your mobile phone number, you
        agree to notify Pop On Veneers by contacting us here .
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 13.7 DATA AND MESSAGE FREQUENCY</s-text>
      </s-paragraph>
      <s-paragraph>
        Data obtained from you in connection with this text messaging service
        may include your mobile phone number, your carrier's name, and the date
        time and content of your messages. If you have questions regarding our
        privacy practices, please read our privacy policy .
      </s-paragraph>
      <s-paragraph>
        For questions about the services Pop On Veneers provides, contact us{" "}
        here .
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 14. LINKS TO THIRD-PARTIES' WEBSITES
        </s-text>
      </s-paragraph>
      <s-paragraph>
        The Site may contain links and interactive functionality interacting
        with the websites of third parties, including social sites and product
        manufacturers' sites. Pop On Veneers is not responsible for and has no
        liability for the functionality, actions, inactions, privacy settings,
        privacy policies, terms, or content of any such website. YOUR USE OF
        THIRD-PARTY WEBSITES AND RESOURCES IS AT YOUR OWN RISK.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 15. DISCLAIMERS OF WARRANTIES</s-text>
      </s-paragraph>
      <s-paragraph>
        Pop On Veneers cannot and does not represent or warrant that the Site or
        its server will be error-free, uninterrupted, free from unauthorized
        access, or otherwise meet your requirements.
      </s-paragraph>
      <s-paragraph>
        <s-text type="strong">
          THE SITE AND ALL INFORMATION, CONTENT, MATERIALS , PRODUCTS, SERVICES,
          AND USER CONTENT INCLUDED ON OR OTHERWISE MADE AVAILABLE TO YOU
          THROUGH THE SITE ARE PROVIDED BY POP ON VENEERS ON AN "AS IS," "AS
          AVAILABLE" BASIS, WITHOUT REPRESENTATIONS OR WARRANTIES OF ANY KIND...
          YOU EXPRESSLY AGREE THAT YOUR USE OF THE SITE IS AT YOUR SOLE RISK.
        </s-text>
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 16. JURISDICTIONAL ISSUES</s-text>
      </s-paragraph>
      <s-paragraph>
        The Site is controlled and operated by Pop On Veneers from the United
        States, and is not intended to subject Pop On Veneers to the laws or
        jurisdiction of any state, country or territory other than that of the
        United States.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 17. COPYRIGHT INFRINGEMENT POLICY/DMCA
        </s-text>
      </s-paragraph>
      <s-paragraph>
        We respond to notices of alleged copyright infringement and terminate
        accounts of repeat infringers according to the process set out in the
        U.S. Digital Millennium Copyright Act (DMCA). If you believe your work
        has been copied unlawfully, provide:
      </s-paragraph>
      <s-stack gap="base">
        <s-paragraph>
          - Your address, telephone number, and email address.
        </s-paragraph>
        <s-paragraph>
          - A description of the copyrighted work that you claim has been
          infringed.
        </s-paragraph>
        <s-paragraph>
          - A description of where the alleged infringing material is located on
          the Site.
        </s-paragraph>
        <s-paragraph>
          - A statement of good faith belief that the disputed use is
          unauthorized.
        </s-paragraph>
        <s-paragraph>
          - An electronic or physical signature of the authorized person.
        </s-paragraph>
        <s-paragraph>
          - A statement made under penalty of perjury that the information is
          accurate.
        </s-paragraph>
      </s-stack>
      <s-paragraph>
        Our Designated Agent can be reached at:{" "}
        <s-text type="strong">trademarks@poponveneers.com</s-text>
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 18. LIMITATION OF LIABILITY</s-text>
      </s-paragraph>
      <s-paragraph>
        <s-text type="strong">
          UNDER NO CIRCUMSTANCES SHALL POP ON VENEERS OR ITS EMPLOYEES,
          DIRECTORS, OFFICERS OR AGENTS BE LIABLE FOR ANY DIRECT OR INDIRECT
          LOSSES OR DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR
          INABILITY TO USE THE SITE...
        </s-text>
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 19. INDEMNIFICATION</s-text>
      </s-paragraph>
      <s-paragraph>
        To the fullest extent permitted by applicable law, you agree to
        indemnify and hold harmless Pop On Veneers and its Affiliates from and
        against any and all claims, costs, proceedings, demands, losses,
        damages, and expenses arising from or relating to, any actual or alleged
        breach of these Terms by you.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 20. NOTICES &amp; ELECTRONIC COMMUNICATIONS
        </s-text>
      </s-paragraph>
      <s-paragraph>
        Except as explicitly stated otherwise, any notices you send to Pop On
        Veneers shall be sent by email to compliance@poponveneers.com. You agree
        that communications and transactions between us may be conducted
        electronically.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 21. NOTICE FOR CALIFORNIA RESIDENTS
        </s-text>
      </s-paragraph>
      <s-paragraph>
        Under California Civil Code Section 1789.3, California users are
        entitled to the following consumer rights notice: If you have a question
        or complaint regarding the Site, please use this form . You may also
        write to POPONSMILES LLC 237 West 37th Street FL 2 New York NY 10018 or
        call (212) 461-6302.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 22. AGREEMENT TO ARBITRATE &amp; WAIVER OF CERTAIN RIGHTS
        </s-text>
      </s-paragraph>
      <s-paragraph>
        Please read this section carefully. Except as the Terms otherwise
        provide, you waive your rights to try any claim in court before a judge
        or jury and to bring or participate in any class, collective, or other
        representative action.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">22.1 AGREEMENT TO BINDING ARBITRATION</s-text>
      </s-paragraph>
      <s-paragraph>
        Our Pop On Promise describes our 30 day warranty, which allows you time
        to evaluate your veneers and ensure you are satisfied. Review it at
        www.PopOnPromise.com or via this link .
      </s-paragraph>
      <s-paragraph>
        You and the Site agree that any disputes between us will be resolved
        through binding and final arbitration administered by the American
        Arbitration Association ("AAA") pursuant to its Consumer Arbitration
        Rules.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">22.2 NO CLASS ACTION</s-text>
      </s-paragraph>
      <s-paragraph>
        You and the Site each agree that any dispute resolution proceedings will
        be conducted only on an individual basis and not in a class,
        consolidated, or representative action.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">22.3 RULES AND GOVERNING LAW</s-text>
      </s-paragraph>
      <s-paragraph>
        The arbitration will be administered by the AAA in accordance with the
        Consumer Arbitration Rules then in effect, accessible via AAA Consumer
        Rules . Issues shall be resolved under the laws of the state of New
        York.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">22.4 ARBITRATION PROCESS</s-text>
      </s-paragraph>
      <s-paragraph>
        You can begin the arbitration by submitting a Demand for Arbitration.
        The AAA provides a Demand for Arbitration form on its website.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">22.5 ARBITRATOR'S DECISION</s-text>
      </s-paragraph>
      <s-paragraph>
        Within 14 days from the conclusion of hearings, the arbitrator will
        render a reasoned written decision. An arbitrator's decision shall be
        final and binding on all parties.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">22.6 FEES</s-text>
      </s-paragraph>
      <s-paragraph>
        For claims of $100,000 (US Dollars) or less, Pop On Veneers will pay all
        filing, administration, and arbitrator fees unless the arbitrator
        determines that your claim is frivolous.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          22.7 OPT-OUT PROCEDURE APPLICABLE TO ALL CONSUMERS
        </s-text>
      </s-paragraph>
      <s-paragraph>
        You can decline this agreement to arbitrate by emailing Us at
        compliance@poponveneers.com within 30 days of text acceptance with your
        Name, URL of Terms, Address, and Phone Number.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 23. SEVERABILITY, SURVIVAL AND WAIVER
        </s-text>
      </s-paragraph>
      <s-paragraph>
        If any portion of the Terms of Service are found to be unenforceable or
        unlawful for any reason, the unenforceable or unlawful provision shall
        be severed without impacting the remaining sections.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          SECTION 24. ADDITIONAL TERMS, MODIFICATION &amp; MISCELLANEOUS
        </s-text>
      </s-paragraph>
      <s-paragraph>
        We reserve the right to make changes to these Terms at any time, and
        such changes will be effective immediately upon being posted on the
        Site.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 25. CONTACT US</s-text>
      </s-paragraph>
      <s-paragraph>
        If you have any concerns about Pop On Veneers or your use of the Site,
        please contact us here with a detailed description.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">SECTION 26. REFERRALS</s-text>
      </s-paragraph>
      <s-paragraph>
        Please see specific terms &amp; conditions for referrals here:{" "}
        https://poponveneers.com/pages/referral-terms
      </s-paragraph>
    </s-stack>
  );
}

function PrivacyModalContent() {
  return (
    <s-stack gap="base">
      <s-paragraph>
        <s-text type="strong">PopOnSmiles PRIVACY POLICY</s-text>
      </s-paragraph>
      <s-paragraph>
        <s-text type="small" tone="neutral">
          Last Updated: January 19, 2024
        </s-text>
      </s-paragraph>

      <s-paragraph>
        This Privacy Policy ("Privacy Policy" or "Policy") explains how
        PopOnSmiles, LLC, ("Pop On Veneers," or "Pop On Smiles," or "we," or
        "us," or "our") collects personal information based on your interactions
        with us online, including on our websites PopOnVeneers.com and
        PopOnSmiles.com ("Sites") when we offer, sell or ship products through
        our Sites (the "Services"). This Policy applies to our collection and
        use of personal information and describes rights you may have with
        respect to your personal information. By using this Site and otherwise
        interacting with us, you agree to the terms of our Terms and Conditions,
        including this Policy.
      </s-paragraph>
      <s-paragraph>
        This Policy does not cover the personal information we collect about
        employees and independent contractors, or job applicants.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          Notice at Collection: Personal Information We Collect
        </s-text>
      </s-paragraph>
      <s-paragraph>
        We collect the following categories of personal information:
      </s-paragraph>
      <s-stack gap="base">
        <s-paragraph>
          - Personal identifiers: name, email address, shipping or billing
          address, telephone numbers, IP address, and information voluntarily
          submitted through forms on our website.
        </s-paragraph>
        <s-paragraph>
          - Commercial and financial information: records of products ordered or
          considered; other purchasing histories; and payment information.
        </s-paragraph>
        <s-paragraph>
          - Internet or other electronic activity information: device and
          browser type, browsing and search history on our Sites, and
          information regarding interactions with our Sites and advertisements.
        </s-paragraph>
        <s-paragraph>
          - Audio and video information: recordings of customer service calls
          for quality assurance and video coaching calls requested by you.
        </s-paragraph>
        <s-paragraph>
          - Inferences drawn from personal information we collect.
        </s-paragraph>
      </s-stack>

      <s-paragraph>
        We have collected the same categories of personal information in the 12
        months prior to the date of this Privacy Policy.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          Notice at Collection: Purposes for Collection of Personal Information
        </s-text>
      </s-paragraph>
      <s-paragraph>
        We collect personal information to provide products and fulfill orders,
        contact you, provide business information, support customers, deliver
        advertising and promotions, respond to inquiries, customize experiences,
        and analyze marketing effectiveness.
      </s-paragraph>
      <s-paragraph>
        We also use personal information to monitor and improve our Sites,
        conduct internal analysis, prevent fraud and illegal activities, and
        protect rights and safety.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          Notice at Collection: Categories We Sell or Share
        </s-text>
      </s-paragraph>
      <s-paragraph>
        When we engage in digital advertising, we may sell (as broadly defined
        in certain state laws) or share for cross-context behavioral advertising
        personal identifiers (IP address) and internet/electronic activity
        information.
      </s-paragraph>
      <s-paragraph>
        To opt out of sales and sharing of personal information, visit:
        https://poponveneers.com/pages/privacy-opt-out-request
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">Retention, Sources, and Disclosures</s-text>
      </s-paragraph>
      <s-paragraph>
        We retain personal information for as long as necessary to provide
        services, comply with legal obligations, and protect legal rights.
      </s-paragraph>
      <s-paragraph>
        We collect personal information directly from customers, site users,
        business representatives, and external business partners.
      </s-paragraph>
      <s-paragraph>
        In the past 12 months, we disclosed categories of personal information
        to service providers for business purposes including payment processing,
        customer support, security, hosting, analytics, advertising, and legal
        or accounting services.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">
          Our Use of Cookies, Analytics, and Microsoft Clarity
        </s-text>
      </s-paragraph>
      <s-paragraph>
        We may use cookies, pixel tags, web beacons, and similar tracking
        technologies to collect data automatically, improve security, detect
        irregular behavior, and enhance user experience.
      </s-paragraph>
      <s-paragraph>
        We also allow third parties to use tracking technologies for analytics
        and advertising. Microsoft Clarity and Microsoft Advertising may collect
        usage data such as behavioral metrics, heatmaps, and session replay.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">Additional Privacy Information</s-text>
      </s-paragraph>
      <s-stack gap="base">
        <s-paragraph>
          - Our products and Sites are not directed to minors under 13.
        </s-paragraph>
        <s-paragraph>
          - We do not respond to Do Not Track (DNT) signals.
        </s-paragraph>
        <s-paragraph>
          - Third-party websites and social media links are governed by their
          own policies.
        </s-paragraph>
        <s-paragraph>
          - We maintain reasonable security controls, but no system can be
          perfectly secure.
        </s-paragraph>
        <s-paragraph>
          - We may update this Policy from time to time.
        </s-paragraph>
      </s-stack>

      <s-paragraph>
        <s-text type="strong">Accessibility and Contact</s-text>
      </s-paragraph>
      <s-paragraph>
        For accessibility requests, privacy rights requests, or questions about
        this Privacy Policy, visit:
        https://poponveneers.com/pages/privacy-opt-out-request or call
        212-461-6302.
      </s-paragraph>

      <s-paragraph>
        <s-text type="strong">US State Data Privacy Rights</s-text>
      </s-paragraph>
      <s-paragraph>
        Residents of certain US states (including California and Virginia) may
        have rights to know, access, delete, correct, and opt out of certain
        processing or sharing activities, subject to verification and applicable
        law.
      </s-paragraph>
      <s-paragraph>
        To exercise privacy rights or submit an appeal where applicable, use:
        https://poponveneers.com/pages/privacy-opt-out-request
      </s-paragraph>

      <s-paragraph>
        POPONSMILES LLC, 237 West 37th Street FL 2, New York NY 10018
      </s-paragraph>
    </s-stack>
  );
}
