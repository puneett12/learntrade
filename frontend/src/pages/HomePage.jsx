import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroIllustration from "../assets/market-hero.svg";

const highlights = [
  {
    title: "Market fundamentals",
    body: "Understand how exchanges work, what drives stock prices, and why diversification matters.",
  },
  {
    title: "Practical investing tips",
    body: "Get simple frameworks for reading charts, planning trades, and managing your first portfolio.",
  },
  {
    title: "Confidence through practice",
    body: "Use quizzes and bite-sized lessons to reinforce what you learn before risking real capital.",
  },
];

const marketPulseDefaults = [
  {
    symbol: "^DJI",
    label: "DOW JONES",
    change: 0.78,
    price: null,
    description: "Industrials are lifting the Dow as buyers rotate into cyclicals ahead of earnings.",
  },
  {
    symbol: "^GSPC",
    label: "S&P 500",
    change: 0.52,
    price: null,
    description: "Mega-cap tech continues to anchor the S&P 500; keep an eye on 50-day moving average support.",
  },
  {
    symbol: "^VIX",
    label: "VIX",
    change: -3.1,
    price: null,
    description: "Volatility remains subdued, signaling risk-on appetite but watch for sudden spikes near events.",
  },
];

const pulseSymbols = marketPulseDefaults.map((item) => item.symbol);
const watchlistSymbols = ["AAPL", "NVDA", "MSFT", "TSLA", "AMZN", "JPM"];

const watchlistSeed = [
  { symbol: "AAPL", name: "Apple Inc.", price: 193.42, change: 0.72 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 905.14, change: 1.55 },
  { symbol: "MSFT", name: "Microsoft", price: 417.76, change: -0.22 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 176.28, change: -1.8 },
  { symbol: "AMZN", name: "Amazon.com", price: 181.09, change: 0.38 },
  { symbol: "JPM", name: "JP Morgan", price: 200.44, change: 0.41 },
];

const liveStats = [
  { label: "Learners practicing this week", value: 591, suffix: "" },
  { label: "Lessons completed today", value: 318, suffix: "" },
  { label: "Average quiz score", value: 93, suffix: "%" },
];

const focusModes = {
  foundation: {
    title: "Foundations first",
    blurb: "Break down jargon with animations, analogies, and micro-quizzes.",
    bullets: ["Spot key ratios and statements", "Decode earnings reports", "Understand corporate actions"],
  },
  trading: {
    title: "Trading playbook",
    blurb: "Practice chart setups, entries, and exit rules using our risk simulators.",
    bullets: ["Map trend, pullback, and breakout setups", "Use stop placement frameworks", "Review case studies weekly"],
  },
  strategy: {
    title: "Strategy & mindset",
    blurb: "Create routines for goal setting, journaling, and steady improvements.",
    bullets: ["Build a weekly review habit", "Manage emotions with checklists", "Automate your progress tracking"],
  },
};

const testimonials = [
  {
    quote:
      "The mix of short videos and instant quizzes keeps me honest. My understanding of earnings calls changed in just two weeks.",
    author: "Sana Qureshi",
    role: "Investment Banker Goldman Sachs",
  },
  {
    quote:
      "LearnTrade gave me a repeatable routine for analyzing trends before risking money. The practice modules mimic real trades well.",
    author: "Priya Anand",
    role: "Marketing Manager JP Morgan Chase & Co",
  },
  {
    quote:
      "As a busy professional, I loved that lessons remember where I left off. The accountability reminders are a bonus.",
    author: "David Benjamin",
    role: "Quantitative Researcher Citadel",
  },
];

const journeyStages = [
  {
    label: "Orientation",
    marker: "Week 1",
    title: "Get your bearings",
    summary: "Set goals, baseline your knowledge, and customize a plan that fits your schedule.",
    bullets: ["Pick a path that matches your goals", "Complete your first checkpoint quiz", "Bookmark lessons for later"],
  },
  {
    label: "Practice",
    marker: "Weeks 2-3",
    title: "Apply the playbook",
    summary: "Use guided notebooks and screeners to connect price action with narratives.",
    bullets: [
      "Build a watchlist with structured notes",
      "Simulate trades with risk controls",
      "Discuss tricky scenarios in community prompts",
    ],
  },
  {
    label: "Mastery",
    marker: "Weeks 4+",
    title: "Scale your confidence",
    summary: "Refine your strategy, document learnings, and repeat a sustainable review cadence.",
    bullets: ["Log every trade idea for review", "Spot improvement themes using analytics", "Share wins with mentors"],
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const [marketPulse, setMarketPulse] = useState(marketPulseDefaults);
  const [pulseError, setPulseError] = useState("");
  const [activePulse, setActivePulse] = useState(0);
  const [activeFocus, setActiveFocus] = useState("foundation");
  const [displayStats, setDisplayStats] = useState(liveStats.map(() => 0));
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeJourney, setActiveJourney] = useState(0);
  const [watchlist, setWatchlist] = useState(watchlistSeed);
  const [pinnedTickers, setPinnedTickers] = useState(["AAPL", "NVDA"]);
  const [watchlistError, setWatchlistError] = useState("");
  const [isFetchingWatchlist, setIsFetchingWatchlist] = useState(false);
  const [isFetchingPulse, setIsFetchingPulse] = useState(false);
  const fmpApiKey = import.meta.env.VITE_FMP_API_KEY || "demo";

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % marketPulse.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancel = false;
    const fetchPulse = async () => {
      try {
        setIsFetchingPulse(true);
        const symbolsQuery = pulseSymbols.map((symbol) => encodeURIComponent(symbol)).join(",");
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${symbolsQuery}?apikey=${fmpApiKey}`
        );
        if (!response.ok) {
          throw new Error("Unable to reach Financial Modeling Prep");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from Financial Modeling Prep");
        }
        if (!cancel) {
          setMarketPulse((current) =>
            current.map((item) => {
              const liveQuote = data.find((quote) => quote.symbol === item.symbol);
              if (!liveQuote) {
                return item;
              }
              const price = typeof liveQuote.price === "number" ? liveQuote.price : item.price;
              const change =
                typeof liveQuote.changesPercentage === "number"
                  ? parseFloat(liveQuote.changesPercentage.toFixed(2))
                  : item.change;
              return {
                ...item,
                price,
                change,
              };
            })
          );
          setPulseError("");
        }
      } catch (err) {
        if (!cancel) {
          console.error(err);
          setPulseError("Unable to refresh market pulse. Showing last known snapshot.");
        }
      } finally {
        if (!cancel) {
          setIsFetchingPulse(false);
        }
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 60000);
    return () => {
      cancel = true;
      clearInterval(interval);
    };
  }, [fmpApiKey]);

  useEffect(() => {
    let cancel = false;
    const fetchQuotes = async () => {
      try {
        setIsFetchingWatchlist(true);
        const symbolsQuery = watchlistSymbols.join(",");
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/quote/${symbolsQuery}?apikey=${fmpApiKey}`
        );
        if (!response.ok) {
          throw new Error("Unable to reach Financial Modeling Prep");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from Financial Modeling Prep");
        }
        if (!cancel) {
          setWatchlist((current) =>
            current.map((item) => {
              const liveQuote = data.find((quote) => quote.symbol === item.symbol);
              if (!liveQuote) {
                return item;
              }
              const price = typeof liveQuote.price === "number" ? liveQuote.price : item.price;
              const change =
                typeof liveQuote.changesPercentage === "number" ? liveQuote.changesPercentage : item.change;
              return {
                ...item,
                price,
                change,
              };
            })
          );
          setWatchlistError("");
        }
      } catch (err) {
        if (!cancel) {
          console.error(err);
          setWatchlistError("Live quotes temporarily unavailable. Showing last known values.");
        }
      } finally {
        if (!cancel) {
          setIsFetchingWatchlist(false);
        }
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => {
      cancel = true;
      clearInterval(interval);
    };
  }, [fmpApiKey]);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 40;
    const timer = setInterval(() => {
      frame += 1;
      setDisplayStats(
        liveStats.map((stat) => {
          const progress = Math.min(frame / totalFrames, 1);
          return Math.round(stat.value * progress);
        })
      );
      if (frame >= totalFrames) {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const rotation = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(rotation);
  }, []);

  const togglePin = (symbol) => {
    setPinnedTickers((prev) =>
      prev.includes(symbol) ? prev.filter((item) => item !== symbol) : [...prev, symbol]
    );
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    const aPinned = pinnedTickers.includes(a.symbol);
    const bPinned = pinnedTickers.includes(b.symbol);
    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }
    return a.symbol.localeCompare(b.symbol);
  });

  return (
    <div className="page home-page">
      <section className="home-hero card">
        <div className="home-hero-content">
          <p className="home-pill">LearnTrade</p>
          <h1>Welcome to LearnTrade</h1>
          <p className="home-hero-text">
            We focus on clarity, context, and confidence. Whether you are opening
            a brokerage account or refining your strategy, LearnTrade keeps the
            noise out so you can focus on smart decisions.
          </p>
          <div className="home-hero-actions">
            {user ? (
              <>
                <Link to="/modules">
                  <button className="btn btn-primary">Go to modules</button>
                </Link>
                <Link to="/progress" className="btn btn-ghost">
                  Track progress
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-ghost">Log in</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-primary">Sign up</button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="home-hero-visual">
          <img src={heroIllustration} alt="Stylized stock market trends" />
        </div>
        <div className="home-hero-panel">
          <div className="home-hero-stat">
            <span className="stat-value">15+</span>
            <span className="stat-label">Guided lessons</span>
          </div>
          <div className="home-hero-stat">
            <span className="stat-value">4</span>
            <span className="stat-label">Learning paths</span>
          </div>
          <div className="home-hero-stat">
            <span className="stat-value">Unlimited</span>
            <span className="stat-label">Practice quizzes</span>
          </div>
        </div>
      </section>

      <div className="insights-grid">
        <section className="market-ticker card">
          <div className="ticker-header">
            <span className="ticker-title">Market pulse</span>
            <div className="ticker-meta">
              <span className={`watchlist-status ${isFetchingPulse ? "pending" : "ok"}`}>
                {isFetchingPulse ? "Refreshing…" : "Live"}
              </span>
            </div>
          </div>
          {pulseError && <p className="ticker-error">{pulseError}</p>}
          <div className="ticker-items">
            {marketPulse.map((item, index) => (
              <button
                type="button"
                key={item.label}
                className={`ticker-item ${index === activePulse ? "active" : ""}`}
                onClick={() => setActivePulse(index)}
              >
                <span>{item.label}</span>
                <span className={item.change >= 0 ? "ticker-change up" : "ticker-change down"}>
                  {item.change >= 0 ? "+" : ""}
                  {item.change}%
                </span>
              </button>
            ))}
          </div>
          <p className="ticker-description">
            {marketPulse[activePulse].description}
            {typeof marketPulse[activePulse].price === "number" &&
              !Number.isNaN(marketPulse[activePulse].price) &&
              marketPulse[activePulse].price !== null &&
              marketPulse[activePulse].price !== 0 && (
                <>
                  {" "}
                  · Last{" "}
                  <strong>
                    {marketPulse[activePulse].price.toFixed(2)} {marketPulse[activePulse].symbol === "^VIX" ? "" : "pts"}
                  </strong>
                </>
              )}
          </p>
        </section>

        <section className="live-stats card">
          <div className="live-stats-grid">
            {liveStats.map((stat, index) => (
              <div key={stat.label} className="live-stat-card">
                <span className="live-stat-value">
                  {displayStats[index].toLocaleString()}
                  {stat.suffix && <span className="live-stat-suffix">{stat.suffix}</span>}
                </span>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="watchlist-section card">
        <div className="watchlist-header">
          <div>
            <h2 className="section-title">Realtime watchlist</h2>
            <p className="section-subtitle">
              Live quotes refresh about once a minute.
            </p>
          </div>
          <div className="watchlist-note">
            <span className={`watchlist-status ${isFetchingWatchlist ? "pending" : "ok"}`}>
              {isFetchingWatchlist ? "Refreshing…" : "Live"}
            </span>
          </div>
        </div>
        {watchlistError && <p className="watchlist-error">{watchlistError}</p>}
        <div className="watchlist-table">
          <div className="watchlist-row head">
            <span>Symbol</span>
            <span>Last</span>
            <span>Today</span>
            <span>Pin</span>
          </div>
          {sortedWatchlist.map((item) => {
            const isPinned = pinnedTickers.includes(item.symbol);
            return (
              <div key={item.symbol} className={`watchlist-row ${isPinned ? "pinned" : ""}`}>
                <div className="watchlist-symbol">
                  <span className="symbol">{item.symbol}</span>
                  <span className="name">{item.name}</span>
                </div>
                <span className="watchlist-price">${item.price.toFixed(2)}</span>
                <span className={`watchlist-change ${item.change >= 0 ? "up" : "down"}`}>
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
                <button
                  type="button"
                  className={`watchlist-pin ${isPinned ? "active" : ""}`}
                  onClick={() => togglePin(item.symbol)}
                  aria-label={`${isPinned ? "Unpin" : "Pin"} ${item.symbol}`}
                >
                  {isPinned ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>
        <p className="watchlist-pin-hint">
          <span className="watchlist-pin watchlist-pin-static active">★</span> Pin your favourites
        </p>
      </section>

      <section className="section-block home-testimonials">
        <div className="section-header column">
          <div>
            <h2 className="section-title">Learners share their wins</h2>
            <p className="section-subtitle">Stories rotate automatically, or tap a dot to pick one.</p>
          </div>
          <div className="testimonial-nav">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === activeTestimonial ? "active" : ""}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <article className="testimonial-card card">
          <p className="testimonial-quote">“{testimonials[activeTestimonial].quote}”</p>
          <p className="testimonial-author">
            {testimonials[activeTestimonial].author} · {testimonials[activeTestimonial].role}
          </p>
        </article>
      </section>

      <section className="section-block focus-section">
        <div className="section-header column">
          <div>
            <h2 className="section-title">Choose your learning mode</h2>
            <p className="section-subtitle">
              Toggle through the focus areas below to see what you will master.
            </p>
          </div>
        </div>
        <div className="focus-switcher card">
          <div className="focus-tabs">
            {Object.keys(focusModes).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFocus(key)}
                className={`focus-tab ${activeFocus === key ? "active" : ""}`}
                type="button"
              >
                {focusModes[key].title}
              </button>
            ))}
          </div>
          <div className="focus-details">
            <p className="focus-blurb">{focusModes[activeFocus].blurb}</p>
            <ul>
              {focusModes[activeFocus].bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header column">
          <div>
            <h2 className="section-title">Why learn with LearnTrade?</h2>
            <p className="section-subtitle">
              We help you connect the dots between headlines and healthy portfolios.
            </p>
          </div>
        </div>
        <div className="home-info-grid">
          {highlights.map((item) => (
            <article key={item.title} className="home-info-card card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header column">
          <div>
            <h2 className="section-title">Track your learning journey</h2>
            <p className="section-subtitle">Tap each milestone to see what you will focus on during that phase.</p>
          </div>
        </div>
        <div className="journey card">
          <div className="journey-steps">
            {journeyStages.map((stage, index) => (
              <button
                key={stage.label}
                type="button"
                className={`journey-step ${index === activeJourney ? "active" : ""}`}
                onClick={() => setActiveJourney(index)}
              >
                <span className="journey-step-index">{index + 1}</span>
                <div>
                  <p className="journey-step-label">{stage.label}</p>
                  <p className="journey-step-marker">{stage.marker}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="journey-detail">
            <h3>{journeyStages[activeJourney].title}</h3>
            <p>{journeyStages[activeJourney].summary}</p>
            <ul>
              {journeyStages[activeJourney].bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {!user && (
              <Link to="/register" className="btn btn-primary journey-cta">
                Start this track
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
