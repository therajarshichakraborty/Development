import { Link2, Heart } from "lucide-react";
import config from "../config/index.json";

const About = () => {
  const { company, about } = config;
  const { name: companyName } = company;
  const { socialMedia, sections } = about;

  return (
    <footer
      id="about"
      className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              {companyName}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {sections.map((section, index) => (
              <a
                key={`${section.name}-${index}`}
                href={section.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {section.name}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              aria-label="github"
              href={socialMedia.github}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              aria-label="linkedin"
              href={socialMedia.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.92-2.07 2.06-2.07 1.14 0 2.06.93 2.06 2.07 0 1.14-.92 2.07-2.06 2.07zM20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28z" />
              </svg>
            </a>
            <a
              aria-label="twitter"
              href={socialMedia.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          <div className="w-full max-w-sm h-px bg-gray-800" />

          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>
              &copy; {new Date().getFullYear()} {companyName}. Built with
            </span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>using Vite &amp; React.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default About;
