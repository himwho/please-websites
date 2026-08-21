import { useMemo, useState } from "react";

const MONTHLY_TARGET = 42000;
const STARTING_TOTAL = 28650;
const DEMO_ROUND = 2650;
const BEER_PRICE = 7;
const BEER_COST_PRICE = 0.45;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const beerMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const roles = [
  { label: "I run a venue", subject: "A venue for Nonprofit Bar NYC" },
  { label: "I fund culture", subject: "Supporting Nonprofit Bar NYC" },
  { label: "I work in NYC", subject: "City support for Nonprofit Bar NYC" },
  { label: "Save me a seat", subject: "Keep me posted on Nonprofit Bar NYC" },
];

export default function Home() {
  const [covered, setCovered] = useState(STARTING_TOTAL);
  const isCovered = covered >= MONTHLY_TARGET;
  const percent = Math.min(100, (covered / MONTHLY_TARGET) * 100);
  const remaining = Math.max(0, MONTHLY_TARGET - covered);

  const status = useMemo(
    () =>
      isCovered
        ? "Target met. The designated house menu is now at marginal cost."
        : `${money.format(remaining)} left to cover this month.`,
    [isCovered, remaining],
  );

  function addDemoRound() {
    setCovered((value) => Math.min(MONTHLY_TARGET, value + DEMO_ROUND));
  }

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Nonprofit Bar NYC home">
          <span>NONPROFIT BAR</span>
          <span className="wordmark-city">NYC</span>
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#why">Why NYC</a>
          <a className="nav-cta" href="#join">Join the pilot ↗</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse-dot" /> A public experiment in what a NYC food and drink establishment can be</p>
          <h1>What if the bar stopped profiting once the bills were paid?</h1>
          <p className="lede">
            A business does not always have to be profit orientated, what happened to the idea of making a business that the community enjoys? This experiment is about creating a bar aiming at just that, where every purchase moves a public meter that displays the monthly costs of the business. When the month&apos;s verified operating costs are covered, the designated house beer and wine drop below a dollar cost through month-end.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#join">I want this in NYC <span>↗</span></a>
            <a className="button button-text" href="#how">See how it works ↓</a>
          </div>
        </div>

        <div className={`meter-card ${isCovered ? "meter-card-hit" : ""}`}>
          <div className="meter-topline">
            <span>MONTHLY COST METER</span>
            <span>CONCEPT DEMO</span>
          </div>

          <div className="meter-number" aria-live="polite">
            <span className="meter-covered">{money.format(covered)}</span>
            <span className="meter-target"> / {money.format(MONTHLY_TARGET)}</span>
          </div>

          <div
            className="meter-track"
            role="progressbar"
            aria-label="Illustrative monthly operating costs covered"
            aria-valuemin={0}
            aria-valuemax={MONTHLY_TARGET}
            aria-valuenow={covered}
          >
            <div className="meter-fill" style={{ width: `${percent}%` }}>
              <span>{Math.round(percent)}%</span>
            </div>
            <div className="threshold-line"><span>COST LINE</span></div>
          </div>

          <div className="meter-status">
            <div>
              <span className="status-label">STATUS</span>
              <strong>{isCovered ? "COST MODE UNLOCKED" : "BUILDING TOWARD COST"}</strong>
            </div>
            <span className="status-light" aria-hidden="true" />
          </div>

          <p className="meter-message" aria-live="polite">{status}</p>

          <div className="pour-board" aria-live="polite">
            <span className="pour-board-label">COST OF A BEER</span>
            <div className="pour-prices">
              <div className={`pour-price ${isCovered ? "pour-price-was" : "pour-price-now"}`}>
                <span>BEFORE</span>
                <strong className="pour-amount">{beerMoney.format(BEER_PRICE)}</strong>
              </div>
              <span className="pour-arrow" aria-hidden="true">→</span>
              <div className={`pour-price ${isCovered ? "pour-price-now" : "pour-price-later"}`}>
                <span>AFTER COST LINE</span>
                <strong className="pour-amount">{beerMoney.format(BEER_COST_PRICE)}</strong>
              </div>
            </div>
          </div>

          <div className="demo-controls">
            <button type="button" onClick={addDemoRound} disabled={isCovered}>
              {isCovered ? "Target reached" : `Add a pretend round +${money.format(DEMO_ROUND)}`}
            </button>
            {covered !== STARTING_TOTAL && (
              <button className="reset-button" type="button" onClick={() => setCovered(STARTING_TOTAL)}>
                Reset demo
              </button>
            )}
          </div>

          <p className="meter-note">Illustrative numbers. A real meter would use verified POS and accounting data.</p>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>OPEN BOOKS ✦ FAIR PAY ✦ LOWER COST ✦ MORE CULTURE ✦ OPEN BOOKS ✦ FAIR PAY ✦ LOWER COST ✦ MORE CULTURE ✦</div>
      </div>

      {/* <section className="section mechanism" id="how">
        <div className="section-heading">
          <p className="kicker">The mechanism</p>
          <h2>One line.<br />Three moves.</h2>
          <p>The meter turns a private monthly break-even point into a shared public goal.</p>
        </div>

        <div className="steps">
          <article className="step">
            <span className="step-number">01</span>
            <div>
              <h3>Open the books</h3>
              <p>Publish a verified monthly target for rent, fair staffing, inventory, utilities, insurance, and cultural programming.</p>
            </div>
          </article>
          <article className="step step-dark">
            <span className="step-number">02</span>
            <div>
              <h3>Every check moves it</h3>
              <p>Each eligible purchase advances the public wall meter. Tax, tips, and pass-through charges never inflate the number.</p>
            </div>
          </article>
          <article className="step step-accent">
            <span className="step-number">03</span>
            <div>
              <h3>Hit the line</h3>
              <p>Once costs are covered, designated house beer and wine move to marginal cost through month-end. Then the meter resets and the month is archived.</p>
            </div>
          </article>
        </div>
      </section> */}

      <section className="manifesto" aria-label="Project principle">
        <p className="kicker">The point</p>
        <blockquote>
          It isn&apos;t cheap drinks. It&apos;s proving that gathering can be <em>transparent</em>, <em>affordable</em>, and still pay people fairly.
        </blockquote>
      </section>

      <section className="section why" id="why">
        <div className="why-copy">
          <p className="kicker">Why New York, why now</p>
          <h2>More places for hanging instead of spending.</h2>
          <p>
            New York&apos;s social and cultural life depends on rooms where strangers become neighbors, and people can develop ideas without worrying about money. But the cost of simply meeting others and hanging out  together keeps climbing.
          </p>
          <p>
            Nonprofit Bar NYC proposes a visible alternative: a licensed cultural bar that treats affordability as part of its public mission and makes allows everyone to work together to make it affordable month after month.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <span>FOR THE CITY</span>
            <strong>Activate an underused location with this unique approach.</strong>
          </div>
          <div className="why-card why-card-red">
            <span>FOR THE ROOM</span>
            <strong>Engage NYC's community and create a sense of shared ownership.</strong>
          </div>
          <div className="why-card why-card-green">
            <span>FOR THE PUBLIC</span>
            <strong>Show where the money goes and let the crowd move the month together.</strong>
          </div>
          <div className="why-card why-card-outline">
            <span>FOR THE MODEL</span>
            <strong>Publish results so other venues can learn from what worked and what didn&apos;t.</strong>
          </div>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join-copy">
          {/* <p className="kicker">This needs a city</p> */}
          <h2>Help make this happen! PLEASE!</h2>
          <p>We are looking for ideal locations (even temporary ones), venue partners, cultural funders, operators, technologists, city champions, and future regulars: there is a place for you at this table.</p>
        </div>
        <div className="role-links">
          {roles.map((role) => (
            <a
              key={role.label}
              href={`mailto:hello@please.nyc?subject=${encodeURIComponent(role.subject)}`}
            >
              <span>{role.label}</span><span>↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <a className="wordmark footer-mark" href="#top">
          <span>NONPROFIT BAR</span>
          <span className="wordmark-city">NYC</span>
        </a>
        <p>
          AN IDEA FOR A MORE AFFORDABLE CULTURAL CITY.{" "}
          <a href="https://please.nyc">A please.nyc project</a>
        </p>
        <p className="fine-print">
          Working concept. Alcohol would be sold only by a licensed operator. Organizational structure, pricing, and programming are subject to legal, tax, and regulatory review.
        </p>
      </footer>
    </main>
  );
}
