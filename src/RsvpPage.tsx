/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useRef, useState } from "react";
import "./RsvpPage.css";

type AttendChoice = "accept" | "decline" | "";

export default function RsvpPage() {
  const [attend, setAttend] = useState<AttendChoice>("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // const [isEntourageChild, setIsEntourageChild] = useState<boolean | null>(
  //   null,
  // );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const iframeName = useRef(`gf_iframe_${Math.random().toString(36).slice(2)}`);

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdbs_Lez8sHPLZHIGKoZGQ0b6UXg0v3DP1uGVWxVaWE0TY7Iw/formResponse";

  const entry = useMemo(
    () => ({
      attend: "entry.877086558",
      firstName: "entry.1498135098",
      lastName: "entry.1980418371",
    }),
    [],
  );

  const ATTEND_ACCEPT_LABEL = "Yes, I accept with pleasure";
  const ATTEND_DECLINE_LABEL = "Declines with regrets";

  const canSubmit =
    attend !== "" &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    // isEntourageChild !== null &&
    !isSubmitting;

  const submitViaHiddenForm = (payload: Record<string, string>) => {
    const form = document.createElement("form");
    form.action = GOOGLE_FORM_ACTION_URL;
    form.method = "POST";
    form.target = iframeName.current;
    form.style.display = "none";

    Object.entries(payload).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setStatus("idle");

    const attendLabel =
      attend === "accept" ? ATTEND_ACCEPT_LABEL : ATTEND_DECLINE_LABEL;
    try {
      submitViaHiddenForm({
        [entry.attend]: attendLabel,
        [entry.firstName]: firstName.trim(),
        [entry.lastName]: lastName.trim(),

        fvv: "1",
        draftResponse: "[]",
        pageHistory: "0",
        fbzx: "-6593670443021045026",
      });

      setStatus("success");
      setAttend("");
      setFirstName("");
      setLastName("");
      // setIsEntourageChild(null);
    } catch (err) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rsvp-page">
      <div className="rsvp-page__inner">
         <img
          className="faq-page__titleImg"
          src="/rsvp.png"
          alt="RSVP"
          draggable={false}
        /> 

        {/* <h2 className="rsvp-page__heading">RSVP</h2> */}

        <p className="rsvp-page__subtitle">
          Please let us know if you can confirm your attendance by Feb. 28,
          2026.
        </p>

        <iframe
          name={iframeName.current}
          title="google-form-target"
          style={{ display: "none" }}
        />

        <form className="rsvp-form" onSubmit={onSubmit}>
          <fieldset className="rsvp-fieldset">
            <legend className="rsvp-legend">
              Can you attend?<span className="rsvp-required">*</span>
            </legend>

            <div className="rsvp-radioGroup">
              <label className="rsvp-radio">
                <input
                  type="radio"
                  name="attend"
                  value="accept"
                  checked={attend === "accept"}
                  onChange={() => setAttend("accept")}
                />
                <span className="rsvp-radio__dot" aria-hidden="true" />
                <span className="rsvp-radio__text">{ATTEND_ACCEPT_LABEL}</span>
              </label>

              <label className="rsvp-radio">
                <input
                  type="radio"
                  name="attend"
                  value="decline"
                  checked={attend === "decline"}
                  onChange={() => setAttend("decline")}
                />
                <span className="rsvp-radio__dot" aria-hidden="true" />
                <span className="rsvp-radio__text">{ATTEND_DECLINE_LABEL}</span>
              </label>
            </div>
          </fieldset>

          <div className="rsvp-name">
            <div className="rsvp-field">
              <label className="rsvp-label" htmlFor="firstName">
                Full Name<span className="rsvp-required">*</span>
              </label>
              <input
                id="firstName"
                className="rsvp-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>

            <div className="rsvp-field">
              <label className="rsvp-label" htmlFor="lastName">
                Please specify if you have any dietary restrictions<span className="rsvp-required"></span>
              </label>
              <input
                id="lastName"
                className="rsvp-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

  

          <button className="rsvp-submit" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>

          {status === "success" && (
            <p className="rsvp-status rsvp-status--success">
              Thank you. Your RSVP has been recorded.
            </p>
          )}

          {status === "error" && (
            <p className="rsvp-status rsvp-status--error">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>

      {/* ✅ jcami.dev credit — now anchored to the whole section corner */}
      <div className="rsvp-credit" aria-label="Site credit">
        <img
          className="rsvp-credit__img"
          src="/jcd.png"
          alt="jcami.dev"
          draggable={false}
        />
        <div className="rsvp-credit__tooltip" role="tooltip">
          This website is developed by jcami.dev
        </div>
      </div>
    </section>
  );
}
