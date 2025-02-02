import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BriefcaseIcon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
  RssIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  BookOpenIcon,
  HeartIcon,
  TrendingUpIcon
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & About */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">TalentLink</span>
            </Link>
            <p className="mt-4 text-gray-500">
              Connecting talented professionals with exciting opportunities worldwide. Join our community of job seekers and recruiters.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <MailIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <PhoneIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <MapPinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/messages" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Career Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Resume Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Interview Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Salary Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Industry Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Press Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4 text-center">
            Connect With Us
          </h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#1DA1F2] transition-colors">
              <TwitterIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
              <LinkedinIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#24292F] transition-colors">
              <GithubIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E4405F] transition-colors">
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#FF0000] transition-colors">
              <YoutubeIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1877F2] transition-colors">
              <FacebookIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#EE802F] transition-colors">
              <RssIcon className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Stats - Only shown on home page */}
        {isHomePage && (
          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <GlobeIcon className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">150+</p>
                <p className="text-sm text-gray-500">Countries</p>
              </div>
              <div>
                <BookOpenIcon className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">10k+</p>
                <p className="text-sm text-gray-500">Job Posts</p>
              </div>
              <div>
                <HeartIcon className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-500">Satisfaction Rate</p>
              </div>
              <div>
                <TrendingUpIcon className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">50k+</p>
                <p className="text-sm text-gray-500">Success Stories</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              © {currentYear} TalentLink. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}