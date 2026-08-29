import { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Menu, X, Link2, ArrowRight } from "lucide-react";
import config from "../config/index.json";

const Header = () => {
  const { navigation, company, callToAction } = config;
  const { name: companyName, logo } = company;

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#") || !href.includes("://")) {
      e.preventDefault();
      const targetId = href.replace(/^#/, "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <svg
        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-background transform translate-x-1/2 pointer-events-none"
        fill="currentColor"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="50,0 100,0 50,100 0,100" />
      </svg>

      <Popover as="header" className="relative z-30">
        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
          <nav
            className="relative flex items-center justify-between sm:h-10 lg:justify-start"
            aria-label="Global"
          >
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <a href="#" className="flex items-center gap-2.5 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                    {companyName}
                  </span>
                </a>
                <div className="-mr-2 flex items-center md:hidden">
                  <PopoverButton className="bg-background rounded-lg p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                    <span className="sr-only">Open main menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </PopoverButton>
                </div>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:ml-10 md:pr-4 md:space-x-8">
              {navigation.map(item => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={e => scrollToSection(e, item.href)}
                  className="font-medium text-gray-600 hover:text-primary transition-colors cursor-pointer text-sm"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#shorten"
                onClick={e => scrollToSection(e, "shorten")}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover shadow-sm transition-all hover:shadow-md hover:shadow-red-500/20"
              >
                {callToAction.text}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <PopoverPanel
            focus
            className="absolute z-40 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            {({ close }) => (
              <div className="rounded-2xl shadow-xl bg-white ring-1 ring-black/5 overflow-hidden border border-gray-100">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900">
                      {companyName}
                    </span>
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="bg-white rounded-lg p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                      <span className="sr-only">Close main menu</span>
                      <X className="h-5 w-5" aria-hidden="true" />
                    </PopoverButton>
                  </div>
                </div>
                <div className="px-3 pt-4 pb-3 space-y-1">
                  {navigation.map(item => (
                    <a
                      key={item.name}
                      href={`#${item.href}`}
                      onClick={e => {
                        scrollToSection(e, item.href);
                        close();
                      }}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <a
                    href="#shorten"
                    onClick={e => {
                      scrollToSection(e, "shorten");
                      close();
                    }}
                    className="flex items-center justify-center gap-2 w-full px-5 py-2.5 text-center font-medium rounded-lg text-white bg-primary hover:bg-primary-hover shadow-sm"
                  >
                    {callToAction.text}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </>
  );
};

export default Header;
