const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-block">
          <p className="footer-heading">About Us</p>
          <p className="footer-text">
            We are building a modern learning portal that makes stock market
            education approachable for investors of every level. Our lessons,
            quizzes, and practical modules are created by market practitioners
            so you only spend time on what matters.
          </p>
        </div>

        <div className="footer-block">
          <p className="footer-heading">Help &amp; Support</p>
          <a className="footer-link" href="mailto:support@stockpath.com">
            support@learntrade.com
          </a>
          <a className="footer-link" href="tel:+12345678900">
            +1 (234) 567-8900
          </a>
          <p className="footer-text">
            Our support team is available 7 days a week to answer platform or
            curriculum questions.
          </p>
        </div>

        <div className="footer-block">
          <p className="footer-heading">Account Controls</p>
          <p className="footer-text">
            Need to make changes to your profile or want to leave the platform?
            We make it simple to manage your privacy.
          </p>
          <a
            className="footer-link footer-link-strong"
            href="mailto:support@stockpath.com?subject=Delete%20my%20account"
          >
            Request Delete Account
          </a>
          <span className="footer-note">
            Deletions are processed within 24 hours after we confirm the
            request.
          </span>
        </div>
      </div>
      <div className="footer-meta">
        <span>© {currentYear} LearnTrade Learning</span>
        <div className="footer-meta-links">
          <a className="footer-link" href="#">
            Privacy
          </a>
          <a className="footer-link" href="#">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
